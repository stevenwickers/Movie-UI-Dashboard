/*
import { useSyncExternalStore } from 'react'
import {
  getStoredApiMode,
  subscribeToApiMode,
  setStoredApiMode,
} from '@/lib/api-mode-storage.ts'

export type { ApiMode } from '@/lib/api-mode-storage.ts'

export function useApiMode() {
  const apiMode = useSyncExternalStore(
    subscribeToApiMode,
    getStoredApiMode,
    getStoredApiMode
  )

  return {
    apiMode,
    setApiMode: setStoredApiMode,
  }
}
*/
