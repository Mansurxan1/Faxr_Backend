import { createSlice } from '@reduxjs/toolkit';
import { getJwtFromCookie } from '../../utils/cookieUtils';

// Проверяем наличие токена в cookie при инициализации
const jwtToken = getJwtFromCookie();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: jwtToken, // Используем токен из cookie, если он есть
    isAdmin: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token || getJwtFromCookie();  // Используем токен из payload или из cookie
      state.isAdmin = user?.isAdmin || false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAdmin = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.isAdmin; 