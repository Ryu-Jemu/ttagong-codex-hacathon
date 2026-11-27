import assert from "node:assert/strict";
import { test } from "node:test";
import { getWarmth, regions } from "./index.ts";
import type { Region } from "./index.ts";

const region: Region = {
  id: "1100000000",
  name: "서울특별시",
  shortName: "서울",
  population: 100_000,
  row: 1,
  col: 2,
};
const now = new Date("2026-11-26T15:30:00.000Z");

function post(authorId: string, createdAt = now.toISOString(), regionId = region.id) {
  return { authorId, regionId, createdAt };
}

test("regions match the current 16-province grid and national population total", () => {
  assert.equal(regions.length, 16);
  assert.equal(new Set(regions.map(({ id }) => id)).size, 16);
  assert.equal(new Set(regions.map(({ row, col }) => `${row},${col}`)).size, 16);
  assert.ok(regions.every(({ row, col }) => row >= 1 && row <= 6 && col >= 1 && col <= 4));
  assert.deepEqual(
    regions.find(({ id }) => id === "1200000000"),
    { id: "1200000000", name: "전남광주통합특별시", shortName: "전남광주", population: 3_152_970, row: 4, col: 2 },
  );
  assert.deepEqual(
    regions.filter(({ shortName }) => shortName === "제주").map(({ row, col }) => [row, col]),
    [[6, 1]],
  );
  assert.equal(regions.reduce((sum, entry) => sum + entry.population, 0), 51_075_282);
});

test("uses seven KST calendar dates and counts each author once per date in the region", () => {
  const posts = [
    post("too-old", "2026-11-20T14:59:59.999Z"),
    post("a", "2026-11-20T15:00:00.000Z"),
    post("a", "2026-11-21T10:00:00+09:00"),
    post("a", "2026-11-21T15:00:00.000Z"),
    post("b", "2026-11-26T14:59:59.999Z"),
    post("b", "2026-11-26T15:00:00.000Z"),
    post("c"),
    post("future", "2026-11-26T15:30:00.001Z"),
    post("other-region", now.toISOString(), "2600000000"),
  ];
  assert.deepEqual(getWarmth(posts, region, now), { score: 5, count: 5, authors: 3 });
  assert.deepEqual(
    getWarmth(posts, region, new Date("2026-11-26T14:59:59.999Z")),
    { score: 4, count: 4, authors: 3 },
  );
});

test("excludes invalid dates, including rollover and local timestamps without an offset", () => {
  const march = new Date("2026-03-02T00:00:00Z");
  assert.deepEqual(
    getWarmth(
      [
        post("rollover", "2026-02-30T01:00:00Z"),
        post("no-offset", "2026-03-01T12:00:00"),
        post("date-only", "2026-03-01"),
        post("invalid", "invalid"),
        post("valid", "2026-03-01T12:00:00Z"),
      ],
      region,
      march,
    ),
    { score: null, count: 1, authors: 1 },
  );
});

test("requires three distinct authors and scales inversely with a positive population", () => {
  const posts = [post("a"), post("b"), post("a", "2026-11-25T15:00:00Z")];
  assert.deepEqual(getWarmth(posts, region, now), { score: null, count: 3, authors: 2 });

  posts.push(post("c"));
  const small = getWarmth(posts, region, now);
  const large = getWarmth(posts, { ...region, population: 1_000_000 }, now);
  assert.deepEqual(small, { score: 4, count: 4, authors: 3 });
  assert.deepEqual(large, { score: 0.4, count: 4, authors: 3 });
  assert.deepEqual(getWarmth(posts, { ...region, population: 0 }, now), {
    score: null,
    count: 4,
    authors: 3,
  });
});

test("the published-post input changes only when a fourth demo author is published", () => {
  const published = [post("seed-1"), post("seed-2"), post("seed-3")];
  const candidate = post("demo-author");

  assert.deepEqual(getWarmth(published, region, now), { score: 3, count: 3, authors: 3 });
  assert.deepEqual(getWarmth([...published, candidate], region, now), { score: 4, count: 4, authors: 4 });
});
