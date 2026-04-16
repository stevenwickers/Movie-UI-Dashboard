import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MoviesPage } from './MoviesPage'
import { movieGraphQlFields, type MovieResponse } from '@/features/movies/types/movie-types.ts'

const mockDispatch = vi.fn()
const mockUseSelector = vi.fn()
const mockUseGenres = vi.fn()
const mockUseMovies = vi.fn()
const mockUseMovieFilterState = vi.fn()
const mockMovieListings = vi.fn()

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux')

  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: (state: unknown) => unknown) => mockUseSelector(selector),
  }
})

vi.mock('@/features/genres/hooks/useGenres.ts', () => ({
  useGenres: () => mockUseGenres(),
}))

vi.mock('@/features/movies/hooks', () => ({
  useMovies: (...args: unknown[]) => mockUseMovies(...args),
  useMovieFilterState: () => mockUseMovieFilterState(),
}))

vi.mock('@/components', () => ({
  ApiDiagnosticsDrawer: () => <div>Api diagnostics</div>,
  CheckboxPopover: ({ title }: { title?: string }) => <div>{title ?? 'Checkbox Popover'}</div>,
  PaginationControl: ({
    page,
    totalPages,
  }: {
    page: number;
    totalPages: number;
  }) => <div>{`Pagination ${page}/${totalPages}`}</div>,
  SearchInput: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <label>
      Search
      <input
        aria-label="Search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  ),
  SelectionDropdown: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <label>
      Search Types
      <select
        aria-label="Search Types"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="general">General</option>
        <option value="movieName">Movie Name</option>
      </select>
    </label>
  ),
}))

vi.mock('@/components/ui', () => ({
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <button
      type="button"
      aria-label="Toggle API mode"
      aria-pressed={checked}
      onClick={() => onCheckedChange(!checked)}
    >
      Toggle API mode
    </button>
  ),
  Separator: () => <div data-testid="separator" />,
  FieldLabel: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}))

vi.mock('@/features/movies/components', () => ({
  MovieUpsertDialog: ({ mode }: { mode: 'create' | 'edit' }) => (
    <button type="button">{mode === 'create' ? 'Add Movie' : 'Edit Movie'}</button>
  ),
  MovieListings: (props: {
    movies: MovieResponse[];
    visibleColumns: string[];
  }) => {
    mockMovieListings(props)

    return (
      <div>
        <div>{`Rendered ${props.movies.length} movies`}</div>
        <div>{`Columns: ${props.visibleColumns.join(', ')}`}</div>
      </div>
    )
  },
}))

vi.mock('@/features/movies/components/filters', () => ({
  DateRangePopover: ({ title }: { title: string }) => <button type="button">{title}</button>,
  MoneyRangePopover: ({ title }: { title: string }) => <button type="button">{title}</button>,
  PaginationPopover: ({
    pageSize,
    onPageSizeChange,
  }: {
    pageSize: string;
    onPageSizeChange: (size: number) => void;
  }) => (
    <button type="button" onClick={() => onPageSizeChange(Number(pageSize))}>
      Page size
    </button>
  ),
}))

function createFilterUiState() {
  return {
    page: 2,
    setPage: vi.fn(),
    pageSize: 20,
    setPageSize: vi.fn(),
    sortBy: 'movie' as const,
    setSortBy: vi.fn(),
    sortDirection: 'asc' as const,
    setSortDirection: vi.fn(),
    searchMode: 'general' as const,
    setSearchMode: vi.fn(),
    genres: ['Drama'],
    setGenres: vi.fn(),
    debouncedGenres: ['Drama'],
    searchInput: 'alien',
    setSearchInput: vi.fn(),
    debouncedSearch: 'alien',
    isSearchPending: false,
    searchStatus: 'idle',
    releaseDate: {
      value: { from: '2024-01-01', to: '2024-12-31' },
      setValue: vi.fn(),
      debouncedValue: { from: '2024-01-01', to: '2024-12-31' },
      isPending: false,
      status: 'idle',
      executionCount: 0,
    },
    worldwideGross: {
      value: { min: 100, max: 200 },
      setValue: vi.fn(),
      debouncedValue: { min: 100, max: 200 },
      isPending: false,
      status: 'idle',
      executionCount: 0,
    },
    productionBudget: {
      value: { min: 50, max: 150 },
      setValue: vi.fn(),
      debouncedValue: { min: 50, max: 150 },
      isPending: false,
      status: 'idle',
      executionCount: 0,
    },
    domesticGross: {
      value: { min: 25, max: 75 },
      setValue: vi.fn(),
      debouncedValue: { min: 25, max: 75 },
      isPending: false,
      status: 'idle',
      executionCount: 0,
    },
  }
}

describe('MoviesPage', () => {
  beforeEach(() => {
    mockDispatch.mockReset()
    mockUseSelector.mockReset()
    mockUseGenres.mockReset()
    mockUseMovies.mockReset()
    mockUseMovieFilterState.mockReset()
    mockMovieListings.mockReset()

    mockUseSelector.mockImplementation((selector) =>
      selector({
        apiMode: { mode: 'rest' },
        graphqlColumns: { selectedFields: movieGraphQlFields },
      })
    )

    mockUseGenres.mockReturnValue({
      data: [{ name: 'Drama' }, { name: 'Sci-Fi' }],
    })

    mockUseMovieFilterState.mockReturnValue(createFilterUiState())

    mockUseMovies.mockReturnValue({
      data: {
        items: [
          {
            id: '1',
            movieName: 'Arrival',
            genres: ['Sci-Fi'],
          },
        ],
        page: 2,
        pageSize: 20,
        totalPages: 4,
        totalCount: 61,
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      isPlaceholderData: false,
      dataUpdatedAt: 0,
    })
  })

  it('renders the loading state', () => {
    mockUseMovies.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isFetching: false,
      isPlaceholderData: false,
      dataUpdatedAt: 0,
    })

    render(<MoviesPage />)

    expect(screen.getByText('Loading movies…')).toBeInTheDocument()
  })

  it('renders the error state', () => {
    mockUseMovies.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Boom'),
      isFetching: false,
      isPlaceholderData: false,
      dataUpdatedAt: 0,
    })

    render(<MoviesPage />)

    expect(screen.getByText('Error: Boom')).toBeInTheDocument()
  })

  it('renders the results summary and resets all filters', async () => {
    const user = userEvent.setup()
    const filterUi = createFilterUiState()
    mockUseMovieFilterState.mockReturnValue(filterUi)

    render(<MoviesPage />)

    expect(screen.getByText('Movie Listings')).toBeInTheDocument()
    expect(screen.getByText('Rendered 1 movies')).toBeInTheDocument()
    expect(screen.getByText('Showing 21 to 40 of 61 items')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset Filters' }))

    expect(filterUi.setPage).toHaveBeenCalledWith(1)
    expect(filterUi.setPageSize).toHaveBeenCalledWith(10)
    expect(filterUi.setSortBy).toHaveBeenCalledWith('movie')
    expect(filterUi.setSortDirection).toHaveBeenCalledWith('asc')
    expect(filterUi.setSearchMode).toHaveBeenCalledWith('general')
    expect(filterUi.setGenres).toHaveBeenCalledWith([])
    expect(filterUi.setSearchInput).toHaveBeenCalledWith('')
    expect(filterUi.releaseDate.setValue).toHaveBeenCalledWith({})
    expect(filterUi.worldwideGross.setValue).toHaveBeenCalledWith({})
    expect(filterUi.productionBudget.setValue).toHaveBeenCalledWith({})
    expect(filterUi.domesticGross.setValue).toHaveBeenCalledWith({})
  })

  it('switches to GraphQL mode and resets GraphQL columns', async () => {
    const user = userEvent.setup()

    render(<MoviesPage />)

    await user.click(screen.getByRole('button', { name: 'Toggle API mode' }))

    expect(mockDispatch).toHaveBeenCalledTimes(2)
  })
})
