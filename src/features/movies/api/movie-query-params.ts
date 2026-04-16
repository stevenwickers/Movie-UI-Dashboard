import { toMovieSortField, type MovieFilters } from '@/features/movies/types/movie-types.ts'

export function buildMoviesQueryParams(filters: MovieFilters): URLSearchParams {
  const params = new URLSearchParams()
  const selectedGenres = filters.genres ?? filters.genresSelected

  if (filters.page) {
    params.set('page', String(filters.page))
  }

  if (filters.pageSize) {
    params.set('pageSize', String(filters.pageSize))
  }

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.searchMode) {
    params.set('searchMode', filters.searchMode.toLowerCase())
  }

  if (filters.sortBy) {
    params.set('sortBy', toMovieSortField(filters.sortBy) ?? filters.sortBy)
  }

  if (filters.sortDirection) {
    params.set('sortDirection', filters.sortDirection)
  }

  selectedGenres?.forEach((genre) => {
    params.append('genres', genre)
  })

  if (filters.releaseDateFrom != null) {
    params.set('releaseDateFrom', String(filters.releaseDateFrom))
  }

  if (filters.releaseDateTo != null) {
    params.set('releaseDateTo', String(filters.releaseDateTo))
  }

  if (filters.worldwideGrossMin != null) {
    params.set('worldwideGrossMin', String(filters.worldwideGrossMin))
  }

  if (filters.worldwideGrossMax != null) {
    params.set('worldwideGrossMax', String(filters.worldwideGrossMax))
  }

  if (filters.domesticGrossMin != null) {
    params.set('domesticGrossMin', String(filters.domesticGrossMin))
  }

  if (filters.domesticGrossMax != null) {
    params.set('domesticGrossMax', String(filters.domesticGrossMax))
  }

  if (filters.productionBudgetMin != null) {
    params.set('productionBudgetMin', String(filters.productionBudgetMin))
  }

  if (filters.productionBudgetMax != null) {
    params.set('productionBudgetMax', String(filters.productionBudgetMax))
  }

  return params
}
