// import { createSlice } from "@reduxjs/toolkit";

// const intialState = {
//     classes: [],
// };

// const classSlice = createSlice({
//     name: "classes",
//     intialState,
//     reducers: {
//         addClass: (state, action) => {
//             state.classes.push(action.payload);
//         },
//         setClasses: (state, action) => {
//             state.classes = action.payload;
//         },
//         deleteClass: (state, action) => {
//             state.classes = state.classes.filter((cls)=> cls._id !== action.payload
//         )
//         },
//         updateClass: (state, action) => {
//             const updateClass = action.payload;
//             const index = state.classes.findIndex((cls) => cls._id === updateClass._id
//         )
//         if(index !== -1){
//             state.classes[index] = updateClass;
//         }
//         }
//     }
// })

// export const {
//     addClass,
//     setClasses,
//     deleteClass,
//     updateClass
// } = classSlice.actions;

// export default classSlice.reducer;