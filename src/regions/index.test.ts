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

function post(id: string, createdAt = now.toISOString(), regionId = region.id, authorId = 'same-author') {
  return { id, regionId, createdAt, authorId };
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

test("uses seven KST calendar dates and awards one point per distinct story in the region", () => {
  const posts = [
    post("too-old", "2026-11-20T14:59:59.999Z"),
    post("a", "2026-11-20T15:00:00.000Z"),
    post("b", "2026-11-21T10:00:00+09:00"),
    post("c", "2026-11-21T15:00:00.000Z"),
    post("d", "2026-11-26T14:59:59.999Z"),
    post("e", "2026-11-26T15:00:00.000Z"),
    post("f"),
    post("f"),
    post("future", "2026-11-26T15:30:00.001Z"),
    post("other-region", now.toISOString(), "2600000000"),
  ];
  assert.deepEqual(getWarmth(posts, region, now), { points: 6, score: 6 });
  assert.deepEqual(
    getWarmth(posts, region, new Date("2026-11-26T14:59:59.999Z")),
    { points: 5, score: 5 },
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
    { points: 1, score: 1 },
  );
});

test("shows zero and the first point, and normalizes for different populations", () => {
  const posts = [post("first")];
  assert.deepEqual(getWarmth([], region, now), { points: 0, score: 0 });
  assert.deepEqual(getWarmth(posts, region, now), { points: 1, score: 1 });
  assert.deepEqual(getWarmth(posts, { ...region, population: 1_000_000 }, now), { points: 1, score: 0.1 });
  assert.deepEqual(getWarmth(posts, { ...region, population: 0 }, now), { points: 1, score: null });
});

test("only a newly published story changes the region's points", () => {
  const published = [post("seed-1"), post("seed-2"), post("seed-3")];
  const candidate = post("demo-author");

  assert.deepEqual(getWarmth(published, region, now), { points: 3, score: 3 });
  assert.deepEqual(getWarmth([...published, candidate], region, now), { points: 4, score: 4 });
});
