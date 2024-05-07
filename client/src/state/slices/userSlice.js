// src/state/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    updateUserDetails(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, updateUserDetails } = userSlice.actions;
export default userSlice.reducer;