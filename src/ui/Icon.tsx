const paths = {
  brand: 'M20.5 11a8.5 8.5 0 0 1-8.5 8.5H4l1.4-4A8.5 8.5 0 1 1 20.5 11ZM12 14.6l-2.7-2.5a1.6 1.6 0 0 1 2.7-1.7 1.6 1.6 0 0 1 2.7 1.7L12 14.6Z',
  home: 'm3.5 10 7.2-6.1a2 2 0 0 1 2.6 0l7.2 6.1v8.5a2 2 0 0 1-2 2h-3.8v-5.2a1 1 0 0 0-1-1h-3.4a1 1 0 0 0-1 1v5.2H5.5a2 2 0 0 1-2-2V10Z',
  bell: 'M18 9.5a6 6 0 0 0-12 0v3.1l-1.7 2.8a1.1 1.1 0 0 0 .9 1.7h13.6a1.1 1.1 0 0 0 .9-1.7L18 12.6V9.5ZM9.7 20a2.5 2.5 0 0 0 4.6 0',
  profile: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM7 19a5 5 0 0 1 10 0m-2.4-9a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0Z',
  map: 'M3.2 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V6Zm10.6 0a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V6ZM3.2 16a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3Zm10.6 0a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3Z',
  chat: 'M20.5 10a6.5 6.5 0 0 1-6.5 6.5H8.2L3.5 20V10A6.5 6.5 0 0 1 10 3.5h4a6.5 6.5 0 0 1 6.5 6.5ZM8.2 8.8h7.6m-7.6 3h4.8',
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
