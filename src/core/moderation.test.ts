import assert from 'node:assert/strict';
import { test } from 'node:test';
import { makeDemoState, DEMO_AUTHOR } from './fixtures.ts';
import { parseModerationResult, validModerationText } from './moderation.ts';
import { getWarmth, regions } from '../regions/index.ts';

test('only recognized decision and reason pairs can approve a story', () => {
  const allowed = { decision: 'APPROVED', reasonCode: 'WARM_STORY' };
  assert.deepEqual(parseModerationResult(allowed), allowed);

  const blocked = { decision: 'BLOCKED', reasonCode: 'PRIVATE_INFO' };
  const hold = { decision: 'HOLD', reasonCode: 'AMBIGUOUS' };
  assert.deepEqual(parseModerationResult(blocked), blocked);
  assert.deepEqual(parseModerationResult(hold), hold);
  for (const output of [
    { decision: 'APPROVED' },
    { decision: 'APPROVED', reasonCode: 'HARMFUL' },
    { decision: 'BLOCKED', reasonCode: 'WARM_STORY' },
    'APPROVED',
    null,
  ]) {
    assert.deepEqual(parseModerationResult(output), { decision: 'UNAVAILABLE' });
  }
});

test('the story requires nonblank title and body within the form bounds', () => {
  assert.equal(validModerationText('가'.repeat(100), '나'.repeat(1_000)), true);
  assert.equal(validModerationText('가'.repeat(101), '본문'), false);
  assert.equal(validModerationText('제목', '나'.repeat(1_001)), false);
  assert.equal(validModerationText(' ', '본문'), false);
  assert.equal(validModerationText('제목', 1), false);
});

test('Seoul has three recent fixture authors distinct from the local demo author', () => {
  const now = Date.parse('2026-11-27T05:00:00Z');
  const region = regions.find(({ id }) => id === '1100000000');
  assert.ok(region);
  const seoul = makeDemoState(now).posts.filter((post) => post.regionId === region.id);
  const recent = seoul.filter((post) => now - Date.parse(post.createdAt) < 3 * 86_400_000);
  assert.equal(new Set(recent.map((post) => post.authorId)).size, 3);
  assert.equal(getWarmth(seoul, region, new Date(now)).points, 3);
  for (const post of recent) {
    assert.notEqual(post.authorId, DEMO_AUTHOR.authorId);
    const age = now - Date.parse(post.createdAt);
    assert.ok(age >= 0 && age < 3 * 86_400_000);
  }
});
