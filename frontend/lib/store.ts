import { configureStore } from '@reduxjs/toolkit'
import { messageApi } from '../services/message'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [messageApi.reducerPath]: messageApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(messageApi.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>