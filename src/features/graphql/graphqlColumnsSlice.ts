import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  movieGraphQlFields,
  type GraphQlFieldKey,
} from '@/features/movies/types/movie-types.ts'

type GraphQlColumnsState = {
  selectedFields: GraphQlFieldKey[];
};

const initialState: GraphQlColumnsState = {
  selectedFields: [...movieGraphQlFields],
}

function normalizeFields(fields: GraphQlFieldKey[]) {
  return Array.from(
    new Set(fields.filter((field) => movieGraphQlFields.includes(field)))
  )
}

const graphqlColumnsSlice = createSlice({
  name: 'graphqlColumns',
  initialState,
  reducers: {
    setSelectedGraphQlFields: (
      state,
      action: PayloadAction<GraphQlFieldKey[]>
    ) => {
      state.selectedFields = normalizeFields(action.payload)
    },
  },
})

export const { setSelectedGraphQlFields } = graphqlColumnsSlice.actions
export default graphqlColumnsSlice.reducer
