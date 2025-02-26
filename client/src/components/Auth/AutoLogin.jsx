import React, { useEffect } from 'react';
import useAutoLogin from '../../hooks/useAutoLogin';
import { useSelector } from 'react-redux';
import { selectToken } from '../../features/auth/authSlice';

/**
 * Компонент для автоматического входа пользователя при наличии JWT токена в cookie или localStorage
 * Не отображает ничего в DOM, просто запускает логику автологина
 */
const AutoLogin = () => {
  const { isLoggedIn } = useAutoLogin();
  const token = useSelector(selectToken);
  
  useEffect(() => {
    if (isLoggedIn) {
      console.log('Пользователь автоматически авторизован');
    } else if (token) {
      console.log('Токен найден, но профиль пользователя еще не загружен');
    } else {
      console.log('Токен не найден в Redux/localStorage/cookie');
    }
  }, [isLoggedIn, token]);
  
  return null; // Компонент ничего не рендерит
};

export default AutoLogin; 