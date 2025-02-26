import { apiSlice } from '../../app/api/apiSlice';
import { getJwtFromCookie } from '../../utils/cookieUtils';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Регистрация нового пользователя
    register: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: credentials,
      }),
      // После успешной регистрации, сохраняем токен в localStorage, если он есть в ответе
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        return response;
      }
    }),

    // Вход пользователя
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // После успешного входа, сохраняем токен в localStorage, если он есть в ответе
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        return response;
      }
    }),

    // Выход пользователя
    logout: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      // После выхода удаляем токен из localStorage
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          localStorage.removeItem('authToken');
        } catch (err) {
          console.error('Ошибка при выходе:', err);
        }
      }
    }),

    // Получение профиля пользователя
    getProfile: builder.query({
      query: () => '/api/auth/profile',
      providesTags: ['User'],
    }),

    // Обновление пароля пользователя
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/api/auth/update-password',
        method: 'PUT',
        body: passwordData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdatePasswordMutation,
} = authApiSlice; 