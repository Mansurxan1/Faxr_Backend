import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectCurrentUser, setCredentials } from '../features/auth/authSlice';
import { useGetProfileQuery } from '../features/auth/authApiSlice';

/**
 * Хук автоматического входа по jwt-токену из cookies или localStorage
 */
const useAutoLogin = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);
  
  // Проверяем наличие токена в localStorage, если его нет в состоянии Redux
  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        // Если нашли токен в localStorage, сохраняем его в Redux
        dispatch(setCredentials({ token: storedToken }));
      }
    }
  }, [token, dispatch]);
  
  // Получаем данные пользователя, если у нас есть токен, но нет данных пользователя
  const { data: profileData } = useGetProfileQuery(undefined, {
    // Пропускаем запрос, если у нас уже есть данные пользователя или нет токена
    skip: !token || !!user,
  });
  
  useEffect(() => {
    // Если получили данные профиля, обновляем состояние Redux
    if (token && profileData?.user && !user) {
      dispatch(setCredentials({
        user: profileData.user,
        token
      }));
    }
  }, [token, profileData, user, dispatch]);
  
  return { isLoggedIn: !!user };
};

export default useAutoLogin; 