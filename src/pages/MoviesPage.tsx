import { useEffect, useMemo, useCallback } from 'react'
import {
  Film,
  Calendars,
  RotateCcw,
  ChartNoAxesCombined,
  ChartNoAxesColumnIncreasing,
  Banknote
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ApiDiagnosticsDrawer,
  CheckboxPopover,
  PaginationControl,
  SearchInput,
  SelectionDropdown,
} from '@/components'
import { Switch, Separator, FieldLabel } from '@/components/ui'
import { setApiMode } from '@/features/apiMode/apiModeSlice.ts'
import { setSelectedGraphQlFields } from '@/features/graphql/graphqlColumnsSlice.ts'
import { useGenres } from '@/features/genres/hooks/useGenres.ts'
import { MovieListings, MovieUpsertDialog } from '@/features/movies/components'
import {
  DateRangePopover,
  MoneyRangePopover,
  PaginationPopover,
} from '@/features/movies/components/filters'
import {
  useMovieFilterState,
  useMovies,
} from '@/features/movies/hooks'
import {
  allMovieColumns,
  movieGraphQlFields,
  type ColumnKey,
  type GraphQlFieldKey,
  type MovieResponse,
  type SortableColumnKey,
} from '@/features/movies/types/movie-types.ts'
import type {
  MovieDateRange,
  NumberRange,
} from '@/features/movies/types/filters-types.ts'
import { SearchTypes, type SearchMode } from '@/features/movies/types/search-types.ts'
import { buildDebouncedFilterPatch } from '@/features/movies/utils/buildDebouncedFilterPatch.ts'
import {
  selectCurrentApiMode,
  selectSelectedGraphQlFields,
} from '@/store/selectors.ts'
import { emptyPagedResponse } from '@/types/paged-types.ts'

export function MoviesPage() {
  const dispatch = useDispatch()
  const filterUi = useMovieFilterState()
  const apiModeValue = useSelector(selectCurrentApiMode)
  const selectedGraphQlFields = useSelector(selectSelectedGraphQlFields)
  const { data: genreData } = useGenres()
  const genreNames = genreData?.map((genre) => genre.name) ?? []
  const {
    page,
    pageSize,
    sortBy,
    releaseDate,
    worldwideGross,
    domesticGross,
    productionBudget,
    setPage,
    setPageSize,
    setSortBy,
    setSortDirection,
    setSearchMode,
    setGenres,
    setSearchInput,
  } = filterUi

  const visibleColumns = useMemo<ColumnKey[]>(
    () =>
      apiModeValue === 'graphql'
        ? allMovieColumns.filter((columnKey) => {
            if (columnKey === 'movie' || columnKey === 'edit') {
              return true
            }

            return selectedGraphQlFields.includes(columnKey as GraphQlFieldKey)
          })
        : allMovieColumns,
    [apiModeValue, selectedGraphQlFields]
  )

  const queryFilters = useMemo(
    () =>
      buildDebouncedFilterPatch({
        searchMode: filterUi.searchMode,
        genres: filterUi.debouncedGenres,
        search: filterUi.debouncedSearch,
        releaseDateFrom: filterUi.releaseDate.debouncedValue.from,
        releaseDateTo: filterUi.releaseDate.debouncedValue.to,
        worldwideGrossMin: filterUi.worldwideGross.debouncedValue.min,
        worldwideGrossMax: filterUi.worldwideGross.debouncedValue.max,
        productionBudgetMin: filterUi.productionBudget.debouncedValue.min,
        productionBudgetMax: filterUi.productionBudget.debouncedValue.max,
        domesticGrossMin: filterUi.domesticGross.debouncedValue.min,
        domesticGrossMax: filterUi.domesticGross.debouncedValue.max,
      }),
    [
      filterUi.searchMode,
      filterUi.debouncedGenres,
      filterUi.debouncedSearch,
      filterUi.releaseDate.debouncedValue.from,
      filterUi.releaseDate.debouncedValue.to,
      filterUi.worldwideGross.debouncedValue.min,
      filterUi.worldwideGross.debouncedValue.max,
      filterUi.productionBudget.debouncedValue.min,
      filterUi.productionBudget.debouncedValue.max,
      filterUi.domesticGross.debouncedValue.min,
      filterUi.domesticGross.debouncedValue.max,
    ]
  )

  const movieFilters = useMemo(
    () => ({
      ...queryFilters,
      page: filterUi.page,
      pageSize: filterUi.pageSize,
      sortBy: filterUi.sortBy,
      sortDirection: filterUi.sortDirection,
    }),
    [
      queryFilters,
      filterUi.page,
      filterUi.pageSize,
      filterUi.sortBy,
      filterUi.sortDirection,
    ]
  )

  const {
    data = emptyPagedResponse<MovieResponse>(),
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    dataUpdatedAt,
  } = useMovies(movieFilters, selectedGraphQlFields, apiModeValue)

  const resetPagination = useCallback(() => {
    setPage(1)
  }, [setPage])

  const handleColumnSort = (column: SortableColumnKey) => {
    const isSameColumn = column === filterUi.sortBy
    const nextSortDirection =
      isSameColumn && filterUi.sortDirection === 'asc' ? 'desc' : 'asc'

    setSortBy(column)
    setSortDirection(nextSortDirection)
    resetPagination()
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value)

    if(value.trim() === '') {
      setSearchMode('general')
    }

    resetPagination()
  }

  const handleSearchModeChange = (nextMode: SearchMode) => {
    setSearchMode(nextMode)
    resetPagination()
  }

  const handleGenresChange = (nextGenres: string[]) => {
    setGenres(nextGenres)
    resetPagination()
  }

  const handleDateRangeChange = (nextRange: MovieDateRange) => {
    releaseDate.setValue(nextRange)
    resetPagination()
  }

  const handleWorldwideGrossChange = (nextRange: NumberRange) => {
    worldwideGross.setValue(nextRange)
    resetPagination()
  }

  const handleProductionBudgetChange = (nextRange: NumberRange) => {
    productionBudget.setValue(nextRange)
    resetPagination()
  }

  const handleDomesticGrossChange = (nextRange: NumberRange) => {
    domesticGross.setValue(nextRange)
    resetPagination()
  }

  const handleApiModeChange = (checked: boolean) => {
    handleResetFilters()
    dispatch(setSelectedGraphQlFields(movieGraphQlFields))
    dispatch(setApiMode(checked ? 'graphql' : 'rest'))
  }

  useEffect(() => {
    if (
      apiModeValue === 'graphql' &&
      sortBy !== 'movie' &&
      !selectedGraphQlFields.includes(sortBy as GraphQlFieldKey)
    ) {
      setSortBy('movie')
      setSortDirection('asc')
      setPage(1)
    }
  }, [
    apiModeValue,
    selectedGraphQlFields,
    sortBy,
    setSortBy,
    setSortDirection,
    setPage,
  ])

  const handleResetFilters = () => {
    setPage(1)
    setPageSize(10)
    setSortBy('movie')
    setSortDirection('asc')
    setSearchMode('general')
    setGenres([])
    setSearchInput('')
    releaseDate.setValue({})
    worldwideGross.setValue({})
    productionBudget.setValue({})
    domesticGross.setValue({})
  }

  const totalCount = data?.totalCount ?? 0
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalCount)

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Loading movies…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-destructive">
          Error: {(error as Error).message}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Movie Listings
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Browse, search, and filter movie listings.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          <ApiDiagnosticsDrawer
            isFetching={isFetching}
            hasData={(data.items?.length ?? 0) > 0}
            isPlaceholderData={isPlaceholderData}
            dataUpdatedAt={dataUpdatedAt}
          />
          <MovieUpsertDialog mode="create" />
        </div>
      </div>

      <div
        id="movie-listings-container"
        className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-clip pb-4 text-foreground"
      >
        <div className="mb-4 flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip rounded-2xl border border-border bg-card p-3 text-card-foreground shadow-sm sm:p-4 lg:p-5">
          <div className="pb-3">
            <div className="flex flex-col gap-3 lg:gap-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,220px)_auto] lg:items-center">
                <div className="relative w-full">
                  <SearchInput
                    value={filterUi.searchInput}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="flex w-full min-w-0 flex-col">
                  <SelectionDropdown
                    placeholder="Search Types"
                    value={filterUi.searchMode}
                    options={SearchTypes}
                    onChange={handleSearchModeChange}
                  />
                </div>

                <div className="flex w-full lg:w-auto lg:justify-end">
                  <PaginationPopover
                    pageSize={String(filterUi.pageSize)}
                    onPageSizeChange={(size) => {
                      filterUi.setPageSize(size)
                      filterUi.setPage(1)
                    }}
                  />
                </div>
              </div>

              <Separator className="my-1" />

              <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/20 px-3 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:flex-1">
                  <div className="shrink-0 sm:self-center">
                    <FieldLabel className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Filters
                    </FieldLabel>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <DateRangePopover
                      Icon={Calendars}
                      title="Date Range"
                      description="Filter movies by release date."
                      dateFrom={filterUi.releaseDate.value.from}
                      dateTo={filterUi.releaseDate.value.to}
                      onDateRangeChange={handleDateRangeChange}
                      disabled={apiModeValue !== 'rest' && !selectedGraphQlFields.includes('releaseDate')}
                    />

                    <MoneyRangePopover
                      Icon={ChartNoAxesCombined}
                      title="Worldwide Gross"
                      description="Show movies with worldwide gross in this range (USD)."
                      minValue={filterUi.worldwideGross.value.min}
                      maxValue={filterUi.worldwideGross.value.max}
                      onRangeChange={handleWorldwideGrossChange}
                      disabled={apiModeValue !== 'rest' && !selectedGraphQlFields.includes('worldwideGross')}
                    />

                    <MoneyRangePopover
                      Icon={ChartNoAxesColumnIncreasing}
                      title="Production Budget"
                      description="Show movies with production budget in this range (USD)."
                      minValue={filterUi.productionBudget.value.min}
                      maxValue={filterUi.productionBudget.value.max}
                      onRangeChange={handleProductionBudgetChange}
                      disabled={apiModeValue !== 'rest' && !selectedGraphQlFields.includes('productionBudget')}
                    />

                    <MoneyRangePopover
                      Icon={Banknote}
                      title="Domestic Gross"
                      description="Show movies with domestic gross in this range (USD)."
                      minValue={filterUi.domesticGross.value.min}
                      maxValue={filterUi.domesticGross.value.max}
                      onRangeChange={handleDomesticGrossChange}
                      disabled={apiModeValue !== 'rest' && !selectedGraphQlFields.includes('domesticGross')}
                    />

                    <CheckboxPopover
                      Icon={Film}
                      title="Genres"
                      description="Filter movies by genre."
                      options={genreNames}
                      selected={filterUi.genres}
                      onSelectedChange={handleGenresChange}
                      restClearAll={true}
                      disabled={apiModeValue !== 'rest' && !selectedGraphQlFields.includes('genres')}
                    />

                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Filters
                    </button>
                  </div>
                </div>

                <div className="hidden lg:block lg:h-10">
                  <Separator orientation="vertical" className="h-full" />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:shrink-0 lg:justify-end">
                  <div className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm shadow-sm">
                    <span
                      className={apiModeValue === 'rest' ? 'font-semibold text-foreground' : 'text-muted-foreground'}
                    >
                      REST
                    </span>
                    <Switch
                      checked={apiModeValue === 'graphql'}
                      onCheckedChange={handleApiModeChange}
                    />
                    <span
                      className={apiModeValue === 'graphql' ? 'font-semibold text-foreground' : 'text-muted-foreground'}
                    >
                      GraphQL
                    </span>
                  </div>

                  <CheckboxPopover
                    title="GraphQL Columns"
                    description="Select the columns to request from GraphQL."
                    disabled={apiModeValue === 'rest'}
                    options={movieGraphQlFields}
                    selected={selectedGraphQlFields}
                    onSelectedChange={(fields) =>
                      dispatch(setSelectedGraphQlFields(fields as GraphQlFieldKey[]))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0">
            <MovieListings
              movies={data.items ?? []}
              visibleColumns={visibleColumns}
              sortColumn={filterUi.sortBy}
              sortDirection={filterUi.sortDirection}
              onColumnSort={handleColumnSort}
            />
          </div>

          <div className="pt-4">
            <div className="w-full">
              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,240px)_1fr_minmax(0,240px)] lg:items-center">
                <div className="w-full text-center lg:text-left">
                  <div className="text-sm text-muted-foreground">
                    Showing {startItem} to {endItem} of {totalCount} items
                  </div>
                </div>

                <div className="flex justify-center">
                  <PaginationControl
                    page={filterUi.page}
                    totalPages={data?.totalPages ?? 1}
                    onPageChange={filterUi.setPage}
                  />
                </div>
                <div className="hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
