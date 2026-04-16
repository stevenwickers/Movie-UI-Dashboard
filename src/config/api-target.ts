export type ApiTarget = 'csharp' | 'node'

const API_URLS: Record<ApiTarget, string> = {
  csharp: import.meta.env.VITE_CSHARP_API_URL,
  node: import.meta.env.VITE_NODE_API_URL,
}

/*let currentTarget: ApiTarget =
  (localStorage.getItem('api-target') as ApiTarget) || 'csharp'

export function getApiTarget(): ApiTarget {
  return currentTarget
}

export function setApiTarget(target: ApiTarget) {
  currentTarget = target
  localStorage.setItem('api-target', target)
}*/

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_CSHARP_API_URL // API_URLS["csharp"]
}
