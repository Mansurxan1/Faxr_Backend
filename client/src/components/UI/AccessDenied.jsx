import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Компонент для отображения ошибки доступа
 */
const AccessDenied = () => {
  return (
    <div className="max-w-lg mx-auto mt-10 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          <p>У вас нет прав для просмотра запрашиваемой страницы.</p>
        </div>
        <p className="text-gray-600 mb-6">
          Эта страница доступна только администраторам. Если вы считаете, что это ошибка, 
          пожалуйста, обратитесь к администратору сайта.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition"
          >
            На главную
          </Link>
          <Link 
            to="/login" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md transition"
          >
            Войти с другим аккаунтом
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 