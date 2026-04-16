import { request } from 'graphql-request'
import { getApiBaseUrl } from '@/config/api-target'
import type { GraphqlMovieNode } from '@/features/movies/api/types/GraphqlMovieNode.ts'
import {
  toMovieSortField,
  type GraphQlFieldKey,
  type MovieFilters,
  type MovieResponse,
  type MovieUpsertRequest,
  type MovieUpdateRequest,
  type PagedResponse,
} from '@/features/movies/types/movie-types.ts'

type CreateMovieMutationResult = {
  createMovie: MovieResponse
}

type UpdateMovieMutationResult = {
  updateMovie: MovieResponse
}

type MoviesQueryResult = {
  movies: {
    items: GraphqlMovieNode[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

type GraphQlMoviePatchRequest = {
  movieName?: string
  releaseDate?: string | null
  worldwideGross?: number | null
  productionBudget?: number | null
  domesticGross?: number | null
  genreNames?: string[]
}

const GRAPHQL_ENDPOINT = '/graphql'

function getGraphQlUrl() {
  const baseUrl = getApiBaseUrl()?.trim()

  if (!baseUrl) {
    throw new Error(
      'Missing API base URL. Check VITE_CSHARP_API_URL / VITE_NODE_API_URL and reload Vite.',
    )
  }

  try {
    return new URL(GRAPHQL_ENDPOINT, baseUrl).toString()
  } catch {
    throw new Error(
      `Invalid API base URL "${baseUrl}". Expected an absolute URL such as "http://localhost:5000".`,
    )
  }
}

function mapGraphqlMovie(movie: GraphqlMovieNode): MovieResponse {
  return {
    id: movie.id,
    movieName: movie.movieName,
    releaseDate: movie.releaseDate,
    worldwideGross: movie.worldwideGross ?? null,
    productionBudget: movie.productionBudget ?? null,
    domesticGross: movie.domesticGross ?? null,
    movieLink: movie.movieLink ?? null,
    genres: movie.genres ?? [],
  }
}

function cleanObject(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value === undefined) return false
      if (typeof value === 'string' && value.trim() === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }),
  )
}

function toGraphQlMoviePatch(
  input: MovieUpdateRequest,
): GraphQlMoviePatchRequest {
  return cleanObject({
    movieName: input.movieName,
    releaseDate: input.releaseDate,
    worldwideGross: input.worldwideGross,
    productionBudget: input.productionBudget,
    domesticGross: input.domesticGross,
    genreNames: input.genres,
  })
}

export async function getGraphQlMovies(
  filters: MovieFilters,
  selectedFields: string[],
): Promise<PagedResponse<MovieResponse>> {
  const requestedFields = Array.from(
    new Set<GraphQlFieldKey>([...(selectedFields as GraphQlFieldKey[])]),
  )

  const columns = `
    id movieName ${requestedFields.join(' ')}
  `

  const query = `
    query movies($filters: MovieFiltersInput) {
      movies(filters: $filters) {
        items {
          ${columns}
        }
        totalCount
        totalPages
        page
        pageSize
      }
    }
  `

  const params = cleanObject({
    ...filters,
    genres: filters.genres ?? filters.genresSelected,
    genresSelected: undefined,
    sortBy: toMovieSortField(filters.sortBy),
  })

  const data = await request<MoviesQueryResult>(getGraphQlUrl(), query, {
    filters: params,
  })

  return {
    ...data.movies,
    items: data.movies.items.map(mapGraphqlMovie),
    sortBy: filters.sortBy ?? 'movie',
    sortDirection: filters.sortDirection ?? 'asc',
    usedDefaultSort: !filters.sortBy,
  }
}

export async function createGraphQlMovie(
  _input: MovieUpsertRequest,
): Promise<MovieResponse> {
  throw new Error(
    'Creating movies is currently available only in REST mode.',
  )
}

export async function updateGraphQlMovie(
  id: string,
  input: MovieUpdateRequest,
): Promise<MovieResponse> {
  const mutation = `
    mutation UpdateMovie($id: UUID!, $patch: MoviePatchRequestInput!) {
      updateMovie(id: $id, patch: $patch) {
        id
        movieName
        releaseDate
        worldwideGross
        productionBudget
        domesticGross
        genres
        createdAt
        updatedAt
      }
    }
  `

  const data = await request<UpdateMovieMutationResult>(
    getGraphQlUrl(),
    mutation,
    { id, patch: toGraphQlMoviePatch(input) },
  )

  return data.updateMovie
}
