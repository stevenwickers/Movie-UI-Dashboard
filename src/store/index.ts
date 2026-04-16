import { configureStore } from '@reduxjs/toolkit'
import apiModeReducer from '@/features/apiMode/apiModeSlice.ts'
import graphqlColumnsReducer from '@/features/graphql/graphqlColumnsSlice.ts'

export const store = configureStore({
  reducer: {
    apiMode: apiModeReducer,
    graphqlColumns: graphqlColumnsReducer,
  }
})
