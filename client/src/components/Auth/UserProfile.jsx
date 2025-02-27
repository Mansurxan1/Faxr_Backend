import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useGetProfileQuery, useUpdatePasswordMutation } from '../../features/auth/authApiSlice';

const UserProfile = () => {
  const user = useSelector(selectCurrentUser);
  const { data: profileData, isLoading, isError, error, refetch } = useGetProfileQuery();
  
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [updatePassword, { isLoading: isUpdating }] = useUpdatePasswordMutation();
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    try {
      await updatePassword({ currentPassword, newPassword }).unwrap();
      setPasswordSuccess('Пароль успешно обновлен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsEditingPassword(false);
    } catch (err) {
      setPasswordError(err.data?.message || 'Ошибка при обновлении пароля');
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-8">Загрузка профиля...</div>;
  }
  
  if (isError) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
        <p>Ошибка: {error?.data?.message || 'Не удалось загрузить профиль'}</p>
        <button 
          onClick={() => refetch()} 
          className="text-red-700 underline mt-2 hover:no-underline"
        >
          Попробовать снова
        </button>
      </div>
    );
  }
  
  const userData = profileData?.user || user;
  
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Профиль пользователя</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Имя</p>
            <p className="font-semibold">{userData?.name || 'Не указано'}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{userData?.email || 'Не указано'}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Телефон</p>
            <p className="font-semibold">{userData?.phone || 'Не указано'}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Роль</p>
            <p className="font-semibold">
              {userData?.isAdmin ? 'Администратор' : 'Пользователь'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Безопасность</h2>
        
        {!isEditingPassword ? (
          <button
            onClick={() => setIsEditingPassword(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            Изменить пароль
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            {passwordError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p>{passwordError}</p>
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                <p>{passwordSuccess}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-gray-700 font-bold mb-2">
                Текущий пароль
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
                minLength={8}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                Подтверждение пароля
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
                minLength={8}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                disabled={isUpdating}
              >
                {isUpdating ? 'Сохранение...' : 'Сохранить'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 