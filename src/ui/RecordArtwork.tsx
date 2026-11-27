import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

const palettes = {
  scarlet: '검정 · 다홍',
  gold: '갈색 · 금빛',
  violet: '보라 · 라일락',
  jade: '녹색 · 크림',
  dusk: '남색 · 분홍',
} as const

const marks = {
  moon: { label: '달', glyph: '☾' },
  sun: { label: '햇살', glyph: '✺' },
  star: { label: '별', glyph: '✦' },
  leaf: { label: '잎', glyph: '❧' },
  heart: { label: '하트', glyph: '♥' },
} as const

export type Artwork = { palette: keyof typeof palettes; mark: keyof typeof marks }

const artworkKey = 'ttagong.settings.lp-artwork'

export function loadArtwork(): Record<string, Artwork> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(artworkKey) ?? '{}')
    if (!saved || typeof saved !== 'object') return {}
    return Object.fromEntries(Object.entries(saved).filter(([, value]) =>
      value && typeof value.palette === 'string' && Object.hasOwn(palettes, value.palette) &&
      typeof value.mark === 'string' && Object.hasOwn(marks, value.mark),
    ))
  } catch {
    return {}
  }
}

export function saveArtwork(artwork: Record<string, Artwork>) {
  try {
    localStorage.setItem(artworkKey, JSON.stringify(artwork))
    return true
  } catch {
    return false
  }
}

export function RecordDisc({ artwork }: { artwork: Artwork }) {
  return <span className="music-record" data-palette={artwork.palette} data-mark={artwork.mark} aria-hidden="true">
    <span className="record-label"><span>{marks[artwork.mark].glyph}</span></span>
  </span>
}

export function RecordArtworkEditor({ title, artwork, defaultArtwork, onSave, onClose }: {
  title: string
  artwork: Artwork
  defaultArtwork: Artwork
  onSave: (next: Artwork) => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [preview, setPreview] = useState(artwork)

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave(preview)
    dialog.current?.close()
  }

  return <dialog ref={dialog} className="record-dialog" aria-labelledby="record-title" onClose={onClose}>
    <form className="record-editor" onSubmit={submit}>
      <header className="record-dialog-header">
        <div><h2 id="record-title">LP 꾸미기</h2><p>{title}</p></div>
        <button type="button" className="button button-outline" onClick={() => dialog.current?.close()} autoFocus>닫기</button>
      </header>
      <div className="record-preview"><RecordDisc artwork={preview} /></div>
      <fieldset>
        <legend>색 조합</legend>
        <div className="record-options">
          {(Object.keys(palettes) as Artwork['palette'][]).map((palette) => <label key={palette} className="record-option">
            <input type="radio" className="visually-hidden" name="record-palette" checked={preview.palette === palette}
              onChange={() => setPreview({ ...preview, palette })} />
            <span className="record-swatch" data-palette={palette} aria-hidden="true" />{palettes[palette]}
          </label>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>라벨 그림</legend>
        <div className="record-options">
          {(Object.keys(marks) as Artwork['mark'][]).map((mark) => <label key={mark} className="record-option">
            <input type="radio" className="visually-hidden" name="record-mark" checked={preview.mark === mark}
              onChange={() => setPreview({ ...preview, mark })} />
            <span aria-hidden="true">{marks[mark].glyph}</span>{marks[mark].label}
          </label>)}
        </div>
      </fieldset>
      <p className="record-storage-note">이 브라우저에 저장됩니다.</p>
      <div className="music-composer-actions">
        <button type="submit" className="button button-primary">저장</button>
        <button type="button" className="button button-outline" onClick={() => setPreview(defaultArtwork)}>기본 디자인</button>
      </div>
    </form>
  </dialog>
}
