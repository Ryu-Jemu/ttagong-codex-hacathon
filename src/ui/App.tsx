import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useDemo } from '../core/demo'
import { DEMO_AUTHOR } from '../core/fixtures'
import type { ModerationResult, Post } from '../core/types'
import { getWarmth, regions } from '../regions'
import { Composer } from './Composer'
import type { Draft, Review } from './Composer'
import { Icon } from './Icon'
import { Heart, newestFirst, popularStories, StoryCards, StoryDate, storyRegion } from './Story'
import './styles.css'
import './home.css'

const tabs = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'alerts', label: '알림', icon: 'bell' },
  { id: 'profile', label: '프로필', icon: 'profile' },
  { id: 'regions', label: '지역별 소식', icon: 'map' },
  { id: 'messages', label: '대화', icon: 'chat' },
] as const

type Tab = typeof tabs[number]['id']
type Screen = { kind: 'tab' | 'compose' | 'thread' } | { kind: 'alert'; id: string }

const blankDraft = { title: '', body: '', regionId: '' }
const warmthNumber = new Intl.NumberFormat('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const mapRegions = [...regions].sort((a, b) => a.row - b.row || a.col - b.col)

function scoreBand(score: number | null) {
  if (score === null) return 'missing'
  const displayed = Number(score.toFixed(2))
  if (displayed < 0.05) return 'low'
  if (displayed < 0.1) return 'medium'
  return 'high'
}

function RegionMap({ posts, onRegion, updatedRegionId }: {
  posts: readonly Post[]
  onRegion: (id: string) => void
  updatedRegionId: string | undefined
}) {
  const now = new Date()

  return (
    <section className="map-section" aria-labelledby="warmth-title">
      <div className="section-heading">
        <h2 id="warmth-title">지역별 온기지도</h2>
        <p className="map-unit">최근 7일 · 인구 10만 명당</p>
      </div>
      <div className="map-surface">
        <div className="map-grid" role="group" aria-label="16개 광역 지역 지도">
          {mapRegions.map((region) => {
            const { score, authors } = getWarmth(posts, region, now)
            const value = score === null ? '표본 부족' : warmthNumber.format(score)
            const spokenScore = score === null ? `${value}, 작성자 ${authors}명` : `인구 10만 명당 ${value}건`
            return (
              <button type="button" className="map-tile" key={region.id}
                data-band={scoreBand(score)} data-updated={region.id === updatedRegionId}
                style={{ gridColumn: region.col, gridRow: region.row }}
                aria-label={`${region.name}, ${spokenScore}, 지역 소식 보기`}
                onClick={() => onRegion(region.id)}>
                <strong>{region.shortName}</strong><span>{value}</span>
              </button>
            )
          })}
        </div>
        <details className="map-guide">
          <summary><Icon name="info" />온기 수치 읽는 법<Icon name="down" /></summary>
          <p>시연에 게시된 최근 7일(오늘 포함, 한국 시간)의 이야기를 인구 10만 명당 건수로 표시합니다.</p>
          <p>같은 지역·작성자의 글은 하루 한 건으로 셉니다. 작성자가 3명 미만이면 표본 부족입니다.</p>
          <ul className="map-key" aria-label="온기 수치 범례">
            <li><i aria-hidden="true" data-band="low" />0.05 미만</li>
            <li><i aria-hidden="true" data-band="medium" />0.05 이상 0.10 미만</li>
            <li><i aria-hidden="true" data-band="high" />0.10 이상</li>
            <li><i aria-hidden="true" />표본 부족</li>
          </ul>
          <p>인구 기준 · 행정안전부 주민등록 인구통계, 2026년 10월</p>
        </details>
      </div>
    </section>
  )
}

export default function App() {
  const demo = useDemo()
  const [tab, setTab] = useState<Tab>('home')
  const [screen, setScreen] = useState<Screen>({ kind: 'tab' })
  const [regionId, setRegionId] = useState('')
  const [storyId, setStoryId] = useState<string | null>(null)
  const [sort, setSort] = useState<'recent' | 'popular'>('recent')
  const [draft, setDraft] = useState<Draft>(blankDraft)
  const [review, setReview] = useState<Review | null>(null)
  const [message, setMessage] = useState('')
  const [resetStatus, setResetStatus] = useState('')
  const publishing = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const resetDialog = useRef<HTMLDialogElement>(null)
  const storyDialog = useRef<HTMLDialogElement>(null)
  const storyClose = useRef<HTMLButtonElement>(null)
  const storyOpener = useRef<HTMLButtonElement>(null)
  const previousPage = useRef('')
  const page = tab + screen.kind + (screen.kind === 'alert' ? screen.id : '')

  useEffect(() => {
    if (previousPage.current && previousPage.current !== page) {
      window.scrollTo(0, 0)
      heading.current?.focus({ preventScroll: true })
    }
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
  const regionWarmth = region && getWarmth(demo.posts, region)
  const latest = [...demo.posts].sort(newestFirst)
  const homePosts = (sort === 'recent' ? latest : popularStories(demo.posts)).slice(0, 3)
  const selectedPost = storyId ? demo.posts.find((post) => post.id === storyId) : undefined
  const selectedAlert = screen.kind === 'alert' ? demo.alerts.find((alert) => alert.id === screen.id) : undefined
  const unread = demo.alerts.filter((alert) => !alert.read).length

  function navigate(nextTab: Tab) {
    setTab(nextTab)
    setScreen({ kind: 'tab' })
  }

  function openRegion(id: string) {
    setRegionId(id)
    navigate('regions')
  }

  function openComposer() {
    if (demo.readOnly) return
    if (tab === 'regions' && region && !draft.regionId) {
      setDraft((current) => ({ ...current, regionId: region.id }))
    }
    setScreen({ kind: 'compose' })
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
    if (demo.readOnly || !message.trim()) return
    demo.sendMessage(message.trim())
    setMessage('')
  }

  function resetDemo() {
    if (demo.readOnly || publishing.current) return
    demo.reset()
    setDraft(blankDraft)
    setReview(null)
    setMessage('')
    setResetStatus('시연 데이터를 초기화했습니다.')
    resetDialog.current?.close()
  }

  function returnToStoryList() {
    setStoryId(null)
    const opener = storyOpener.current
    const target = opener?.isConnected ? opener : heading.current
    target?.focus({ preventScroll: true })
    storyOpener.current = null
  }

  const storyActions = {
    onOpen: (post: Post, opener: HTMLButtonElement) => {
      storyOpener.current = opener
      setStoryId(post.id)
    },
    onHeart: demo.readOnly ? undefined : demo.toggleHeart,
  }

  const back = (label: string) => (
    <button type="button" className="back-link" onClick={() => setScreen({ kind: 'tab' })}>
      <Icon name="back" />{label}
    </button>
  )

  return (
    <>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <header className="site-header">
        <div className="header-content">
          <button type="button" className="wordmark" onClick={() => navigate('home')} aria-label="따공 홈">
            <span className="brand-mark"><Icon name="brand" /></span>
            <span>따공</span>
          </button>
          {demo.readOnly
            ? <span className="mode"><Icon name="lock" />읽기 전용 시연</span>
            : <button type="button" className="button button-primary header-write" onClick={openComposer}>
              <Icon name="edit" /> 글쓰기
            </button>}
        </div>
      </header>

      <main id="main-content" className="main-content" tabIndex={-1}>
        {screen.kind === 'tab' && tab === 'home' && (
          <>
            <div className="home-overview">
              <section className="hero" aria-labelledby="hero-title">
                <h1 id="hero-title" ref={heading} tabIndex={-1}>따뜻한 소식 공유</h1>
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
                <StoryCards posts={homePosts} {...storyActions} home
                  empty={sort === 'popular' ? '최근 7일 동안 게시된 이야기가 없습니다.' : '아직 게시된 이야기가 없습니다.'} />
              </section>
            </div>
            <RegionMap posts={demo.posts} onRegion={openRegion}
              updatedRegionId={review?.decision === 'APPROVED' ? review.regionId : undefined} />
          </>
        )}

        {screen.kind === 'tab' && tab === 'regions' && (
          <>
            <div className="page-heading">
              <h1 ref={heading} tabIndex={-1}>지역별 소식</h1>
            </div>
            <div className="filter-bar">
              <label htmlFor="filter-region">지역</label>
              <select id="filter-region" value={regionId} onChange={(event) => setRegionId(event.target.value)}>
                <option value="">전체 지역</option>
                {regions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            {regionWarmth && <p className="region-stats">
              최근 7일 집계 {regionWarmth.count}건 · 작성자 {regionWarmth.authors}명 · {regionWarmth.score === null
                ? '표본 부족'
                : `인구 10만 명당 ${warmthNumber.format(regionWarmth.score)}건`}
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

        {screen.kind === 'compose' && !demo.readOnly && (
          <>
            {back(tab === 'regions' ? '지역별 소식' : '이전 화면')}
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
              {demo.messages.length ? <ol className="message-list" aria-live="polite">
                {demo.messages.map((entry) => <li key={entry.id} className={entry.mine ? 'mine' : ''}>
                  <span>{entry.mine ? '나' : '이웃'}</span><p>{entry.text}</p>
                </li>)}
              </ol> : <p className="empty-state">아직 대화가 없습니다.</p>}
              {!demo.readOnly && (
                <form className="message-form" onSubmit={submitMessage}>
                  <label className="visually-hidden" htmlFor="message-text">예시 메시지</label>
                  <input id="message-text" value={message} onChange={(event) => setMessage(event.target.value)}
                    required placeholder="예시 메시지 입력" />
                  <button className="button button-primary" type="submit" disabled={!message.trim()}>보내기</button>
                </form>
              )}
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
              <Heart post={selectedPost} onHeart={demo.readOnly ? undefined : () => demo.toggleHeart(selectedPost.id)} />
            </>}
          </article>}
        </dialog>
      </main>

      <nav className="bottom-nav" aria-label="주 메뉴">
        <div className="bottom-nav-content">
          {tabs.map((item) => (
            <button key={item.id} type="button" aria-current={tab === item.id ? 'page' : undefined}
              aria-label={item.id === 'alerts' && unread ? `알림, 새 알림 ${unread}개` : undefined}
              onClick={() => navigate(item.id)}>
              <span className="nav-icon"><Icon name={item.icon} />{item.id === 'alerts' && unread > 0 && <i />}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
