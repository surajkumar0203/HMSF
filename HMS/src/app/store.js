import { configureStore } from '@reduxjs/toolkit'
import  darkReducer  from '../features/dark/darkSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'

export default configureStore({
    reducer: {
        dark:darkReducer,
        [userAuthApi.reducerPath]: userAuthApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(userAuthApi.middleware),
})

// setupListeners(store.dispatch)