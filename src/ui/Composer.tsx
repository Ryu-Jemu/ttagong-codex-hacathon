import type { FormEvent } from 'react'
import type { ModerationResult } from '../core/types'
import { regions, STORY_WARMTH_POINTS } from '../regions'
import { Icon } from './Icon'

export type Draft = { title: string; body: string; regionId: string }
export type Review = { decision: 'PENDING' } | (ModerationResult & { regionId: string })

const reviewText = {
  PENDING: ['심사 중', ''],
  APPROVED: ['게시 완료', ''],
  BLOCKED: ['게시 차단', '글을 수정한 뒤 다시 요청해 주세요.'],
  HOLD: ['심사 보류', '이야기의 맥락을 더 적고 다시 요청해 주세요.'],
  UNAVAILABLE: ['심사 실패', '입력은 그대로 있습니다. 다시 요청해 주세요.'],
} satisfies Record<Review['decision'], [string, string]>

const reasonText = {
  CRITICISM: '도움이나 감사의 경험을 중심으로 적어 주세요.',
  HARMFUL: '타인을 공격하거나 조롱하는 표현을 지워 주세요.',
  PRIVATE_INFO: '다른 사람의 개인정보를 지워 주세요.',
} as const

export function Composer({ draft, review, onChange, onSubmit, onRegion }: {
  draft: Draft
  review: Review | null
  onChange: (field: keyof Draft, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onRegion: (regionId: string) => void
}) {
  const pending = review?.decision === 'PENDING'
  const result = review && reviewText[review.decision]
  const reason = review?.decision === 'BLOCKED' && review.reasonCode
  const guidance = reason && reason in reasonText ? reasonText[reason as keyof typeof reasonText] : undefined
  const retry = review?.decision === 'UNAVAILABLE' || review?.decision === 'HOLD' || review?.decision === 'BLOCKED'
  const publishedRegion = review?.decision === 'APPROVED' && regions.find(({ id }) => id === review.regionId)
  const detail = publishedRegion ? `${publishedRegion.shortName} 온기 +${STORY_WARMTH_POINTS}P` : guidance || result?.[1]

  return (
    <form className="surface composer" onSubmit={onSubmit}>
      <p className="inline-note" id="draft-privacy">
        <Icon name="info" />
        <span>제목과 본문은 심사를 위해 Codex로 전달됩니다. 승인된 글과 활동은 이 브라우저에 저장됩니다.</span>
      </p>
      <fieldset disabled={pending} aria-describedby="draft-privacy">
        <legend className="visually-hidden">이야기 내용</legend>
        <label htmlFor="story-title">제목</label>
        <input id="story-title" required maxLength={100} value={draft.title}
          placeholder="글 제목"
          onChange={(event) => onChange('title', event.target.value)} />
        <label htmlFor="story-region">일이 있었던 지역</label>
        <select id="story-region" aria-describedby="region-point-help" required value={draft.regionId}
          onChange={(event) => onChange('regionId', event.target.value)}>
          <option value="">광역 지역 선택</option>
          {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
        </select>
        <p id="region-point-help" className="region-point-help">승인된 소식은 선택한 지역에 온기 {STORY_WARMTH_POINTS}P를 더해요.</p>
        <label htmlFor="story-body">본문</label>
        <textarea id="story-body" required maxLength={1000} rows={7} value={draft.body}
          aria-describedby="story-guidance" placeholder="이야기 내용"
          onChange={(event) => onChange('body', event.target.value)} />
        <div className="field-help">
          <span id="story-guidance">도움·감사·회복·연대 이야기</span>
          <span>{draft.body.length.toLocaleString('ko-KR')} / 1,000</span>
        </div>
      </fieldset>
      <div className="review-status" role="status" aria-live="polite" aria-atomic="true">
        {review && result && <div className="review-message" data-decision={review.decision} key={review.decision}>
          <Icon name={review.decision === 'APPROVED' ? 'check' : 'info'} />
          <div>
            <strong>{result[0]}</strong>
            {detail && <p>{detail}</p>}
          </div>
        </div>}
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit"
          disabled={pending || !draft.title.trim() || !draft.body.trim() || !draft.regionId}>
          <Icon name="edit" />{pending ? '심사 중…' : retry ? '다시 심사 요청' : '게시 심사 요청'}
        </button>
        {review?.decision === 'APPROVED' && (
          <button className="button button-outline" type="button" onClick={() => onRegion(review.regionId)}>
            지역 소식 보기<Icon name="next" />
          </button>
        )}
      </div>
    </form>
  )
}
