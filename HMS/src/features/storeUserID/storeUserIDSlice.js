import { createSlice } from '@reduxjs/toolkit'


export const storeUserIDSlice = createSlice({
    name:'userid',
    initialState:{
     
        id:localStorage.getItem('MedicareUserID')??null
    },
    reducers:{
      
        setUserID:(state,actions) =>{
            state.id=actions.payload
        },
        clearUserID:(state)=>{state.id=null;localStorage.removeItem('MedicareUserID');}
    }
});

export const {setUserID,clearUserID} = storeUserIDSlice.actions;
export default storeUserIDSlice.reducer