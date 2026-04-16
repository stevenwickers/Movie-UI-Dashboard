import type { MovieFilters } from '@/features/movies/types/movie-types.ts'

type DebouncedFilterPatchInput = Pick<MovieFilters, 'searchMode' | 'genres' | 'search' | 'releaseDateFrom' | 'releaseDateTo' | 'worldwideGrossMin' | 'worldwideGrossMax' | 'productionBudgetMin' | 'productionBudgetMax' | 'domesticGrossMin' | 'domesticGrossMax'>

export function buildDebouncedFilterPatch(input: DebouncedFilterPatchInput): Partial<MovieFilters> {
  return {
    searchMode: input.searchMode,
    genres: input.genres,
    search: input.search,
    releaseDateFrom: input.releaseDateFrom,
    releaseDateTo: input.releaseDateTo,
    worldwideGrossMin: input.worldwideGrossMin,
    worldwideGrossMax: input.worldwideGrossMax,
    productionBudgetMin: input.productionBudgetMin,
    productionBudgetMax: input.productionBudgetMax,
    domesticGrossMin: input.domesticGrossMin,
    domesticGrossMax: input.domesticGrossMax,
  }
}
