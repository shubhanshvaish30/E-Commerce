import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        admin:null,
        token:null
    },
    reducers:{
        // actions
        setAdmin:(state, action) => {
            state.admin = action.payload.admin;
            state.token = action.payload.token;
        },
        clearAuth: (state) => {
            state.admin = null;
            state.token = null;
        },
    }
});
export const { setAdmin, clearAuth} = authSlice.actions;
export default authSlice.reducer;