import { createSlice } from '@reduxjs/toolkit'
import { getTheme } from '../../services/LocalStorage';

export const darkSlice = createSlice({
    name:'darkmode',
    initialState:{
        isDark:getTheme('theme')==='dark'
    },
    reducers:{
        darkModeButton:state =>{state.isDark = !state.isDark;}
    }
});

export const {darkModeButton} = darkSlice.actions;
export default darkSlice.reducer