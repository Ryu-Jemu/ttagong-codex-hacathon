import assert from 'node:assert/strict';
import { test } from 'node:test';
import { regions } from '../regions/index.ts';
import { makeDemoState } from './fixtures.ts';

test('every region has five to seven distinct stories and authors to explore', () => {
  const { posts } = makeDemoState();
  assert.equal(new Set(posts.map(({ id }) => id)).size, posts.length);
  assert.equal(new Set(posts.map(({ title }) => title)).size, posts.length);

  for (const region of regions) {
    const stories = posts.filter(({ regionId }) => regionId === region.id);
    assert.ok(stories.length >= 5 && stories.length <= 7, `${region.name} needs five to seven stories`);
    assert.equal(new Set(stories.map(({ authorId }) => authorId)).size, stories.length, `${region.name} needs distinct authors`);
  }
});
