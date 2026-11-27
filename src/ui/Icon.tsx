const paths = {
  home: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  profile: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15',
  chat: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.5-4.5A8.5 8.5 0 1 1 21 11.5ZM8 11.5h.01m4 0h.01m4 0h.01',
  pin: 'M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0ZM14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  heart: 'M20.8 8.6c0 4.1-5.5 7.8-8.8 10.4C8.7 16.4 3.2 12.7 3.2 8.6a4.4 4.4 0 0 1 8.8 0 4.4 4.4 0 0 1 8.8 0Z',
  edit: 'm13.5 6.5 4 4M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11L4 20Z',
  down: 'M12 4v16m-6-6 6 6 6-6',
  next: 'm9 5 7 7-7 7',
  back: 'm14 6-6 6 6 6',
  lock: 'M7 11V7a5 5 0 1 1 10 0v4M5 11h14v10H5z',
  check: 'm5 12 4 4L19 6',
  info: 'M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d={paths[name]} />
  </svg>
}
