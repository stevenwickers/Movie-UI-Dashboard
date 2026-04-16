import axios, { type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { getApiBaseUrl } from '@/config/api-target'
import { getApiErrorMessage } from '@/lib/api-error-message'
import {
  trackApiRequestEnd,
  trackApiRequestStart,
} from '@/lib/api-request-monitor'

type TrackedRequestConfig = InternalAxiosRequestConfig & {
  metadata?: {
    startedAt: number;
  };
};

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

function getRequestUrl(config: InternalAxiosRequestConfig) {
  return api.getUri(config)
}

api.interceptors.request.use((config) => {
  const nextConfig = config as TrackedRequestConfig
  nextConfig.baseURL = getApiBaseUrl()
  nextConfig.metadata = { startedAt: Date.now() }

  trackApiRequestStart({
    url: getRequestUrl(nextConfig),
    method: nextConfig.method,
    startedAt: nextConfig.metadata.startedAt,
  })

  return nextConfig
})

api.interceptors.response.use(
  (response) => {
    const config = response.config as TrackedRequestConfig
    const startedAt = config.metadata?.startedAt ?? Date.now()

    trackApiRequestEnd({
      url: getRequestUrl(config),
      method: config.method,
      startedAt,
      finishedAt: Date.now(),
      statusCode: response.status,
      phase: 'success',
    })

    return response
  },
  (error) => {
    if (axios.isCancel?.(error)) {
      return Promise.reject(error)
    }

    const config = (error.config ?? {}) as TrackedRequestConfig
    const startedAt = config.metadata?.startedAt ?? Date.now()

    trackApiRequestEnd({
      url: config.url ? getRequestUrl(config) : 'Unknown request',
      method: config.method,
      startedAt,
      finishedAt: Date.now(),
      statusCode: error.response?.status ?? null,
      phase: 'error',
    })

    const message = getApiErrorMessage(error)
    toast.error(message)

    return Promise.reject(error)
  }
)
