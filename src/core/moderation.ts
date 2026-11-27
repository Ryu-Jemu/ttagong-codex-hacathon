import type { ModerationResult } from './types';

export const TITLE_LIMIT = 100;
export const BODY_LIMIT = 1_000;
export const MUSIC_REASON_LIMIT = 500;

export function validModerationText(title: unknown, body: unknown): boolean {
  return (
    typeof title === 'string' && title.length <= TITLE_LIMIT && title.trim().length > 0 &&
    typeof body === 'string' && body.length <= BODY_LIMIT && body.trim().length > 0
  );
}

export function parseModerationResult(value: unknown): ModerationResult {
  if (typeof value !== 'object' || value === null) return { decision: 'UNAVAILABLE' };

  const { decision, reasonCode } = value as Record<string, unknown>;
  if (decision === 'APPROVED' && reasonCode === 'WARM_STORY') return { decision, reasonCode };
  if (decision === 'HOLD' && reasonCode === 'AMBIGUOUS') return { decision, reasonCode };
  if (decision === 'BLOCKED' && (reasonCode === 'CRITICISM' || reasonCode === 'HARMFUL' || reasonCode === 'PRIVATE_INFO')) {
    return { decision, reasonCode };
  }
  return { decision: 'UNAVAILABLE' };
}
