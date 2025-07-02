import { createSlice } from '@reduxjs/toolkit'

export const storePatientIDSlice = createSlice({
    name:'patientid',
    initialState:{
     
        id:null
    },
    reducers:{
      
        setPatientrID:(state,actions) =>{
            state.id=actions.payload
        },
        
    }
});

export const {setPatientrID} = storePatientIDSlice.actions;
export default storePatientIDSlice.reducer