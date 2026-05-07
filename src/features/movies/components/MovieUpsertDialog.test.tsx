import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { movieGraphQlFields } from '@/features/movies/types/movie-types.ts'
import { MovieUpsertDialog } from './MovieUpsertDialog'

const mockCreateMovie = vi.fn()
const mockUpdateMovie = vi.fn()

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux')

  return {
    ...actual,
    useSelector: (selector: (state: unknown) => unknown) =>
      selector({
        apiMode: { mode: 'rest' },
        graphqlColumns: { selectedFields: movieGraphQlFields },
      }),
  }
})

vi.mock('@/features/genres/hooks/useGenres.ts', () => ({
  useGenres: () => ({
    data: [
      { id: 'genre-1', name: 'Drama' },
      { id: 'genre-2', name: 'Sci-Fi' },
    ],
    isLoading: false,
    error: null,
  }),
}))

vi.mock('@/features/movies/hooks/useUpsertMovie.ts', () => ({
  useCreateMovie: () => ({
    mutateAsync: mockCreateMovie,
    isPending: false,
    error: null,
  }),
  useUpdateMovie: () => ({
    mutateAsync: mockUpdateMovie,
    isPending: false,
    error: null,
  }),
}))

describe('MovieUpsertDialog', () => {
  beforeEach(() => {
    mockCreateMovie.mockReset()
    mockUpdateMovie.mockReset()
  })

  it('shows a genre validation error when creating without a selected genre', async () => {
    const user = userEvent.setup()

    render(<MovieUpsertDialog mode="create" />)

    await user.click(screen.getByRole('button', { name: 'Add movie' }))
    await user.type(screen.getByPlaceholderText('e.g. The Matrix'), 'Arrival')
    await user.type(
      document.querySelector('input[type="date"]') as HTMLInputElement,
      '2016-11-11',
    )
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(screen.getByText('Select at least one genre')).toBeInTheDocument()
    expect(mockCreateMovie).not.toHaveBeenCalled()
  })

  it('preserves selected genres when editing only a revenue field', async () => {
    const user = userEvent.setup()

    render(
      <MovieUpsertDialog
        mode="edit"
        movie={{
          id: 'movie-1',
          movieName: 'Arrival',
          releaseDate: '2016-11-11',
          worldwideGross: 203388186,
          productionBudget: 47000000,
          domesticGross: 100546139,
          genres: ['Drama', 'Sci-Fi'],
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit' }))

    const worldwideGrossInput = screen.getByPlaceholderText('e.g. 463517383')
    await user.clear(worldwideGrossInput)
    await user.type(worldwideGrossInput, '203388187')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(mockUpdateMovie).toHaveBeenCalledWith({
      id: 'movie-1',
      input: expect.objectContaining({
        worldwideGross: 203388187,
        genres: ['Drama', 'Sci-Fi'],
      }),
    })
  })
})
