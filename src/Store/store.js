import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice';
// import classSlice from './classSlice';

const store = configureStore( {
    reducer: {
        auth: authSlice,
        // classes: classSlice,
   
    }
})

export default store