import type { ReactNode, RefObject } from 'react'
import type { DemoBadge, DemoBadgeId } from '../core/badges'
import type { Post } from '../core/types'
import { Icon, type IconName } from './Icon'
import './profile.css'

type ProfileRecommendation = {
  id: string
  title: string
  artist: string
  reason: string
}

const activityNumber = new Intl.NumberFormat('ko-KR')
const badgeIcons = {
  'first-story': 'edit',
  'story-keeper': 'badge',
  'first-heart': 'heart',
  'first-song': 'music',
} satisfies Record<DemoBadgeId, IconName>

export default function Profile({
  heading, displayName, posts, recommendations, badges, followedRegionName, onRegion, onMusic,
  onOpen, resetPanel,
}: {
  heading: RefObject<HTMLHeadingElement | null>
  displayName: string
  posts: readonly Post[]
  recommendations: readonly ProfileRecommendation[]
  badges: readonly DemoBadge[]
  followedRegionName?: string
  onRegion: () => void
  onMusic: () => void
  onOpen: (post: Post, opener: HTMLButtonElement) => void
  resetPanel?: ReactNode
}) {
  const hearts = posts.reduce((total, post) => total + post.hearts, 0)

  return (
    <section className="profile-view" aria-labelledby="profile-title">
      <header className="profile-header">
        <h1 id="profile-title" ref={heading} tabIndex={-1}>프로필</h1>
        <div className="surface profile-hero">
          <div className="profile-identity">
            <span className="profile-avatar"><Icon name="profile" /></span>
            <div>
              <p className="profile-caption">시연 프로필</p>
              <h2>{displayName}</h2>
            </div>
          </div>
          <dl className="profile-stats" aria-label="시연 활동">
            <div><dt>내 이야기</dt><dd>{activityNumber.format(posts.length)}</dd></div>
            <div><dt>받은 좋아요</dt><dd>{activityNumber.format(hearts)}</dd></div>
            <div><dt>노래 추천</dt><dd>{activityNumber.format(recommendations.length)}</dd></div>
          </dl>
        </div>
      </header>

      <section className="surface profile-region" aria-labelledby="profile-region-title">
        <div className="profile-region-heading">
          <span className="profile-region-icon"><Icon name="pin" /></span>
          <div>
            <h2 id="profile-region-title">관심 지역</h2>
            {followedRegionName && <p>{followedRegionName}</p>}
          </div>
        </div>
        <button type="button" className="button button-outline" onClick={onRegion}>
          {followedRegionName ? '지역 소식 보기' : '관심 지역 고르기'}<Icon name="next" />
        </button>
      </section>

      <section className="profile-stories" aria-labelledby="profile-stories-title">
        <div className="section-heading"><h2 id="profile-stories-title">내가 쓴 이야기</h2></div>
        {posts.length ? (
          <div className="profile-story-stack">
            {posts.map((post) => (
              <article className="story-card" key={post.id}>
                <h3>
                  <button type="button" className="story-link" aria-haspopup="dialog"
                    onClick={(event) => onOpen(post, event.currentTarget)}>{post.title}</button>
                </h3>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">아직 내가 쓴 이야기가 없어요.</p>
        )}
      </section>

      <section className="surface profile-recommendations" aria-labelledby="profile-recommendations-title">
        <div className="profile-list-heading">
          <h2 id="profile-recommendations-title">내가 추천한 노래</h2>
          <button type="button" className="button button-outline" onClick={onMusic}>
            노래 추천 보기<Icon name="next" />
          </button>
        </div>
        {recommendations.length ? (
          <ul className="profile-recommendation-list">
            {recommendations.map((song) => (
              <li key={song.id}>
                <span className="profile-song-icon"><Icon name="music" /></span>
                <div>
                  <h3>{song.title}</h3>
                  <p className="profile-song-artist">{song.artist}</p>
                  <p>{song.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="profile-caption">아직 추천한 노래가 없어요.</p>
        )}
      </section>

      {resetPanel && (
        <section className="profile-settings" aria-labelledby="profile-settings-title">
          <div className="section-heading"><h2 id="profile-settings-title">설정</h2></div>
          {resetPanel}
        </section>
      )}

      <section className="profile-badges" aria-labelledby="profile-badges-title">
        <div className="section-heading"><h2 id="profile-badges-title">배지</h2></div>
        <ul className="profile-badge-grid" role="list">
          {badges.map((badge) => (
            <li className="surface profile-badge-card" key={badge.id} data-badge={badge.id} data-earned={badge.earned}>
              <div className="profile-badge-state">
                <span className="profile-badge-icon"><Icon name={badgeIcons[badge.id]} /></span>
                <span>{badge.earned ? '획득' : '잠김'}</span>
              </div>
              <h3>{badge.title}</h3>
              <p>{badge.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
