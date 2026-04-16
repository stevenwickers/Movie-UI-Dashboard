import { api } from '@/lib/api.ts'
import { buildMoviesQueryParams } from '@/features/movies/api/movie-query-params.ts'
import type {
  MovieResponse,
  MovieFilters,
  MovieUpsertRequest,
  MovieUpdateRequest,
  PagedResponse,
} from '@/features/movies/types/movie-types.ts'

const MOVIES_ENDPOINT = '/movies'

export async function getMovies(
  filters: MovieFilters,
): Promise<PagedResponse<MovieResponse>> {
  const response = await api.get<PagedResponse<MovieResponse>>(
    MOVIES_ENDPOINT,
    {
      params: buildMoviesQueryParams(filters),
    },
  )

  return response.data
}

export async function createMovie(
  input: MovieUpsertRequest,
): Promise<MovieResponse> {
  const response = await api.post<MovieResponse>(MOVIES_ENDPOINT, input)
  return response.data
}

export async function updateMovie(
  id: string,
  input: MovieUpdateRequest,
): Promise<MovieResponse> {
  const response = await api.put<MovieResponse>(
    `${MOVIES_ENDPOINT}/${id}`,
    input,
  )

  return response.data
}

export async function deleteMovie(id: string): Promise<MovieResponse> {
  const response = await api.delete<MovieResponse>(`${MOVIES_ENDPOINT}/${id}`)

  return response.data
}
