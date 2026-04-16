import { useState } from 'react'
import { useDebouncedFilterValue } from '@/features/movies/hooks/useDebouncedFilterValue.ts'
import type { MovieDateRange, NumberRange } from '@/features/movies/types/filters-types.ts'
import type { SearchMode } from '@/features/movies/types/search-types.ts'
import type {
  MovieFilters,
  SortDirection,
  SortableColumnKey,
} from '@/features/movies/types/movie-types.ts'

export type DebouncedRangeState<T> = {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  debouncedValue: T;
  isPending: boolean;
  status: string;
  executionCount: number;
};

export type MovieFilterUiState = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  sortBy: SortableColumnKey;
  setSortBy: React.Dispatch<React.SetStateAction<SortableColumnKey>>;
  sortDirection: SortDirection;
  setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
  searchMode: NonNullable<MovieFilters['searchMode']>;
  setSearchMode: React.Dispatch<React.SetStateAction<NonNullable<MovieFilters['searchMode']>>>;
  genres: string[];
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  debouncedGenres: string[];
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearch: string | undefined;
  isSearchPending: boolean;
  searchStatus: string;
  releaseDate: DebouncedRangeState<MovieDateRange>;
  worldwideGross: DebouncedRangeState<NumberRange>;
  productionBudget: DebouncedRangeState<NumberRange>;
  domesticGross: DebouncedRangeState<NumberRange>;
};

export function useMovieFilterState(): MovieFilterUiState {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<SortableColumnKey>('movie')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [searchMode, setSearchMode] = useState<SearchMode>('general')
  const [genres, setGenres] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState('')

  const debouncedGenres = useDebouncedFilterValue<string[]>(genres, 200)
  const debouncedSearch = useDebouncedFilterValue(searchInput, 500)

  const [releaseDateValue, setReleaseDateValue] = useState<MovieDateRange>({})
  const [worldwideGrossValue, setWorldwideGrossValue] = useState<NumberRange>({})
  const [productionBudgetValue, setProductionBudgetValue] = useState<NumberRange>({})
  const [domesticGrossValue, setDomesticGrossValue] = useState<NumberRange>({})

  const releaseDate = useDebouncedFilterValue<MovieDateRange>(releaseDateValue, 1000)
  const worldwideGross = useDebouncedFilterValue<NumberRange>(worldwideGrossValue, 1000)
  const productionBudget = useDebouncedFilterValue<NumberRange>(productionBudgetValue, 1000)
  const domesticGross = useDebouncedFilterValue<NumberRange>(domesticGrossValue, 1000)

  return {
    page,
    setPage,
    pageSize,
    setPageSize,

    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,

    searchMode,
    setSearchMode,

    genres,
    setGenres,
    debouncedGenres: debouncedGenres.debouncedValue ?? [],

    searchInput,
    setSearchInput,
    debouncedSearch: debouncedSearch.debouncedValue?.trim() || undefined,
    isSearchPending: debouncedSearch.isPending,
    searchStatus: debouncedSearch.status,

    releaseDate: {
      value: releaseDateValue,
      setValue: setReleaseDateValue,
      debouncedValue: releaseDate.debouncedValue,
      isPending: releaseDate.isPending,
      status: releaseDate.status,
      executionCount: releaseDate.executionCount,
    },

    worldwideGross: {
      value: worldwideGrossValue,
      setValue: setWorldwideGrossValue,
      debouncedValue: worldwideGross.debouncedValue,
      isPending: worldwideGross.isPending,
      status: worldwideGross.status,
      executionCount: worldwideGross.executionCount,
    },

    productionBudget: {
      value: productionBudgetValue,
      setValue: setProductionBudgetValue,
      debouncedValue: productionBudget.debouncedValue,
      isPending: productionBudget.isPending,
      status: productionBudget.status,
      executionCount: productionBudget.executionCount,
    },

    domesticGross: {
      value: domesticGrossValue,
      setValue: setDomesticGrossValue,
      debouncedValue: domesticGross.debouncedValue,
      isPending: domesticGross.isPending,
      status: domesticGross.status,
      executionCount: domesticGross.executionCount,
    },
  }
}
