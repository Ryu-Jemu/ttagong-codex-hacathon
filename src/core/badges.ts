import type { DemoState } from './fixtures';
import type { DemoAlert } from './types';

type BadgeProgress = { storyCount: number; liked: boolean; recommended: boolean };

const definitions = {
  'first-story': {
    title: '첫 이야기',
    description: '이야기 한 편 올리기',
    qualifies: ({ storyCount }: BadgeProgress) => storyCount >= 1,
  },
  'story-keeper': {
    title: '이웃 기록가',
    description: '이야기 다섯 편 올리기',
    qualifies: ({ storyCount }: BadgeProgress) => storyCount >= 5,
  },
  'first-heart': {
    title: '다정한 독자',
    description: '좋아요 한 번 누르기',
    qualifies: ({ liked }: BadgeProgress) => liked,
  },
  'first-song': {
    title: '첫 선곡',
    description: '노래 한 곡 추천하기',
    qualifies: ({ recommended }: BadgeProgress) => recommended,
  },
};

export type DemoBadgeId = keyof typeof definitions;
export type DemoBadge = { id: DemoBadgeId; title: string; description: string; earned: boolean };

const badgeIds = Object.keys(definitions) as DemoBadgeId[];

export function isBadgeId(value: unknown): value is DemoBadgeId {
  return typeof value === 'string' && Object.hasOwn(definitions, value);
}

export function listBadges(earned: readonly DemoBadgeId[]): DemoBadge[] {
  return badgeIds.map((id) => ({
    id,
    title: definitions[id].title,
    description: definitions[id].description,
    earned: earned.includes(id),
  }));
}

export function makeBadgeAlert(id: DemoBadgeId, read = false): DemoAlert {
  return { id: `badge-${id}`, kind: 'badge', text: `‘${definitions[id].title}’ 배지를 받았어요.`, read };
}

export function awardBadges(state: DemoState, author: { authorId: string; authorName: string }): DemoState {
  const progress = {
    storyCount: state.posts.filter(({ authorId }) => authorId === author.authorId).length,
    liked: state.posts.some(({ hearted }) => hearted),
    recommended: state.recommendations.some(({ authorName }) => authorName === author.authorName),
  };
  const earned = badgeIds.filter((id) => !state.earnedBadgeIds.includes(id) && definitions[id].qualifies(progress));
  if (!earned.length) return state;

  const alertIds = new Set(state.alerts.map(({ id }) => id));
  const newAlerts = earned.map((id) => makeBadgeAlert(id)).filter(({ id }) => !alertIds.has(id));
  return {
    ...state,
    earnedBadgeIds: [...state.earnedBadgeIds, ...earned],
    alerts: [...newAlerts, ...state.alerts],
  };
}
