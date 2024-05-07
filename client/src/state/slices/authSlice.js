import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.loading = false;
    },
    setLogout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    setLoading: (state, action) => {
      state.loading = action.payload.loading;
    }
  },
});

export const { setLogin, setLogout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;