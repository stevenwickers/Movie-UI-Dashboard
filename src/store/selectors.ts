import { createSelector } from '@reduxjs/toolkit'
import { movieGraphQlFields } from '@/features/movies/types/movie-types.ts'

const selectApiModeState = (state: any) => state.apiMode
const selectGraphQlColumnsState = (state: any) => state.graphqlColumns

// 2. Exported Selectors (For Components)
export const selectCurrentApiMode = createSelector(
  [selectApiModeState],
  (apiMode) => apiMode.mode
)

export const selectSelectedGraphQlFields = createSelector(
  [selectGraphQlColumnsState],
  (graphqlColumns) => graphqlColumns?.selectedFields ?? movieGraphQlFields
)
