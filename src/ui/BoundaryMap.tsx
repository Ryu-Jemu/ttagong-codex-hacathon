import boundarySvg from '../regions/reference/krmap-sido-boundaries.svg?raw'
import { useState } from 'react'

type BoundaryEntry = {
  id: string
  name: string
  shortName: string
  value: string
  label: string
  band: string
  followed: boolean
  updated: boolean
}

const source = new DOMParser().parseFromString(boundarySvg, 'image/svg+xml')
// Remove the original outer margins. Every coordinate, including offshore islands, stays inside.
const viewBox = '44 44 970 1050'
const outlines = new Map(Array.from(source.querySelectorAll('path[id]'), (path) =>
  [path.id, path.getAttribute('d')] as const,
))
const positions = new Map(Array.from(source.querySelectorAll('text[x][y]'), (label) =>
  [label.textContent?.trim(), { x: label.getAttribute('x'), y: label.getAttribute('y') }] as const,
))
const labelOffsets: Readonly<Record<string, readonly [number, number]>> = {
  서울: [-12, 0],
  인천: [-47, 5],
  충북: [32, -20],
  세종: [10, 0],
  대전: [41, 55],
  울산: [16, -27],
}

export default function BoundaryMap({ entries, onRegion }: {
  entries: readonly BoundaryEntry[]
  onRegion: (id: string) => void
}) {
  const [picked, setPicked] = useState('')
  const mappedEntries = entries.flatMap((entry) => {
    const outline = outlines.get(entry.name)
    const point = positions.get(entry.shortName)
    if (!outline || !point?.x || !point.y) return []
    const offset = labelOffsets[entry.shortName]
    const originX = Number(point.x)
    const originY = Number(point.y)
    const x = originX + (offset?.[0] ?? 0)
    const y = originY + (offset?.[1] ?? 0)
    return [{ entry, outline, originX, originY, offset, x, y }]
  })

  return (
    <div className="boundary-map">
      <svg className="boundary-map-svg" viewBox={viewBox} role="group" aria-label="16개 광역 지역 행정 경계 지도">
        {mappedEntries.map(({ entry, outline }) => (
          <g key={entry.id} className="boundary-area" role="button" tabIndex={0}
            aria-label={entry.label} data-band={entry.band} data-followed={entry.followed || undefined}
            data-updated={entry.updated} data-picked={entry.id === picked || undefined}
            onClick={() => onRegion(entry.id)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return
              event.preventDefault()
              if (!event.repeat) onRegion(entry.id)
            }}>
            <path className="boundary-outline" d={outline} fillRule="evenodd" strokeLinejoin="round"
              vectorEffect="non-scaling-stroke" aria-hidden="true" />
          </g>
        ))}
        <g className="boundary-label-layer" aria-hidden="true">
          {mappedEntries.map(({ entry, originX, originY, offset, x, y }) => (
            <g key={entry.id} className="boundary-area boundary-annotation" data-band={entry.band} data-region-id={entry.id}
              onClick={() => onRegion(entry.id)}>
              {offset && <line className="boundary-leader" x1={originX} y1={originY - 8}
                x2={x} y2={y - 8} vectorEffect="non-scaling-stroke" />}
              <rect className="boundary-hit" x={x - 34} y={y - 27} width={68} height={entry.band === 'zero' ? 36 : 57} />
              <text className="boundary-label" x={x} y={y} textAnchor="middle">
                <tspan>{entry.shortName}</tspan>
                {entry.band !== 'zero' && <tspan className="boundary-value" x={x} dy="1.1em">{entry.value}</tspan>}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <div className="boundary-chooser">
        <label className="visually-hidden" htmlFor="map-region-chooser">행정구역 선택</label>
        <select id="map-region-chooser" value={picked} onChange={(event) => setPicked(event.target.value)}>
          <option value="">행정구역 선택</option>
          {entries.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
        </select>
        <button type="button" className="button button-outline" disabled={!picked}
          onClick={() => onRegion(picked)}>소식 보기</button>
      </div>
    </div>
  )
}
