import { configureStore } from '@reduxjs/toolkit'
import  darkReducer  from '../features/dark/darkSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'
import  storeUserIDReducer  from '../features/storeUserID/storeUserIDSlice'
import  storePatientIDReducer  from '../features/storePatientID/storePatientIDSlice'

// Create store
export default configureStore({
    reducer: {
        dark:darkReducer,
        storeid:storeUserIDReducer,
        patientID:storePatientIDReducer,
      
        [userAuthApi.reducerPath]: userAuthApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(userAuthApi.middleware),
})
// setupListeners(store.dispatch)