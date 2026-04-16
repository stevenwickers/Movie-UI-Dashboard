import axios from 'axios'

/**
 * Best-effort message from API error bodies
 * (ASP.NET ProblemDetails, validation payloads, plain strings, etc.).
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data

    if (typeof data === 'string' && data.trim()) {
      return data.trim()
    }

    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>

      if (typeof record.detail === 'string' && record.detail.trim()) {
        return record.detail.trim()
      }

      if (typeof record.message === 'string' && record.message.trim()) {
        return record.message.trim()
      }

      if (typeof record.title === 'string' && record.title.trim()) {
        return record.title.trim()
      }

      if (typeof record.error === 'string' && record.error.trim()) {
        return record.error.trim()
      }

      const errors = record.errors
      if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
        const firstError = Object.values(errors as Record<string, unknown>)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))[0]

        if (typeof firstError === 'string' && firstError.trim()) {
          return firstError.trim()
        }
      }
    }

    if (status && error.response?.statusText) {
      return `${status} ${error.response.statusText}`
    }

    if (error.message) {
      return error.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Request failed'
}