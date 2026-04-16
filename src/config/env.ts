const apiTarget = import.meta.env.VITE_API_TARGET
const csharpApiUrl = import.meta.env.VITE_CSHARP_API_URL
const nodeApiUrl = import.meta.env.VITE_NODE_API_URL

function getBaseUrl() {
  switch (apiTarget) {
    case 'csharp':
      return csharpApiUrl
    case 'node':
      return nodeApiUrl
    default:
      throw new Error(
        `Invalid VITE_API_TARGET: "${apiTarget}". Expected "csharp" or "node".`
      )
  }
}

export const env = {
  apiTarget,
  apiBaseUrl: getBaseUrl()
}