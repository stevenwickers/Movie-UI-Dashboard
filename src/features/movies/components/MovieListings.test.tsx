import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieListings } from './MovieListings'
import type { MovieResponse } from '@/features/movies/types/movie-types.ts'
import { formatToDate, formatToMoney } from '@/lib/string-utils.ts'

vi.mock('@/features/movies/components/MovieUpsertDialog.tsx', () => ({
  MovieUpsertDialog: ({
    trigger,
  }: {
    trigger?: ReactNode;
  }) => <>{trigger ?? <button type="button">Edit movie</button>}</>,
}))

vi.mock('@/features/movies/components/DeleteDialog.tsx', () => ({
  DeleteDialog: ({
    trigger,
  }: {
    trigger?: ReactNode;
  }) => <>{trigger ?? <button type="button">Delete movie</button>}</>,
}))

const movies: MovieResponse[] = [
  {
    id: '1',
    movieName: 'Arrival',
    releaseDate: '2016-11-11',
    worldwideGross: 203388186,
    productionBudget: 47000000,
    domesticGross: 100546139,
    genres: ['Sci-Fi', 'Drama', 'Mystery', 'Thriller'],
  },
]

describe('MovieListings', () => {
  it('renders an empty state when there are no movies', () => {
    render(
      <MovieListings
        movies={[]}
        visibleColumns={['movie', 'releaseDate', 'edit']}
        sortColumn="movie"
        sortDirection="asc"
        onColumnSort={vi.fn()}
      />
    )

    expect(screen.getByText('No movies found.')).toBeInTheDocument()
  })

  it('renders movie data and collapsed genre badges', () => {
    render(
      <MovieListings
        movies={movies}
        visibleColumns={[
          'movie',
          'releaseDate',
          'worldwideGross',
          'productionBudget',
          'domesticGross',
          'genres',
          'edit',
        ]}
        sortColumn="movie"
        sortDirection="asc"
        onColumnSort={vi.fn()}
      />
    )

    expect(screen.getAllByText('Arrival')[0]).toBeInTheDocument()
    expect(screen.getAllByText(formatToDate('2016-11-11'))[0]).toBeInTheDocument()
    expect(screen.getAllByText(formatToMoney(203388186))[0]).toBeInTheDocument()
    expect(screen.getAllByText('Sci-Fi')[0]).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit Arrival' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Delete Arrival' })).not.toHaveLength(0)
  })

  it('calls the sort callback when a sortable header is clicked', async () => {
    const user = userEvent.setup()
    const onColumnSort = vi.fn()

    render(
      <MovieListings
        movies={movies}
        visibleColumns={['movie', 'releaseDate', 'edit']}
        sortColumn="movie"
        sortDirection="asc"
        onColumnSort={onColumnSort}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Sort by Movie' }))

    expect(onColumnSort).toHaveBeenCalledWith('movie')
  })
})
