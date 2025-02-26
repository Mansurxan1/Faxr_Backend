import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin, selectCurrentUser } from '../../features/auth/authSlice';

/**
 * Компонент для защиты админ-маршрутов
 * Если пользователь не админ, перенаправляет на главную страницу
 */
const AdminRoute = () => {
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectCurrentUser);
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Если пользователь не админ, перенаправляем на главную страницу
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Если пользователь админ, рендерим дочерние маршруты
  return <Outlet />;
};

export default AdminRoute; 