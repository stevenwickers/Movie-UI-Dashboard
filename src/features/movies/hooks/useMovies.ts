import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getGraphQlMovies } from '@/features/movies/api/movie-graphql-api.ts'
import { getMovies } from '../api/movies-api.ts'
import type { MovieFilters } from '../types/movie-types.ts'

export function useMovies(
  filters: MovieFilters,
  selectedFields: string[] = [],
  apiMode: string = 'rest'
) {
  return useQuery({
    queryKey: ['movies', apiMode, filters, selectedFields],
    queryFn: () =>
      apiMode === 'graphql'
        ? getGraphQlMovies(filters, selectedFields)
        : getMovies(filters),
    placeholderData: keepPreviousData,
  })
}
