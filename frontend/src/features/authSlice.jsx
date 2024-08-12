import { createSlice } from "@reduxjs/toolkit";

initialState = {
    access_token: null
}

export const authSlice = createSlice({
    name: 'auth_token',
    initialState,
    reducers: {
        setAuthToken: (state,action) =>{
            state.access_token = action.payload.access_token
        }
    }

})

export const {setAuthToken}  = authSlice.actions;

export default authSlice.reducer;