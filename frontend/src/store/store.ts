import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import todoReducer from './todo/todoSlice'
import { debugObserverMiddleware } from '../utils/debugObserverMiddleware'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: todoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(debugObserverMiddleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch