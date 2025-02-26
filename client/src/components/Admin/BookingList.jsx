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
  
  // Редирект если пользователь не админ
  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  const { data: bookings, isLoading, isError, error, refetch } = useGetAllBookingsQuery();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  
  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus({ id, status }).unwrap();
    } catch (err) {
      console.error('Ошибка при обновлении статуса бронирования:', err);
    }
  };
  
  const handleDeleteBooking = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
      try {
        await deleteBooking(id).unwrap();
      } catch (err) {
        console.error('Ошибка при удалении бронирования:', err);
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
                <th className="px-4 py-2 text-left text-gray-600">Дата</th>
                <th className="px-4 py-2 text-left text-gray-600">Участники</th>
                <th className="px-4 py-2 text-left text-gray-600">Статус</th>
                <th className="px-4 py-2 text-left text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{booking.tour.name}</td>
                  <td className="px-4 py-3">{booking.user.email}</td>
                  <td className="px-4 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{booking.participants}</td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Ожидает подтверждения</option>
                      <option value="confirmed">Подтверждено</option>
                      <option value="completed">Завершено</option>
                      <option value="cancelled">Отменено</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingList; 