import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    success: false,
    userData: null
}

const authSlice = createSlice( {
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.success = true;
            state.userData = action.payload;
        },

        logout: (state) => {
            state.success = false;
            state.userData = null;
        }


    }
})

export const {
    login,
    logout
} = authSlice.actions;

export default authSlice.reducer