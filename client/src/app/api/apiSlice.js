import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../utils/cookieUtils';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5001/api',
  prepareHeaders: (headers, { getState }) => {
    // Добавление JWT токена из состояния в заголовки запроса
    let token = getState().auth.token;
    
    // Если токена нет в состоянии, проверяем localStorage
    if (!token) {
      token = localStorage.getItem('authToken');
    }
    
    // Если токена нет в localStorage, проверяем cookie
    if (!token) {
      token = getJwtFromCookie();
    }
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include', // Включаем куки в запросы
});

// Базовый API слайс для использования в других слайсах
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Tour', 'Booking', 'User'], // Типы тегов для инвалидации кэша
  endpoints: () => ({}),
}); 