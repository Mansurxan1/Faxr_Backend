import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../features/auth/authSlice';
import { 
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation
} from '../../features/bookings/bookingsApiSlice';

const BookingList = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notification, setNotification] = useState(null);
  
  // Редирект если пользователь не админ
  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  const { data: bookingsData, isLoading, isError, error, refetch } = useGetAllBookingsQuery();
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  
  // Получаем массив бронирований из данных
  const bookings = bookingsData?.data || [];

  // Функция для получения класса статуса
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Функция для получения названия статуса
  const getStatusName = (status) => {
    switch (status) {
      case "pending":
        return "Ожидает подтверждения";
      case "confirmed":
        return "Подтверждено";
      case "completed":
        return "Завершено";
      case "cancelled":
        return "Отменено";
      default:
        return "Неизвестно";
    }
  };
  
  const handleStatusChange = async (id, status) => {
    setSelectedBooking(bookings.find(booking => booking._id === id));
    setNewStatus(status);
    setShowConfirmation(true);
  };
  
  const confirmStatusChange = async () => {
    try {
      await updateBookingStatus({ id: selectedBooking._id, status: newStatus }).unwrap();
      setNotification({
        type: 'success',
        message: `Статус бронирования успешно изменен на "${getStatusName(newStatus)}"`
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Ошибка при обновлении статуса: ${err.data?.message || err.message || 'Неизвестная ошибка'}`
      });
      setTimeout(() => setNotification(null), 5000);
    }
    setShowConfirmation(false);
  };
  
  const cancelStatusChange = () => {
    setShowConfirmation(false);
    setSelectedBooking(null);
    setNewStatus('');
  };
  
  const handleDeleteBooking = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
      try {
        await deleteBooking(id).unwrap();
        setNotification({
          type: 'success',
          message: 'Бронирование успешно удалено'
        });
        setTimeout(() => setNotification(null), 5000);
      } catch (err) {
        setNotification({
          type: 'error',
          message: `Ошибка при удалении бронирования: ${err.data?.message || err.message || 'Неизвестная ошибка'}`
        });
        setTimeout(() => setNotification(null), 5000);
      }
    }
  };
  
  const filteredBookings = bookings 
    ? statusFilter === 'all' 
      ? bookings 
      : bookings.filter(booking => booking.status === statusFilter)
    : [];
  
  if (isLoading) {
    return <div className="text-center py-8">Загрузка бронирований...</div>;
  }
  
  if (isError) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
        <p>Ошибка: {error?.data?.message || 'Не удалось загрузить бронирования'}</p>
        <button 
          onClick={() => refetch()}
          className="text-red-700 underline mt-2 hover:no-underline"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Управление бронированиями</h1>
      
      {notification && (
        <div 
          className={`p-4 mb-4 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          role="alert"
        >
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-semibold">Фильтр по статусу:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Все</option>
          <option value="pending">Ожидает подтверждения</option>
          <option value="confirmed">Подтверждено</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
        </select>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-600">Нет бронирований с выбранным статусом</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Тур</th>
                <th className="px-4 py-2 text-left text-gray-600">Пользователь</th>
                <th className="px-4 py-2 text-left text-gray-600">Контакты</th>
                <th className="px-4 py-2 text-left text-gray-600">Дата создания</th>
                <th className="px-4 py-2 text-left text-gray-600">Участники</th>
                <th className="px-4 py-2 text-left text-gray-600">Сумма</th>
                <th className="px-4 py-2 text-left text-gray-600">Статус</th>
                <th className="px-4 py-2 text-left text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {booking.tour ? booking.tour.name : 'Тур не найден'}
                  </td>
                  <td className="px-4 py-3">
                    {booking.customer?.name || 'Нет данных'}
                  </td>
                  <td className="px-4 py-3">
                    <div>{booking.customer?.email || 'Нет email'}</div>
                    <div className="text-sm text-gray-600">{booking.customer?.phone || 'Нет телефона'}</div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {booking.passengers}
                  </td>
                  <td className="px-4 py-3">
                    {booking.totalPrice} ₽
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(booking.status)}`}>
                      {getStatusName(booking.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                          disabled={isUpdating}
                        >
                          Подтвердить
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'completed')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          disabled={isUpdating}
                        >
                          Завершить
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          disabled={isUpdating}
                        >
                          Отменить
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                        disabled={isDeleting}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Модальное окно подтверждения изменения статуса */}
      {showConfirmation && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Подтверждение изменения статуса</h3>
            <p className="mb-4">
              Вы уверены, что хотите изменить статус бронирования 
              <span className="font-semibold"> "{selectedBooking.tour?.name || 'Тур не найден'}" </span> 
              для клиента <span className="font-semibold">{selectedBooking.customer?.name || 'Неизвестный клиент'}</span> с 
              <span className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(selectedBooking.status)}`}>
                {getStatusName(selectedBooking.status)}
              </span> 
              на 
              <span className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(newStatus)}`}>
                {getStatusName(newStatus)}
              </span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelStatusChange}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800"
              >
                Отмена
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
                disabled={isUpdating}
              >
                {isUpdating ? 'Обновление...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList; 