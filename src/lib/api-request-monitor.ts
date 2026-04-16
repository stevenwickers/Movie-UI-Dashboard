import { useSyncExternalStore } from 'react'

type RequestPhase = 'idle' | 'pending' | 'success' | 'error';

export type ApiRequestSnapshot = {
  url: string | null;
  method: string | null;
  startedAt: number | null;
  finishedAt: number | null;
  durationMs: number | null;
  phase: RequestPhase;
  statusCode: number | null;
};

type Listener = () => void;

const emptySnapshot: ApiRequestSnapshot = {
  url: null,
  method: null,
  startedAt: null,
  finishedAt: null,
  durationMs: null,
  phase: 'idle',
  statusCode: null,
}

let snapshot: ApiRequestSnapshot = emptySnapshot
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((listener) => listener())
}

function updateSnapshot(next: Partial<ApiRequestSnapshot>) {
  snapshot = { ...snapshot, ...next }
  emit()
}

export function trackApiRequestStart(input: {
  url: string;
  method?: string | null;
  startedAt: number;
}) {
  updateSnapshot({
    url: input.url,
    method: input.method?.toUpperCase() ?? null,
    startedAt: input.startedAt,
    finishedAt: null,
    durationMs: null,
    phase: 'pending',
    statusCode: null,
  })
}

export function trackApiRequestEnd(input: {
  url: string;
  method?: string | null;
  startedAt: number;
  finishedAt: number;
  statusCode?: number | null;
  phase: Exclude<RequestPhase, 'idle' | 'pending'>;
}) {
  updateSnapshot({
    url: input.url,
    method: input.method?.toUpperCase() ?? null,
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    durationMs: Math.max(0, input.finishedAt - input.startedAt),
    phase: input.phase,
    statusCode: input.statusCode ?? null,
  })
}

export function subscribeToApiRequestSnapshot(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getApiRequestSnapshot() {
  return snapshot
}

export function useApiRequestSnapshot() {
  return useSyncExternalStore(
    subscribeToApiRequestSnapshot,
    getApiRequestSnapshot,
    getApiRequestSnapshot
  )
}
