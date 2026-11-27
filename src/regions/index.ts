import { krmapTiles } from './krmap-tiles.ts';

export type Region = {
  id: string;
  name: string;
  shortName: string;
  population: number;
  row: number;
  col: number;
};

// 행정안전부의 2026년 10월 주민등록 인구. 위치와 축약명은 krmap 원본을 가공한 모듈에서 가져온다.
const residentPopulations = [
  { id: "1100000000", name: "서울특별시", population: 9_274_392 },
  { id: "1200000000", name: "전남광주통합특별시", population: 3_152_970 },
  { id: "2600000000", name: "부산광역시", population: 3_226_446 },
  { id: "2700000000", name: "대구광역시", population: 2_345_185 },
  { id: "2800000000", name: "인천광역시", population: 3_070_203 },
  { id: "3000000000", name: "대전광역시", population: 1_443_171 },
  { id: "3100000000", name: "울산광역시", population: 1_085_888 },
  { id: "3600000000", name: "세종특별자치시", population: 390_618 },
  { id: "4100000000", name: "경기도", population: 13_780_735 },
  { id: "5100000000", name: "강원특별자치도", population: 1_506_690 },
  { id: "4300000000", name: "충청북도", population: 1_602_382 },
  { id: "4400000000", name: "충청남도", population: 2_140_278 },
  { id: "5200000000", name: "전북특별자치도", population: 1_715_109 },
  { id: "4700000000", name: "경상북도", population: 2_489_894 },
  { id: "4800000000", name: "경상남도", population: 3_189_204 },
  { id: "5000000000", name: "제주특별자치도", population: 662_117 },
] as const;

export const regions: readonly Region[] = residentPopulations.map((region) => ({
  ...region,
  ...krmapTiles[region.name],
}));

type PublicPost = {
  authorId: string;
  regionId: string;
  createdAt: string;
};

const hourMs = 60 * 60 * 1_000;
const dayMs = 24 * hourMs;
const kstOffsetMs = 9 * hourMs;
const isoTimestamp = /^(\d{4}-(?:0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):?[0-5]\d)$/;

function parseTimestamp(value: string): number {
  const match = isoTimestamp.exec(value);
  if (!match) return NaN;

  // Date.parse can roll February 30 into March even with an ISO timestamp.
  const [, date, day] = match;
  if (new Date(`${date}T00:00:00Z`).getUTCDate() !== Number(day)) return NaN;

  return Date.parse(value);
}

/** Callers pass published posts after moderation has approved them. */
export function getWarmth(
  posts: readonly PublicPost[],
  region: Region,
  now = new Date(),
): { score: number | null; count: number; authors: number } {
  const nowMs = now.getTime();
  if (!Number.isFinite(nowMs)) return { score: null, count: 0, authors: 0 };

  const todayKst = Math.floor((nowMs + kstOffsetMs) / dayMs);
  const firstDayKst = todayKst - 6;
  const daysByAuthor = new Map<string, Set<number>>();
  let count = 0;

  for (const post of posts) {
    if (post.regionId !== region.id) continue;

    const time = parseTimestamp(post.createdAt);
    if (!Number.isFinite(time) || time > nowMs) continue;

    const dayKst = Math.floor((time + kstOffsetMs) / dayMs);
    if (dayKst < firstDayKst) continue;

    let days = daysByAuthor.get(post.authorId);
    if (!days) {
      days = new Set<number>();
      daysByAuthor.set(post.authorId, days);
    }

    if (!days.has(dayKst)) {
      days.add(dayKst);
      count++;
    }
  }

  const authors = daysByAuthor.size;
  const hasSample = authors >= 3 && Number.isFinite(region.population) && region.population > 0;
  return { score: hasSample ? (100_000 * count) / region.population : null, count, authors };
}
