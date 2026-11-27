import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useDemo } from '../core/demo'
import { DEMO_AUTHOR, DEMO_MESSAGE_LIMIT } from '../core/fixtures'
import type { ModerationResult, Post } from '../core/types'
import { getWarmth, regions, STORY_WARMTH_POINTS } from '../regions'
import { Composer } from './Composer'
import type { Draft, Review } from './Composer'
import { Icon } from './Icon'
import Music from './Music'
import { Heart, newestFirst, popularStories, StoryCards, StoryDate, storyRegion } from './Story'
import './styles.css'
import './home.css'
import './navigation.css'

const tabs = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'alerts', label: '알림', icon: 'bell' },
  { id: 'profile', label: '프로필', icon: 'profile' },
  { id: 'music', label: '노래 추천', icon: 'music' },
  { id: 'messages', label: '대화', icon: 'chat' },
] as const

type Tab = typeof tabs[number]['id']
type Screen = { kind: 'tab' | 'compose' | 'thread' | 'region' } | { kind: 'alert'; id: string }

const blankDraft = { title: '', body: '', regionId: '' }
const motionPreferenceKey = 'ttagong.settings.reduce-motion'
const regionPreferenceKey = 'ttagong.settings.region'
const warmthNumber = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 })
const mapRegions = [...regions].sort((a, b) => a.row - b.row || a.col - b.col)
const mapKey = [
  { band: 'zero', label: '0' },
  { band: 'low', label: '0.01–0.03' },
  { band: 'medium', label: '0.04–0.09' },
  { band: 'high', label: '0.10 이상' },
] as const

function loadMotionPreference() {
  try {
    return window.localStorage.getItem(motionPreferenceKey) === 'true'
  } catch {
    return false
  }
}

function loadRegionPreference() {
  try {
    const savedId = window.localStorage.getItem(regionPreferenceKey)
    return regions.find((region) => region.id === savedId)?.id ?? ''
  } catch {
    return ''
  }
}

function scoreBand(score: number | null) {
  const hundredths = Math.round((score ?? 0) * 100)
  if (hundredths === 0) return 'zero'
  if (hundredths < 4) return 'low'
  if (hundredths < 10) return 'medium'
  return 'high'
}

function RegionMap({ posts, onRegion, updatedRegionId, followedRegionId }: {
  posts: readonly Post[]
  onRegion: (id: string) => void
  updatedRegionId: string | undefined
  followedRegionId: string
}) {
  const mapSurface = useRef<HTMLDivElement>(null)
  const [Boundaries, setBoundaries] = useState<typeof import('./BoundaryMap').default>()
  const [boundaryLoadFailed, setBoundaryLoadFailed] = useState(false)
  const now = new Date()
  const entries = mapRegions.map((region) => {
    const { score, points } = getWarmth(posts, region, now)
    const value = score === null ? '–' : warmthNumber.format(score)
    const followed = region.id === followedRegionId
    const normalized = score === null ? '인구 보정 값 없음' : `인구 10만 명당 ${value}포인트`
    return {
      ...region, value, followed, band: scoreBand(score), updated: region.id === updatedRegionId,
      label: `${region.name}, 지역 온기 ${warmthNumber.format(points)}포인트, ${normalized}${followed ? ', 관심 지역으로 저장됨' : ''}, 지역 소식 보기`,
    }
  })

  useEffect(() => {
    if (Boundaries || boundaryLoadFailed) return

    let active = true
    const load = () => {
      import('./BoundaryMap').then(({ default: map }) => {
        if (active) setBoundaries(() => map)
      }).catch(() => {
        if (active) setBoundaryLoadFailed(true)
      })
    }
    const surface = mapSurface.current
    if (!surface || typeof IntersectionObserver === 'undefined') {
      load()
      return () => { active = false }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        observer.disconnect()
        load()
      }
    }, { rootMargin: '120px' })
    observer.observe(surface)
    return () => { active = false; observer.disconnect() }
  }, [Boundaries, boundaryLoadFailed])

  return (
    <section className="map-section" aria-labelledby="warmth-title">
      <div className="section-heading">
        <h2 id="warmth-title">지역별 온기지도</h2>
        <p className="map-unit">최근 7일 · 인구 10만 명당 포인트</p>
      </div>
      <div className="map-surface">
        <div ref={mapSurface} className="map-visual">
          {Boundaries
            ? <Boundaries entries={entries} onRegion={onRegion} />
            : <div className="boundary-placeholder">
                <p role="status">{boundaryLoadFailed ? '행정구역 지도를 불러오지 못했어요.' : '행정구역 지도 불러오는 중'}</p>
                {boundaryLoadFailed && <button type="button" className="button button-outline" onClick={() => onRegion('')}>지역별 소식 보기</button>}
              </div>}
        </div>
        <div className="map-info">
          <ul className="map-key" aria-label="인구 10만 명당 온기 포인트 범례">
            {mapKey.map(({ band, label }) => <li key={band} data-band={band}><i aria-hidden="true" />{label}</li>)}
          </ul>
          <p className="map-point-rule">소식 한 편마다 해당 지역에 {STORY_WARMTH_POINTS}P</p>
          <details className="map-guide">
            <summary><Icon name="info" />온기 포인트 계산법<Icon name="down" /></summary>
            <p>오늘을 포함한 한국 시간 기준 최근 7일의 점수를 인구 10만 명당 포인트로 환산합니다. 색이 진할수록 환산 점수가 높습니다.</p>
            <p>인구 기준 · 행정안전부 주민등록 인구통계, 2026년 10월</p>
            <p>행정 경계 · <a href="https://github.com/worlyung/krmap">krmap</a> · 통계청 SGIS</p>
          </details>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const demo = useDemo()
  const [tab, setTab] = useState<Tab>('home')
  const [screen, setScreen] = useState<Screen>({ kind: 'tab' })
  const [followedRegionId, setFollowedRegionId] = useState(loadRegionPreference)
  const [regionId, setRegionId] = useState(followedRegionId)
  const [regionPreferenceStatus, setRegionPreferenceStatus] = useState('')
  const [storyId, setStoryId] = useState<string | null>(null)
  const [sort, setSort] = useState<'recent' | 'popular'>('recent')
  const [motionReduced, setMotionReduced] = useState(loadMotionPreference)
  const [musicReset, setMusicReset] = useState(0)
  const [draft, setDraft] = useState<Draft>(blankDraft)
  const [review, setReview] = useState<Review | null>(null)
  const [message, setMessage] = useState('')
  const [resetStatus, setResetStatus] = useState('')
  const publishing = useRef(false)
  const composingFromRegion = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const resetDialog = useRef<HTMLDialogElement>(null)
  const storyDialog = useRef<HTMLDialogElement>(null)
  const storyClose = useRef<HTMLButtonElement>(null)
  const storyOpener = useRef<HTMLButtonElement>(null)
  const activeTab = useRef<HTMLButtonElement>(null)
  const tabScroll = useRef<Partial<Record<Tab, number>>>({})
  const nextScroll = useRef(0)
  const previousPage = useRef('')
  const page = tab + screen.kind + (screen.kind === 'alert' ? screen.id : '')

  useLayoutEffect(() => {
    if (previousPage.current && previousPage.current !== page) {
      window.scrollTo(0, nextScroll.current)
      const target = window.scrollY > 0 ? activeTab.current : heading.current
      target?.focus({ preventScroll: true })
    }
    nextScroll.current = 0
    previousPage.current = page
  }, [page])

  useEffect(() => {
    const dialog = storyDialog.current
    if (storyId && dialog && !dialog.open) {
      dialog.showModal()
      storyClose.current?.focus({ preventScroll: true })
    }
  }, [storyId])

  const region = regions.find((item) => item.id === regionId)
  const followedRegion = regions.find((item) => item.id === followedRegionId)
  const regionWarmth = region && getWarmth(demo.posts, region)
  const latest = [...demo.posts].sort(newestFirst)
  const homePosts = (sort === 'recent' ? latest : popularStories(demo.posts)).slice(0, 3)
  const selectedPost = storyId ? demo.posts.find((post) => post.id === storyId) : undefined
  const selectedAlert = screen.kind === 'alert' ? demo.alerts.find((alert) => alert.id === screen.id) : undefined
  const unread = demo.alerts.filter((alert) => !alert.read).length
  const visibleMessages = demo.messages.slice(-DEMO_MESSAGE_LIMIT)
  const chatFull = demo.messages.length >= DEMO_MESSAGE_LIMIT

  function rememberTabScroll() {
    if (screen.kind === 'tab') tabScroll.current[tab] = window.scrollY
  }

  function navigate(nextTab: Tab) {
    if (tab === nextTab && screen.kind === 'tab') {
      window.scrollTo(0, 0)
      heading.current?.focus({ preventScroll: true })
      return
    }

    rememberTabScroll()
    nextScroll.current = tabScroll.current[nextTab] ?? 0
    setTab(nextTab)
    setScreen({ kind: 'tab' })
  }

  function openRegion(id: string) {
    setRegionId(id)
    if (screen.kind === 'region') {
      window.scrollTo(0, 0)
      heading.current?.focus({ preventScroll: true })
      return
    }

    rememberTabScroll()
    setScreen({ kind: 'region' })
  }

  function toggleRegionPreference() {
    if (!region) return
    const next = followedRegionId === region.id ? '' : region.id
    setFollowedRegionId(next)

    try {
      if (next) window.localStorage.setItem(regionPreferenceKey, next)
      else window.localStorage.removeItem(regionPreferenceKey)
      setRegionPreferenceStatus('')
    } catch {
      setRegionPreferenceStatus('브라우저에 저장할 수 없어 이번 방문에만 적용됩니다.')
    }
  }

  function openComposer() {
    if (demo.readOnly) return
    composingFromRegion.current = screen.kind === 'region'
    if (composingFromRegion.current && region && !draft.regionId) {
      setDraft((current) => ({ ...current, regionId: region.id }))
    }
    rememberTabScroll()
    setScreen({ kind: 'compose' })
  }

  function closeComposer() {
    if (composingFromRegion.current) setScreen({ kind: 'region' })
    else navigate(tab)
  }

  function changeDraft(field: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    if (review?.decision === 'APPROVED') setReview(null)
  }

  async function submitStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const snapshot = { title: draft.title.trim(), body: draft.body.trim(), regionId: draft.regionId }
    if (demo.readOnly || publishing.current || !snapshot.title || !snapshot.body || !snapshot.regionId) return

    publishing.current = true
    setReview({ decision: 'PENDING' })
    let result: ModerationResult
    try {
      result = await demo.publish(snapshot)
    } catch {
      result = { decision: 'UNAVAILABLE' }
    } finally {
      publishing.current = false
    }
    setReview({ ...result, regionId: snapshot.regionId })
    if (result.decision === 'APPROVED') setDraft(blankDraft)
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (demo.readOnly || chatFull || !message.trim()) return
    demo.sendMessage(message.trim())
    setMessage('')
  }

  function resetDemo() {
    if (demo.readOnly || publishing.current) return
    demo.reset()
    setMusicReset((value) => value + 1)
    setDraft(blankDraft)
    setReview(null)
    setMessage('')
    setResetStatus('시연 데이터를 초기화했습니다.')
    resetDialog.current?.close()
  }

  function toggleMotion() {
    const next = !motionReduced
    setMotionReduced(next)
    try {
      window.localStorage.setItem(motionPreferenceKey, String(next))
    } catch {
      // The live preference still applies when storage is unavailable.
    }
  }

  function returnToStoryList() {
    setStoryId(null)
    const opener = storyOpener.current
    const target = opener?.isConnected ? opener : heading.current
    target?.focus({ preventScroll: true })
    storyOpener.current = null
  }

  function openStoryRegion(id: string) {
    storyOpener.current = null
    storyDialog.current?.close()
    openRegion(id)
  }

  const storyActions = {
    onOpen: (post: Post, opener: HTMLButtonElement) => {
      storyOpener.current = opener
      setStoryId(post.id)
    },
    onHeart: demo.readOnly ? undefined : demo.toggleHeart,
  }

  const back = (label: string, onClick = () => navigate(tab)) => (
    <button type="button" className="back-link" onClick={onClick}>
      <Icon name="back" />{label}
    </button>
  )

  return (
    <div className="app-shell" data-motion={motionReduced ? 'reduced' : undefined}>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <header className="site-header">
        <div className="header-content">
          <button type="button" className="wordmark" onClick={() => navigate('home')} aria-label="따공 홈">
            <span className="brand-mark"><Icon name="brand" /></span>
            <span>따공</span>
          </button>
          {demo.readOnly
            ? <span className="mode"><Icon name="lock" />읽기 전용 시연</span>
            : (tab !== 'music' || screen.kind !== 'tab') && <button type="button" className="button button-primary header-write" onClick={openComposer}>
              <Icon name="edit" /> 글쓰기
            </button>}
        </div>
      </header>

      <main id="main-content" className="main-content" tabIndex={-1}>
        {screen.kind === 'tab' && tab === 'home' && (
          <>
            <div className="home-overview">
              <section className="hero" aria-labelledby="hero-title">
                <h1 id="hero-title" ref={heading} tabIndex={-1}>작은 친절을 나눠요</h1>
                {followedRegion && <button type="button" className="home-region-link"
                  onClick={() => openRegion(followedRegion.id)}>
                  <Icon name="pin" />{followedRegion.shortName} 소식
                </button>}
                <figure className="hero-picture">
                  <img src="/neighborhood-books.jpg" width="1120" height="746" fetchPriority="high"
                    alt="비 온 뒤 동네 책방 앞에서 함께 책을 정리하는 이웃" />
                  <figcaption>시연용 생성 이미지</figcaption>
                </figure>
              </section>

              <section className="home-stories" aria-labelledby="stories-title">
                <div className="section-heading section-with-control">
                  <h2 id="stories-title">이웃 소식</h2>
                  <div className="segmented-control" role="group" aria-label="이야기 정렬">
                    <button type="button" aria-pressed={sort === 'recent'} onClick={() => setSort('recent')}>최신</button>
                    <button type="button" aria-pressed={sort === 'popular'} onClick={() => setSort('popular')}>인기</button>
                  </div>
                </div>
                {sort === 'popular' && <p className="sort-criteria">최근 7일 공감순</p>}
                <StoryCards key={sort} posts={homePosts} {...storyActions} home
                  empty={sort === 'popular' ? '최근 7일 동안 게시된 이야기가 없습니다.' : '아직 게시된 이야기가 없습니다.'} />
              </section>
            </div>
            <RegionMap posts={demo.posts} onRegion={openRegion} followedRegionId={followedRegionId}
              updatedRegionId={review?.decision === 'APPROVED' ? review.regionId : undefined} />
          </>
        )}

        {screen.kind === 'region' && (
          <>
            {back(tab === 'home' ? '홈' : '이전 화면')}
            <div className="page-heading">
              <h1 ref={heading} tabIndex={-1}>지역별 소식</h1>
            </div>
            <div className="filter-bar">
              <label htmlFor="filter-region">지역</label>
              <select id="filter-region" value={regionId} onChange={(event) => setRegionId(event.target.value)}>
                <option value="">전체 지역</option>
                {regions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              {region && <button type="button" className="button button-outline region-preference-button"
                aria-pressed={region.id === followedRegionId} onClick={toggleRegionPreference}>
                {region.id === followedRegionId ? '관심 지역 해제' : '관심 지역 저장'}
              </button>}
            </div>
            <p className="region-preference-status" role="status">{regionPreferenceStatus}</p>
            {regionWarmth && <p className="region-stats">
              <span>최근 7일 온기 <strong>{warmthNumber.format(regionWarmth.points)}P</strong></span>
              {regionWarmth.score !== null && <span>인구 10만 명당 {warmthNumber.format(regionWarmth.score)}P</span>}
            </p>}
            <section className="region-feed" aria-labelledby="region-feed-title">
              <div className="section-heading">
                <h2 id="region-feed-title">{region ? `${region.shortName} 이야기` : '전국 이야기'}</h2>
              </div>
              <StoryCards posts={region ? latest.filter((post) => post.regionId === region.id) : latest}
                {...storyActions} empty="이 지역에 아직 게시된 이야기가 없습니다." />
            </section>
          </>
        )}

        <Music key={musicReset} heading={heading} active={screen.kind === 'tab' && tab === 'music'}
          readOnly={demo.readOnly} recommendations={demo.recommendations}
          onRecommend={(track, reason) => demo.publishRecommendation(track.id, `${track.title} · ${track.artist}`, reason)} />

        {screen.kind === 'compose' && !demo.readOnly && (
          <>
            {back(composingFromRegion.current ? '지역별 소식' : '이전 화면', closeComposer)}
            <div className="page-heading">
              <h1 ref={heading} tabIndex={-1}>이야기 쓰기</h1>
            </div>
            <Composer draft={draft} review={review} onChange={changeDraft} onSubmit={submitStory} onRegion={openRegion} />
          </>
        )}

        {screen.kind === 'tab' && tab === 'alerts' && (
          <>
            <div className="page-heading"><h1 ref={heading} tabIndex={-1}>알림</h1></div>
            {demo.alerts.length ? (
              <ul className="item-list">
                {demo.alerts.map((alert) => (
                  <li key={alert.id}>
                    <button className="item-row" type="button" onClick={() => {
                      if (!demo.readOnly) demo.readAlert(alert.id)
                      setScreen({ kind: 'alert', id: alert.id })
                    }}>
                      <span className="item-icon"><Icon name="bell" /></span>
                      <strong>{alert.text}</strong>
                      {!alert.read && <span className="item-status">새 알림</span>}
                      <Icon name="next" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="empty-state">표시할 알림이 없습니다.</p>}
          </>
        )}

        {screen.kind === 'alert' && (
          <>
            {back('알림 목록')}
            <article className="surface narrow-surface">
              <h1 ref={heading} tabIndex={-1}>알림 내용</h1>
              <p>{selectedAlert?.text ?? '이 알림을 찾을 수 없습니다.'}</p>
            </article>
          </>
        )}

        {screen.kind === 'tab' && tab === 'profile' && (
          <>
            <div className="page-heading"><h1 ref={heading} tabIndex={-1}>프로필</h1></div>
            <section className="surface narrow-surface profile-card" aria-labelledby="profile-title">
              <span className="item-icon"><Icon name="profile" /></span>
              <div><h2 id="profile-title">따공 이웃</h2><p>시연 프로필</p></div>
            </section>
            <button type="button" role="switch" aria-checked={motionReduced} className="item-row motion-setting"
              onClick={toggleMotion}>
              <strong>움직임 줄이기</strong>
              <span className="motion-switch" aria-hidden="true" />
            </button>
            <section className="profile-stories" aria-labelledby="profile-stories-title">
              <div className="section-heading"><h2 id="profile-stories-title">내가 쓴 이야기</h2></div>
              <StoryCards posts={latest.filter((post) => post.authorId === DEMO_AUTHOR.authorId)}
                {...storyActions} empty="아직 작성한 이야기가 없습니다." />
            </section>
            {!demo.readOnly && (
              <section className="surface narrow-surface reset-panel" aria-labelledby="reset-title">
                <h2 id="reset-title">시연 데이터</h2>
                <p>이 브라우저에 저장된 글, 공감, 읽음 표시, 대화 내용을 처음 상태로 되돌립니다.</p>
                <button type="button" className="button button-outline" disabled={review?.decision === 'PENDING'}
                  onClick={() => { setResetStatus(''); resetDialog.current?.showModal() }}>시연 데이터 초기화</button>
                <p className="reset-status" role="status">{resetStatus}</p>
                <dialog ref={resetDialog} aria-labelledby="reset-dialog-title">
                  <h2 id="reset-dialog-title">시연 데이터를 초기화할까요?</h2>
                  <p>저장된 활동과 작성 중인 이야기가 지워집니다.</p>
                  <div className="form-actions">
                    <form method="dialog"><button className="button button-outline" type="submit" autoFocus>계속 사용</button></form>
                    <button type="button" className="button button-primary" onClick={resetDemo}>초기화</button>
                  </div>
                </dialog>
              </section>
            )}
          </>
        )}

        {screen.kind === 'tab' && tab === 'messages' && (
          <>
            <div className="page-heading"><h1 ref={heading} tabIndex={-1}>대화</h1></div>
            <button type="button" className="item-row thread-link" onClick={() => setScreen({ kind: 'thread' })}>
              <span className="item-icon"><Icon name="chat" /></span>
              <span><strong>이웃과의 예시 대화</strong>{demo.messages.at(-1) && <small>{demo.messages.at(-1)?.text}</small>}</span>
              <Icon name="next" />
            </button>
          </>
        )}

        {screen.kind === 'thread' && (
          <>
            {back('대화 목록')}
            <section className="surface narrow-surface" aria-labelledby="thread-title">
              <h1 id="thread-title" ref={heading} tabIndex={-1}>이웃과의 예시 대화</h1>
              {visibleMessages.length ? <ol className="message-list" aria-label="예시 메시지">
                {visibleMessages.map((entry) => <li key={entry.id} className={entry.mine ? 'mine' : ''}>
                  <span>{entry.mine ? '나' : '이웃'}</span><p>{entry.text}</p>
                </li>)}
              </ol> : <p className="empty-state">아직 대화가 없습니다.</p>}
              {!demo.readOnly && (chatFull
                ? <p className="thread-limit" role="status">시연 메시지 {DEMO_MESSAGE_LIMIT}개를 모두 표시했어요.</p>
                : (
                <form className="message-form" onSubmit={submitMessage}>
                  <label className="visually-hidden" htmlFor="message-text">예시 메시지</label>
                  <input id="message-text" value={message} onChange={(event) => setMessage(event.target.value)}
                    required placeholder="예시 메시지 입력" />
                  <button className="button button-primary" type="submit" disabled={!message.trim()}>보내기</button>
                </form>
                ))}
            </section>
          </>
        )}

        <dialog ref={storyDialog} className="story-dialog" aria-labelledby="story-dialog-title" onClose={returnToStoryList}>
          {storyId && <article className="story-detail">
            <div className="story-dialog-header">
              {selectedPost && <div className="story-meta">
                <span className="region-label"><Icon name="pin" />{storyRegion(selectedPost)}</span>
                <StoryDate post={selectedPost} />
              </div>}
              <button type="button" ref={storyClose} className="story-close" onClick={() => storyDialog.current?.close()}>
                <span aria-hidden="true">×</span> 닫기
              </button>
            </div>
            <h2 id="story-dialog-title">{selectedPost?.title ?? '이야기를 찾을 수 없습니다.'}</h2>
            {selectedPost && <>
              <p className="story-detail-author">{selectedPost.authorName}</p>
              <p className="story-body">{selectedPost.body}</p>
              {selectedPost.featuredComment && <aside className="story-featured-comment" aria-label="대표 댓글">
                <Icon name="chat" /><div><strong>{selectedPost.featuredComment.authorName}</strong><p>{selectedPost.featuredComment.body}</p></div>
              </aside>}
              <div className="story-actions">
                <Heart post={selectedPost} onHeart={demo.readOnly ? undefined : () => demo.toggleHeart(selectedPost.id)} />
                <button type="button" className="button button-outline" onClick={() => openStoryRegion(selectedPost.regionId)}>
                  {storyRegion(selectedPost)} 소식 더 보기 <Icon name="next" />
                </button>
              </div>
            </>}
          </article>}
        </dialog>
      </main>

      <nav className="bottom-nav" aria-label="주 메뉴">
        <div className="bottom-nav-content">
          {tabs.map((item) => (
            <button key={item.id} type="button" aria-current={tab === item.id ? 'page' : undefined}
              ref={tab === item.id ? activeTab : undefined}
              aria-label={item.id === 'alerts' && unread ? `알림, 새 알림 ${unread}개` : undefined}
              onClick={() => navigate(item.id)}>
              <span className="nav-icon"><Icon name={item.icon} />{item.id === 'alerts' && unread > 0 && <i />}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
