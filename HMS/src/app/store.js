import { configureStore } from '@reduxjs/toolkit'
import  darkReducer  from '../features/dark/darkSlice'
import { userAuthApi } from '../services/userAuthApi'
import  storeUserIDReducer  from '../features/storeUserID/storeUserIDSlice'
import  storePatientIDReducer  from '../features/storePatientID/storePatientIDSlice'
import  storecurrentUserReducer  from '../features/storeCurrentUser/storeCurrentUserSlice'
// Create store
export default configureStore({
    reducer: {
        dark:darkReducer,
        storeid:storeUserIDReducer,
        patientID:storePatientIDReducer,
        currentUser:storecurrentUserReducer,
        [userAuthApi.reducerPath]: userAuthApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(userAuthApi.middleware),
})
