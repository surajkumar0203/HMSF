import { createSlice } from '@reduxjs/toolkit'

export const storecurrentUserSlice = createSlice({
    name:'currentUser',
    initialState:{
     
        currentUser:localStorage.getItem('MediCareCurrentUser')??null
    },
    reducers:{
      
        setCurrentUser:(state,actions) =>{

            state.currentUser=actions.payload
        },
        
    }
});

export const {setCurrentUser} = storecurrentUserSlice.actions;
export default storecurrentUserSlice.reducer