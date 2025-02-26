import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useGetMyBookingsQuery } from "../../features/bookings/bookingsApiSlice";

const MyBookings = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  // Редирект если пользователь не авторизован
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyBookingsQuery();

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

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Функция для форматирования цены
  const formatPrice = (amount, currency) => {
    if (currency === "USD") {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD' }).format(amount);
    }
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка бронирований...</div>;
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"
        role="alert">
        <p>
          Ошибка: {error?.data?.message || "Не удалось загрузить бронирования"}
        </p>
        <button
          onClick={() => refetch()}
          className="text-red-700 underline mt-2 hover:no-underline">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>

      {bookings?.data?.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">У вас пока нет бронирований</p>
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition">
            Просмотреть доступные туры
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings?.data?.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-blue-600">
                    {booking.tour.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      booking.status
                    )}`}>
                    {getStatusName(booking.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Информация о туре</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Дата начала:</span>{" "}
                        {formatDate(booking.tour.startDate)}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Стоимость за человека:</span>{" "}
                        {formatPrice(booking.tour.price.amount, booking.tour.price.currency)}
                        {booking.tour.price.perPerson ? " за человека" : ""}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Количество пассажиров:</span>{" "}
                        {booking.passengers}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Ваше бронирование</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Имя:</span>{" "}
                        {booking.customer.name}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Email:</span>{" "}
                        {booking.customer.email}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Телефон:</span>{" "}
                        {booking.customer.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Направления</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {booking.tour.destinations.map((destination, index) => (
                        <div key={destination._id || index} className="mb-2 last:mb-0">
                          <p className="text-gray-700">
                            <span className="font-semibold">{destination.city}:</span>{" "}
                            {destination.nights} {destination.nights === 1 ? "ночь" : 
                              destination.nights > 1 && destination.nights < 5 ? "ночи" : "ночей"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Отели</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {booking.tour.hotels.map((hotel, index) => (
                        <div key={hotel._id || index} className="mb-2 last:mb-0">
                          <p className="text-gray-700">
                            <span className="font-semibold">{hotel.name}</span>{" "}
                            {"★".repeat(hotel.stars)}
                          </p>
                          <p className="text-gray-600 text-sm">{hotel.city}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-3 rounded-lg">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Дата бронирования:</span>{" "}
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                  <div className="text-lg font-bold text-blue-700">
                    Итого: {formatPrice(booking.totalPrice, booking.tour.price.currency)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
