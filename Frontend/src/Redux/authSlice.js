import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        token:null,
    },
    reducers:{
        // actions
        setUser:(state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
        }
    }
});
export const { setUser, clearAuth} = authSlice.actions;
export default authSlice.reducer;