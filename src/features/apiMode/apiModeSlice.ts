import { createSlice } from '@reduxjs/toolkit'

export const ApiMode = Object.freeze({
  rest: 'rest',
  graphiql: 'graphiql',
})

export const apiModeSlice = createSlice({
  name: 'apiMode',
  initialState: {
    mode: ApiMode.rest,
  },
  reducers: {
    setApiMode: (state, action) => {
      state.mode = action.payload
    }
  }
})

export const { setApiMode } = apiModeSlice.actions
export default apiModeSlice.reducer