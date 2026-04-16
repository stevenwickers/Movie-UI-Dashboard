import { request } from 'graphql-request'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createGraphQlMovie,
  getGraphQlMovies,
  updateGraphQlMovie,
} from './movie-graphql-api'

vi.mock('graphql-request', () => ({
  request: vi.fn(),
}))

vi.mock('@/config/api-target', () => ({
  getApiBaseUrl: () => 'http://localhost:5000',
}))

const mockedRequest = vi.mocked(request)

describe('movie-graphql-api', () => {
  beforeEach(() => {
    mockedRequest.mockReset()
  })

  it('sends searchMode through to MovieFiltersInput', async () => {
    mockedRequest.mockResolvedValue({
      movies: {
        items: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
      },
    })

    await getGraphQlMovies(
      {
        search: 'alien',
        searchMode: 'general',
        page: 1,
        pageSize: 10,
        sortBy: 'movie',
        sortDirection: 'asc',
        genres: ['Drama'],
      },
      ['genres', 'releaseDate', 'domesticGross'],
    )

    expect(mockedRequest).toHaveBeenCalledWith(
      'http://localhost:5000/graphql',
      expect.stringContaining('query movies($filters: MovieFiltersInput)'),
      {
        filters: expect.objectContaining({
          search: 'alien',
          searchMode: 'general',
          page: 1,
          pageSize: 10,
          sortBy: 'movie_name',
          sortDirection: 'asc',
          genres: ['Drama'],
        }),
      },
    )
  })

  it('uses the current GraphQL patch mutation contract for updates', async () => {
    mockedRequest.mockResolvedValue({
      updateMovie: {
        id: '611350be-06bb-413f-ab94-e1259fadf02c',
        movieName: 'Avatar',
        releaseDate: '2009-12-15',
        worldwideGross: null,
        productionBudget: null,
        domesticGross: null,
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        createdAt: '2026-04-16T10:00:00Z',
        updatedAt: '2026-04-16T10:01:00Z',
      },
    })

    await updateGraphQlMovie('611350be-06bb-413f-ab94-e1259fadf02c', {
      movieName: 'Avatar',
      releaseDate: '2009-12-15',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
    })

    expect(mockedRequest).toHaveBeenCalledWith(
      'http://localhost:5000/graphql',
      expect.stringContaining('mutation UpdateMovie($id: UUID!, $patch: MoviePatchRequestInput!)'),
      {
        id: '611350be-06bb-413f-ab94-e1259fadf02c',
        patch: {
          movieName: 'Avatar',
          releaseDate: '2009-12-15',
          genreNames: ['Action', 'Adventure', 'Sci-Fi'],
        },
      },
    )
  })

  it('rejects GraphQL create requests with a clear message', async () => {
    await expect(
      createGraphQlMovie({
        movieName: 'Avatar',
        releaseDate: '2009-12-15',
        genres: ['Action'],
      }),
    ).rejects.toThrow('Creating movies is currently available only in REST mode.')
  })
})
