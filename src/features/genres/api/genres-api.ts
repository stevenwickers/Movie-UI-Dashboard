import { api } from '@/lib/api'
import type { GenreResponse } from '../types/genres-types'

const GENRES_ENDPOINT = '/genres'

export async function getGenres(): Promise<GenreResponse[]> {
  const response = await api.get<GenreResponse[]>(GENRES_ENDPOINT)
  return response.data
}

