import { useRef, useState } from 'react';
import { DEMO_AUTHOR, makeDemoState, type DemoState } from './fixtures';
import { MUSIC_REASON_LIMIT, parseModerationResult, validModerationText } from './moderation';
import type { DemoController, Draft, ModerationResult, Post } from './types';
import { regions } from '../regions';

const STORAGE_KEY = 'ongi-jido.demo.v1';
const unavailable = { decision: 'UNAVAILABLE' } as const;

function loadState(): DemoState {
  const initial = makeDemoState();
  if (import.meta.env.PROD) return initial;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state: DemoState = JSON.parse(saved);
      if (Array.isArray(state.posts) && Array.isArray(state.alerts) && Array.isArray(state.messages)) {
        const examples = new Map(initial.posts.map((post) => [post.id, post.featuredComment]));
        const posts = state.posts.map((post) => ({ ...post, featuredComment: post.featuredComment ?? examples.get(post.id) }));
        return { ...state, posts, recommendations: Array.isArray(state.recommendations) ? state.recommendations : [] };
      }
    }
  } catch {
    // Start with the examples when the browser cannot read the saved state.
  }
  return initial;
}

function newId(): string {
  return crypto.randomUUID();
}

export function useDemo(): DemoController {
  const readOnly = import.meta.env.PROD;
  const [state, setState] = useState(loadState);
  const current = useRef(state);
  const pending = useRef<AbortController | null>(null);

  function save(next: DemoState): boolean {
    if (readOnly) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return false;
    }
    current.current = next;
    setState(next);
    return true;
  }

  async function reviewAndSave(title: string, body: string, saveApproved: () => boolean,
    scope?: 'music'): Promise<ModerationResult> {
    if (readOnly || pending.current) return unavailable;
    if (!validModerationText(title, body)) return unavailable;

    const request = new AbortController();
    pending.current = request;
    const timeout = window.setTimeout(() => request.abort(), 48_000);
    try {
      const response = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, scope }),
        signal: request.signal,
      });
      if (!response.ok) return unavailable;
      const result = parseModerationResult(await response.json());
      if (request.signal.aborted) return unavailable;
      if (result.decision !== 'APPROVED') return result;

      return saveApproved() ? result : unavailable;
    } catch {
      return unavailable;
    } finally {
      window.clearTimeout(timeout);
      if (pending.current === request) pending.current = null;
    }
  }

  async function publish({ title, body, regionId }: Draft): Promise<ModerationResult> {
    if (!regions.some(({ id }) => id === regionId)) return unavailable;

    return reviewAndSave(title, body, () => {
      const post: Post = { ...DEMO_AUTHOR, id: newId(), title, body, regionId, createdAt: new Date().toISOString(), hearts: 0 };
      const latest = current.current;
      return save({ ...latest, posts: [post, ...latest.posts] });
    });
  }

  async function publishRecommendation(trackId: string, title: string, reason: string): Promise<ModerationResult> {
    if (!/^[a-z0-9-]{1,40}$/.test(trackId) || reason.length > MUSIC_REASON_LIMIT) return unavailable;

    return reviewAndSave(title, reason, () => {
      const entry = { id: newId(), trackId, authorName: DEMO_AUTHOR.authorName, reason };
      const latest = current.current;
      return save({ ...latest, recommendations: [entry, ...latest.recommendations] });
    }, 'music');
  }

  function toggleHeart(id: string) {
    if (readOnly) return;
    const latest = current.current;
    if (!latest.posts.some((post) => post.id === id)) return;
    save({
      ...latest,
      posts: latest.posts.map((post) =>
        post.id === id
          ? { ...post, hearted: !post.hearted, hearts: Math.max(0, post.hearts + (post.hearted ? -1 : 1)) }
          : post,
      ),
    });
  }

  function readAlert(id: string) {
    if (readOnly) return;
    const latest = current.current;
    if (!latest.alerts.some((alert) => alert.id === id && !alert.read)) return;
    save({
      ...latest,
      alerts: latest.alerts.map((alert) => alert.id === id ? { ...alert, read: true } : alert),
    });
  }

  function sendMessage(text: string) {
    if (readOnly || !text.trim()) return;
    const latest = current.current;
    save({ ...latest, messages: [...latest.messages, { id: newId(), text: text.trim(), mine: true }] });
  }

  function reset() {
    if (readOnly) return;
    if (save(makeDemoState())) pending.current?.abort();
  }

  return { readOnly, ...state, publish, publishRecommendation, toggleHeart, readAlert, sendMessage, reset };
}
