import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../features/auth/authSlice';

/**
 * Компонент для условного отображения UI элементов только для администраторов
 * @param {Object} props
 * @param {React.ReactNode} props.children - Контент, который будет показан только админам
 * @param {React.ReactNode} props.fallback - Опциональный контент для обычных пользователей
 */
const AdminOnly = ({ children, fallback = null }) => {
  const isAdmin = useSelector(selectIsAdmin);
  
  // Если пользователь админ, показываем содержимое, иначе показываем fallback
  return isAdmin ? children : fallback;
};

export default AdminOnly; 