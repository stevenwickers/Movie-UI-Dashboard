import type { PagedResponse as BasePagedResponse } from '@/types/paged-types.ts'
import type { SearchMode } from '@/features/movies/types/search-types.ts'

export type MovieColumnAlign = 'left' | 'right'

export const movieColumnConfig = {
  movie: {
    label: 'Movie',
    align: 'left',
    sortable: true,
    graphql: false,
    resizable: true,
    minWidth: 180,
    defaultWidth: 220,
    dbKey: 'movie_name',
  },
  releaseDate: {
    label: 'Release Date',
    align: 'left',
    sortable: true,
    graphql: true,
    resizable: true,
    minWidth: 140,
    defaultWidth: 150,
    dbKey: 'release_date',
  },
  worldwideGross: {
    label: 'Worldwide Gross',
    align: 'right',
    sortable: true,
    graphql: true,
    resizable: true,
    minWidth: 170,
    defaultWidth: 180,
    dbKey: 'worldwide_gross',
  },
  productionBudget: {
    label: 'Production Budget',
    align: 'right',
    sortable: true,
    graphql: true,
    resizable: true,
    minWidth: 170,
    defaultWidth: 180,
    dbKey: 'production_budget',
  },
  domesticGross: {
    label: 'Domestic Gross',
    align: 'right',
    sortable: true,
    graphql: true,
    resizable: true,
    minWidth: 160,
    defaultWidth: 170,
    dbKey: 'domestic_gross',
  },
  genres: {
    label: 'Genres',
    align: 'left',
    sortable: false,
    graphql: true,
    resizable: true,
    minWidth: 180,
    defaultWidth: 220,
  },
  edit: {
    label: 'Edit',
    align: 'right',
    sortable: false,
    graphql: false,
    resizable: false,
    minWidth: 150,
    defaultWidth: 150,
  },
} as const

export type ColumnKey = keyof typeof movieColumnConfig
type MovieColumnConfig = typeof movieColumnConfig

type KeysMatchingFlag<Flag extends keyof MovieColumnConfig[ColumnKey]> = {
  [Key in ColumnKey]: MovieColumnConfig[Key][Flag] extends true ? Key : never
}[ColumnKey]

export type SortableColumnKey = KeysMatchingFlag<'sortable'>
export type GraphQlFieldKey = KeysMatchingFlag<'graphql'>
export type SortDirection = 'asc' | 'desc'

export const allMovieColumns = Object.keys(movieColumnConfig) as ColumnKey[]

export const sortableMovieColumns = allMovieColumns.filter(
  (key): key is SortableColumnKey => movieColumnConfig[key].sortable,
)

export const movieGraphQlFields = allMovieColumns.filter(
  (key): key is GraphQlFieldKey => movieColumnConfig[key].graphql,
)

export const defaultMovieColumnWidths = Object.fromEntries(
  allMovieColumns.map((key) => [key, movieColumnConfig[key].defaultWidth]),
) as Record<ColumnKey, number>

export const minMovieColumnWidths = Object.fromEntries(
  allMovieColumns.map((key) => [key, movieColumnConfig[key].minWidth]),
) as Record<ColumnKey, number>

export function toMovieSortField(
  sortBy?: SortableColumnKey,
): string | undefined {
  if (!sortBy) {
    return undefined
  }

  return movieColumnConfig[sortBy].dbKey
}

type MovieBase = {
  id: string
  movieName?: string
  releaseDate?: string
  worldwideGross?: number | null
  productionBudget?: number | null
  movieLink?: string | null
  domesticGross?: number | null
  genres: string[]
  createdAt?: string
  updatedAt?: string
}

export type Movie = MovieBase
export type MovieResponse = MovieBase

export type PagedResponse<T> = BasePagedResponse<T> & {
  sortBy?: SortableColumnKey
  sortDirection?: SortDirection
  usedDefaultSort?: boolean
}

export type MovieFilters = {
  page?: number
  pageSize?: number
  search?: string
  searchMode?: SearchMode
  sortBy?: SortableColumnKey
  sortDirection?: SortDirection
  genres?: string[]
  genresSelected?: string[]
  releaseDateFrom?: string
  releaseDateTo?: string
  worldwideGrossMin?: number
  worldwideGrossMax?: number
  productionBudgetMin?: number
  productionBudgetMax?: number
  domesticGrossMin?: number
  domesticGrossMax?: number
}

export type MovieUpsertRequest = {
  movieName: string
  releaseDate?: string | null
  worldwideGross?: number | null
  productionBudget?: number | null
  domesticGross?: number | null
  movieLink?: string | null
  genres: string[]
}

export type MovieUpdateRequest = Partial<MovieUpsertRequest> &
  Pick<MovieUpsertRequest, 'movieName'>
