//export const API_MODE_STORAGE_KEY = 'movie-api-mode'
//export type ApiMode = 'rest' | 'graphql';

/*const DEFAULT_API_MODE: ApiMode = 'rest'
type Listener = () => void;

const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((listener) => listener())
}*/

/*
export function getStoredApiMode(): ApiMode {
  if (typeof window === 'undefined') {
    return DEFAULT_API_MODE
  }

  const value = window.localStorage.getItem(API_MODE_STORAGE_KEY)
  return value === 'graphql' ? 'graphql' : DEFAULT_API_MODE
}

export function setStoredApiMode(mode: ApiMode) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(API_MODE_STORAGE_KEY, mode)
  emit()
}

export function subscribeToApiMode(listener: Listener) {
  listeners.add(listener)

  if (typeof window !== 'undefined') {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === API_MODE_STORAGE_KEY) {
        listener()
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', handleStorage)
    }
  }

  return () => {
    listeners.delete(listener)
  }
}
*/
