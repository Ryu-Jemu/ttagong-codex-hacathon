import { useRef, useState } from 'react';
import { DEMO_AUTHOR, makeDemoState, type DemoState } from './fixtures';
import { parseModerationResult, validModerationText } from './moderation';
import type { DemoController, Draft, ModerationResult, Post } from './types';

const STORAGE_KEY = 'ongi-jido.demo.v1';

function loadState(): DemoState {
  const initial = makeDemoState();
  if (import.meta.env.PROD) return initial;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state: DemoState = JSON.parse(saved);
      if (Array.isArray(state.posts) && Array.isArray(state.alerts) && Array.isArray(state.messages)) {
        return state;
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

  async function publish(draft: Draft): Promise<ModerationResult> {
    const unavailable = { decision: 'UNAVAILABLE' } as const;
    if (readOnly || pending.current) return unavailable;

    const { title, body, regionId } = draft;
    if (!validModerationText(title, body) || !/^\d{10}$/.test(regionId)) return unavailable;

    const request = new AbortController();
    pending.current = request;
    const timeout = window.setTimeout(() => request.abort(), 48_000);
    try {
      const response = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
        signal: request.signal,
      });
      if (!response.ok) return unavailable;
      const result = parseModerationResult(await response.json());
      if (request.signal.aborted) return unavailable;
      if (result.decision !== 'APPROVED') return result;

      const post: Post = {
        ...DEMO_AUTHOR,
        id: newId(), title, body, regionId,
        createdAt: new Date().toISOString(),
        hearts: 0,
      };
      const latest = current.current;
      return save({ ...latest, posts: [post, ...latest.posts] }) ? result : unavailable;
    } catch {
      return unavailable;
    } finally {
      window.clearTimeout(timeout);
      if (pending.current === request) pending.current = null;
    }
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

  return { readOnly, ...state, publish, toggleHeart, readAlert, sendMessage, reset };
}
