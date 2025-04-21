import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClass, fetchClasses } from './classAPI';

const initialState = {
  classes: [],
  loading: false,
  error: null,
};

export const createNewClass = createAsyncThunk('classes/create', createClass);
export const getAllClasses = createAsyncThunk('classes/fetch', fetchClasses);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNewClass.fulfilled, (state, action) => {
        state.classes.push(action.payload);
      });
  },
});

export default classSlice.reducer;
