import type { Post } from '../core/types'
import { regions } from '../regions'
import { Icon } from './Icon'

const kstDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', dateStyle: 'short' })
const storyDate = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'long',
  day: 'numeric',
})

export function newestFirst(a: Post, b: Post) {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt) || compareIds(a, b)
}

function compareIds(a: Post, b: Post) {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}

export function popularStories(posts: readonly Post[], now = new Date()) {
  const days = new Set(Array.from({ length: 7 }, (_, daysAgo) =>
    kstDay.format(now.getTime() - daysAgo * 86_400_000),
  ))

  return posts.filter((post) => {
    const time = Date.parse(post.createdAt)
    return Number.isFinite(time) && time <= now.getTime() && days.has(kstDay.format(time))
  }).sort((a, b) => b.hearts - a.hearts || newestFirst(a, b))
}

export function storyRegion(post: Post) {
  return regions.find((region) => region.id === post.regionId)?.shortName ?? '지역 미상'
}

export function StoryDate({ post }: { post: Post }) {
  if (!Number.isFinite(Date.parse(post.createdAt))) return null
  return <time dateTime={post.createdAt}>{storyDate.format(new Date(post.createdAt))}</time>
}

export function Heart({ post, onHeart }: { post: Post; onHeart?: () => void }) {
  const contents = <><Icon name="heart" filled={post.hearted} /><span>{post.hearts}</span></>
  if (!onHeart) {
    return <span className="heart" aria-label={`공감 ${post.hearts}개`}>{contents}</span>
  }

  return (
    <button className="heart" type="button" onClick={onHeart} aria-pressed={Boolean(post.hearted)}
      aria-label={`공감 · ${post.title} · ${post.hearts}개`}>
      {contents}
    </button>
  )
}

export function StoryCards({ posts, onOpen, onHeart, empty, deck = false }: {
  posts: readonly Post[]
  onOpen: (post: Post, opener: HTMLButtonElement) => void
  onHeart?: (id: string) => void
  empty: string
  deck?: boolean
}) {
  if (!posts.length) return <p className="empty-state">{empty}</p>

  return (
    <div className={deck ? 'story-list story-deck' : 'story-list'}>
      {posts.map((post) => (
        <article className="story-card" key={post.id}>
          {deck
            ? <p className="deck-byline">{post.authorName}</p>
            : <div className="story-meta">
                <span className="region-label"><Icon name="pin" />{storyRegion(post)}</span>
                <StoryDate post={post} />
              </div>}
          <h3>
            <button type="button" className="story-link" aria-haspopup="dialog"
              onClick={(event) => onOpen(post, event.currentTarget)}>{post.title}</button>
          </h3>
          {!deck && <>
            <p className="story-preview">{post.body}</p>
            <div className="story-footer">
              <span>{post.authorName}</span>
              <Heart post={post} onHeart={onHeart ? () => onHeart(post.id) : undefined} />
            </div>
          </>}
        </article>
      ))}
    </div>
  )
}
