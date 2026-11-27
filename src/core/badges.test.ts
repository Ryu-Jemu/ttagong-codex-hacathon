import assert from 'node:assert/strict';
import test from 'node:test';
import { awardBadges, listBadges } from './badges.ts';
import { DEMO_AUTHOR, makeDemoState } from './fixtures.ts';

test('new demos start with two earned badges and only like and badge notifications', () => {
  const state = makeDemoState();

  assert.deepEqual(
    listBadges(state.earnedBadgeIds).map(({ id, earned }) => [id, earned]),
    [
      ['first-story', true],
      ['story-keeper', false],
      ['first-heart', false],
      ['first-song', true],
    ],
  );
  assert.deepEqual(state.alerts.map(({ kind }) => kind), ['like', 'badge', 'like', 'badge']);
  assert.equal(awardBadges(state, DEMO_AUTHOR), state);
});

test('a first like awards the reader badge once and unliking keeps the award', () => {
  const state = makeDemoState();
  const likedPosts = [{ ...state.posts[0], hearted: true }, ...state.posts.slice(1)];
  const afterLike = awardBadges({ ...state, posts: likedPosts }, DEMO_AUTHOR);
  const afterUnlike = awardBadges({ ...afterLike, posts: state.posts }, DEMO_AUTHOR);
  const afterRelike = awardBadges({ ...afterUnlike, posts: likedPosts }, DEMO_AUTHOR);

  assert(afterUnlike.earnedBadgeIds.includes('first-heart'));
  assert.equal(afterRelike.alerts.filter(({ id }) => id === 'badge-first-heart').length, 1);
  assert(!makeDemoState().earnedBadgeIds.includes('first-heart'));
});

test('the record keeper badge requires five stories from the demo author', () => {
  const state = makeDemoState();
  const fourth = { ...state.posts[0], ...DEMO_AUTHOR, id: 'fourth-own-story' };
  const fifth = { ...fourth, id: 'fifth-own-story' };
  const history = awardBadges({ ...state, posts: [fourth, ...state.posts] }, DEMO_AUTHOR);
  assert(!history.earnedBadgeIds.includes('story-keeper'));

  const earned = awardBadges({ ...history, posts: [fifth, ...history.posts] }, DEMO_AUTHOR);
  assert(earned.earnedBadgeIds.includes('story-keeper'));
  assert.equal(earned.alerts.filter(({ id }) => id === 'badge-story-keeper').length, 1);
});
