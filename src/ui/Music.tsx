import { useEffect, useRef, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { MUSIC_REASON_LIMIT } from '../core/moderation'
import type { ModerationResult, MusicRecommendation } from '../core/types'
import { Icon } from './Icon'
import { loadArtwork, RecordArtworkEditor, RecordDisc, saveArtwork } from './RecordArtwork'
import type { Artwork } from './RecordArtwork'
import './music.css'

export type { MusicRecommendation } from '../core/types'

const moods = ['전체', '응원', '위로', '산책'] as const
type Mood = typeof moods[number]

export type MusicTrack = {
  id: string
  title: string
  artist: string
  mood: Exclude<Mood, '전체'>
  href: string
}

type CatalogTrack = MusicTrack & { note: string; artwork: Artwork }

export const tracks: readonly CatalogTrack[] = [
  {
    id: 'dont-worry', title: '걱정말아요 그대', artist: '이적', mood: '위로',
    artwork: { palette: 'scarlet', mark: 'moon' },
    href: 'https://www.youtube.com/watch?v=ZskkMKYeVW8',
    note: '마음이 무거운 날, 잠깐 쉬어 가고 싶을 때 함께 듣고 싶은 곡이에요.',
  },
  {
    id: 'good-luck', title: '행운을 빌어요', artist: '페퍼톤스', mood: '응원',
    artwork: { palette: 'gold', mark: 'sun' },
    href: 'https://www.youtube.com/watch?v=U6dTSMCqlp4',
    note: '새로운 일을 앞둔 친구에게 응원을 전하고 싶을 때 떠오르는 곡이에요.',
  },
  {
    id: 'time-of-our-life', title: '한 페이지가 될 수 있게', artist: 'DAY6', mood: '응원',
    artwork: { palette: 'violet', mark: 'star' },
    href: 'https://www.youtube.com/watch?v=vnS_jn2uibs',
    note: '함께 준비한 일을 끝내고 서로 수고했다고 말하고 싶은 날에 잘 어울려요.',
  },
  {
    id: 'walk', title: '산책', artist: '백예린', mood: '산책',
    artwork: { palette: 'jade', mark: 'leaf' },
    href: 'https://www.youtube.com/watch?v=T2UUTwvVoaM',
    note: '어둑해진 동네를 천천히 걸으며 하루를 정리할 때 듣기 좋아요.',
  },
  {
    id: 'you-did-well', title: '수고했어, 오늘도', artist: '옥상달빛', mood: '위로',
    artwork: { palette: 'dusk', mark: 'heart' },
    href: 'https://www.youtube.com/watch?v=U3e4AOd-DzE',
    note: '조용히 하루를 마무리하며 오늘의 나에게 고맙다고 말해 주고 싶을 때 추천해요.',
  },
]

type Review = { decision: 'PENDING' } | ModerationResult

const reviewMessages = {
  PENDING: '추천 글을 심사하고 있습니다.',
  APPROVED: '추천 글을 게시했습니다.',
  BLOCKED: '추천 글이 차단되었습니다. 이유를 수정한 뒤 다시 요청해 주세요.',
  HOLD: '심사가 보류되었습니다. 추천하는 이유를 더 적고 다시 요청해 주세요.',
  UNAVAILABLE: '지금 심사를 완료할 수 없어요. 작성한 추천 글은 남아 있어요.',
}

const blockGuidance = {
  CRITICISM: '이 곡을 추천하는 따뜻한 이유를 중심으로 적어 주세요.',
  HARMFUL: '타인을 공격하거나 조롱하는 표현을 지워 주세요.',
  PRIVATE_INFO: '다른 사람의 개인정보를 지워 주세요.',
}

function searchable(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]/gu, '')
}

export default function Music({ heading, active, readOnly, recommendations, onRecommend }: {
  heading: RefObject<HTMLHeadingElement | null>
  active: boolean
  readOnly: boolean
  recommendations: readonly MusicRecommendation[]
  onRecommend: (track: MusicTrack, reason: string) => Promise<ModerationResult>
}) {
  const [mood, setMood] = useState<Mood>('전체')
  const [search, setSearch] = useState('')
  const [draftTrack, setDraftTrack] = useState<MusicTrack | null>(null)
  const [reason, setReason] = useState('')
  const [review, setReview] = useState<Review | null>(null)
  const [artwork, setArtwork] = useState(loadArtwork)
  const [editing, setEditing] = useState<CatalogTrack | null>(null)
  const [artworkStatus, setArtworkStatus] = useState<{ trackId: string; message: string }>()
  const searchInput = useRef<HTMLInputElement>(null)
  const reasonInput = useRef<HTMLTextAreaElement>(null)
  const composerOpener = useRef<HTMLButtonElement>(null)
  const artworkOpener = useRef<HTMLButtonElement>(null)
  const submitting = useRef(false)
  const pending = review?.decision === 'PENDING'
  const retry = review?.decision === 'BLOCKED' || review?.decision === 'HOLD' || review?.decision === 'UNAVAILABLE'
  const blockedReason = review?.decision === 'BLOCKED' ? review.reasonCode : undefined
  const guidance = blockedReason && blockedReason in blockGuidance
    ? blockGuidance[blockedReason as keyof typeof blockGuidance]
    : undefined
  const terms = search.trim().split(/\s+/).map(searchable).filter(Boolean)
  const visibleTracks = tracks.filter((track) => {
    const trackText = searchable(`${track.title} ${track.artist}`)
    return (mood === '전체' || track.mood === mood) && terms.every((term) => trackText.includes(term))
  })

  useEffect(() => {
    if (draftTrack) reasonInput.current?.focus()
  }, [draftTrack])

  function openComposer(track: MusicTrack, opener: HTMLButtonElement) {
    composerOpener.current = opener
    if (draftTrack?.id === track.id) {
      reasonInput.current?.focus()
      return
    }
    setDraftTrack(track)
    setReason('')
    setReview(null)
  }

  function closeComposer() {
    setDraftTrack(null)
    setReason('')
    setReview(null)
    const opener = composerOpener.current
    if (opener?.isConnected && !opener.disabled) opener.focus()
    else searchInput.current?.focus()
  }

  async function submitRecommendation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const draft = reason.trim()
    if (readOnly || submitting.current || !draftTrack || !draft || draft.length > MUSIC_REASON_LIMIT) return
    submitting.current = true
    setReview({ decision: 'PENDING' })

    let result: ModerationResult
    try {
      result = await onRecommend(draftTrack, draft)
    } catch {
      result = { decision: 'UNAVAILABLE' }
    } finally {
      submitting.current = false
    }

    setReview(result)
    if (result.decision === 'APPROVED') setReason('')
  }

  return (
    <section className="music-view" aria-labelledby="music-title" hidden={!active}>
      <div className="music-heading">
        <h1 id="music-title" ref={active ? heading : undefined} tabIndex={-1}>노래 추천</h1>
      </div>

      {editing && <RecordArtworkEditor title={editing.title} artwork={artwork[editing.id] ?? editing.artwork}
        defaultArtwork={editing.artwork} onSave={(next) => {
          const designs = { ...artwork, [editing.id]: next }
          setArtwork(designs)
          setArtworkStatus({ trackId: editing.id, message: saveArtwork(designs)
            ? 'LP 디자인을 이 브라우저에 저장했어요.' : '이번 방문에만 LP 디자인이 적용됩니다.' })
        }} onClose={() => {
          setEditing(null)
          artworkOpener.current?.focus()
        }} />}
      <p className="visually-hidden" role="status">{artworkStatus?.message}</p>

      <div className="music-tools">
        <div className="music-search">
          <label className="visually-hidden" htmlFor="music-search">곡명 또는 가수 검색</label>
          <Icon name="search" />
          <input type="search" id="music-search" ref={searchInput} value={search}
            placeholder="곡명 또는 가수 검색" onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="music-filters" role="group" aria-label="노래 추천 분위기">
          {moods.map((item) => <button type="button" key={item} className="music-filter"
            aria-pressed={mood === item} onClick={() => setMood(item)}>{item}</button>)}
        </div>
      </div>

      {!readOnly && draftTrack && (
        <form className="surface music-composer" id="music-composer" onSubmit={submitRecommendation}>
          <h2>추천 글 쓰기</h2>
          <p className="music-composer-track">{draftTrack.title} · {draftTrack.artist}</p>
          <p id="music-privacy" className="inline-note">
            <Icon name="info" />
            <span>곡명과 추천 이유는 심사를 위해 Codex로 전달됩니다. 승인된 글은 이 브라우저에 저장됩니다.</span>
          </p>
          <label htmlFor="music-reason">어떤 순간에 듣기 좋은가요?</label>
          <textarea id="music-reason" ref={reasonInput} value={reason} rows={4} required maxLength={MUSIC_REASON_LIMIT}
            aria-describedby="music-privacy" disabled={pending}
            onChange={(event) => {
              setReason(event.target.value)
              if (review?.decision === 'APPROVED') setReview(null)
            }} />

          <div className="review-status" role="status" aria-live="polite" aria-atomic="true">
            {review && <div className="review-message" data-decision={review.decision}>
              <Icon name={review.decision === 'APPROVED' ? 'check' : 'info'} />
              <div>
                <strong>{reviewMessages[review.decision]}</strong>
                {guidance && <p>{guidance}</p>}
              </div>
            </div>}
          </div>

          <div className="music-composer-actions">
            <button type="submit" className="button button-primary" disabled={pending || !reason.trim()}>
              {pending ? '심사 중…' : retry ? '다시 심사 요청' : '게시 심사 요청'}
            </button>
            <button type="button" className="button button-outline" disabled={pending} onClick={closeComposer}>닫기</button>
          </div>
        </form>
      )}

      <p className="visually-hidden" role="status">추천 곡 {visibleTracks.length}개</p>
      {visibleTracks.length ? (
        <ul className="music-list">
          {visibleTracks.map((track) => (
            <li key={track.id}>
              <article className="surface music-card">
                <div className="music-card-heading">
                  <RecordDisc artwork={artwork[track.id] ?? track.artwork} />
                  <div className="music-track-info">
                    <p className="music-track-mood">{track.mood}</p>
                    <h2>{track.title}</h2>
                    <p className="music-artist">{track.artist}</p>
                  </div>
                </div>
                <ul className="music-notes" aria-label={`${track.title} 추천 글`}>
                  <li>
                    <p className="music-note-author">따공 선곡</p>
                    <p>{track.note}</p>
                  </li>
                  {recommendations.filter((item) => item.trackId === track.id).map((item) => (
                    <li key={item.id}>
                      <p className="music-note-author">{item.authorName}</p>
                      <p>{item.reason}</p>
                    </li>
                  ))}
                </ul>
                <div className="music-card-actions">
                  <a className="button button-primary music-listen" href={track.href} target="_blank" rel="noopener noreferrer"
                    aria-label={`YouTube에서 듣기 · ${track.title} · 새 탭`}>
                    YouTube에서 듣기<Icon name="next" />
                  </a>
                  <button type="button" className="button button-outline" aria-haspopup="dialog"
                    aria-label={`${track.title} LP 꾸미기`} onClick={(event) => {
                      artworkOpener.current = event.currentTarget
                      setArtworkStatus(undefined)
                      setEditing(track)
                    }}>LP 꾸미기</button>
                  {!readOnly && <button type="button" className="button button-outline"
                    disabled={pending || (Boolean(reason.trim()) && draftTrack?.id !== track.id)}
                    aria-expanded={draftTrack?.id === track.id}
                    aria-controls={draftTrack?.id === track.id ? 'music-composer' : undefined}
                    onClick={(event) => openComposer(track, event.currentTarget)}>추천 글 쓰기</button>}
                </div>
                {artworkStatus?.trackId === track.id && <p className="record-storage-note" aria-hidden="true">{artworkStatus.message}</p>}
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state music-empty">
          <p>맞는 곡이 없어요.</p>
          <button type="button" className="button button-outline" onClick={() => {
            setSearch('')
            setMood('전체')
            searchInput.current?.focus()
          }}>전체 추천곡 보기</button>
        </div>
      )}
    </section>
  )
}
