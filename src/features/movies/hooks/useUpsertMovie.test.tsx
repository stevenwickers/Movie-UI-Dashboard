import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { deleteGraphQlMovie } from '@/features/movies/api/movie-graphql-api.ts'
import { deleteMovie } from '@/features/movies/api/movies-api'
import { GRAPHQL } from '@/features/movies/constants'
import { useDeleteMovie } from '@/features/movies/hooks/useUpsertMovie.ts'

vi.mock('@/features/movies/api/movies-api', () => ({
  createMovie: vi.fn(),
  updateMovie: vi.fn(),
  deleteMovie: vi.fn(),
}))

vi.mock('@/features/movies/api/movie-graphql-api.ts', () => ({
  createGraphQlMovie: vi.fn(),
  updateGraphQlMovie: vi.fn(),
  deleteGraphQlMovie: vi.fn(),
}))

const mockDeleteMovie = vi.mocked(deleteMovie)
const mockDeleteGraphQlMovie = vi.mocked(deleteGraphQlMovie)

function createWrapper() {
  const queryClient = new QueryClient()

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe('useDeleteMovie', () => {
  beforeEach(() => {
    mockDeleteMovie.mockReset()
    mockDeleteGraphQlMovie.mockReset()
  })

  it('calls the REST delete API in REST mode', async () => {
    mockDeleteMovie.mockResolvedValue({
      id: 'movie-1',
      movieName: 'Arrival',
      genres: [],
    })

    const { result } = renderHook(() => useDeleteMovie('rest'), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.mutateAsync({ id: 'movie-1' })
    })

    expect(mockDeleteMovie).toHaveBeenCalledWith('movie-1')
    expect(mockDeleteGraphQlMovie).not.toHaveBeenCalled()
  })

  it('calls the GraphQL delete API in GraphQL mode', async () => {
    mockDeleteGraphQlMovie.mockResolvedValue({
      id: 'movie-1',
      movieName: 'Arrival',
      genres: [],
    })

    const { result } = renderHook(() => useDeleteMovie(GRAPHQL), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.mutateAsync({ id: 'movie-1' })
    })

    expect(mockDeleteGraphQlMovie).toHaveBeenCalledWith('movie-1')
    expect(mockDeleteMovie).not.toHaveBeenCalled()
  })
})
