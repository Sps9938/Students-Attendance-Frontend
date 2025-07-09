import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    success: false,
    user: null
}

const authSlice = createSlice( {
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.success = true;
            state.user = action.payload;
        },

        logout: (state) => {
            state.success = false;
            state.user = null;
        }


    }
})

export const {
    login,
    logout
} = authSlice.actions;

export default authSlice.reducer