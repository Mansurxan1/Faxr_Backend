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
    data: bookingsData,
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
    try {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    } catch (e) {
      return "Дата не указана";
    }
  };

  // Функция для форматирования цены
  const formatPrice = (amount, currency = "USD") => {
    try {
      if (!amount && amount !== 0) return "Цена не указана";
      
      if (currency === "USD") {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD' }).format(amount);
      }
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
    } catch (e) {
      return `${amount} ${currency}`;
    }
  };

  // Функция для получения первого изображения тура из массива
  const getTourImage = (tour) => {
    if (!tour || !tour.image || !Array.isArray(tour.image) || tour.image.length === 0) {
      return null;
    }
    return tour.image[0];
  };

  // Функция для форматирования продолжительности тура
  const formatDuration = (nights) => {
    if (!nights && nights !== 0) return "Продолжительность не указана";
    
    const lastDigit = nights % 10;
    const lastTwoDigits = nights % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${nights} ночей`;
    } else if (lastDigit === 1) {
      return `${nights} ночь`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `${nights} ночи`;
    } else {
      return `${nights} ночей`;
    }
  };

  // Функция для обработки ошибок загрузки изображений
  const handleImageError = (event) => {
    event.target.src = "https://via.placeholder.com/300x200?text=Изображение+недоступно";
    event.target.alt = "Изображение недоступно";
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

  // Получаем список бронирований из данных
  const bookings = bookingsData?.data || [];

  console.log(bookings);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>

      {bookings.length === 0 ? (
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
          {bookings.map((booking) => (
            <div
              key={booking._id || booking.id}
              className="bg-white rounded-lg shadow-md overflow-hidden">
              
              {/* Заголовок с изображением */}
              <div className="relative">
                {booking.tour && booking.tour.image && booking.tour.image.length > 0 ? (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={booking.tour.image[0]} 
                      alt={booking.tour.name || "Изображение тура"} 
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Изображение недоступно</span>
                  </div>
                )}
                
                <div className="absolute top-0 right-0 m-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getStatusClass(
                      booking.status
                    )}`}>
                    {getStatusName(booking.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">
                    {booking.tour ? booking.tour.name : "Информация о туре недоступна"}
                  </h3>
                  
                  {booking.tour && booking.tour.description && (
                    <p className="text-gray-600 text-sm mb-2">
                      {booking.tour.description.length > 200 
                        ? booking.tour.description.substring(0, 200) + "..." 
                        : booking.tour.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {booking.tour && booking.tour.duration && (
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {formatDuration(booking.tour.duration)}
                      </span>
                    )}
                    {booking.tour && booking.tour.startDate && (
                      <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        Начало: {formatDate(booking.tour.startDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Информация о бронировании</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {booking.tour ? (
                        <>
                          <p className="text-gray-700 mb-1">
                            <span className="font-semibold">Дата начала:</span>{" "}
                            {formatDate(booking.tour.startDate)}
                          </p>
                          {booking.tour.price && (
                            <p className="text-gray-700 mb-1">
                              <span className="font-semibold">Стоимость:</span>{" "}
                              {formatPrice(booking.tour.price.amount, booking.tour.price.currency)}
                              {booking.tour.price.perPerson ? " за человека" : ""}
                            </p>
                          )}
                          {booking.tour.duration && (
                            <p className="text-gray-700 mb-1">
                              <span className="font-semibold">Продолжительность:</span>{" "}
                              {formatDuration(booking.tour.duration)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-700 mb-1">
                          <span className="font-semibold">Тур:</span> Информация о туре недоступна
                        </p>
                      )}
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Количество пассажиров:</span>{" "}
                        {booking.passengers}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Общая стоимость:</span>{" "}
                        {formatPrice(booking.totalPrice)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Статус бронирования</h4>
                    <div className={`p-3 rounded-lg border ${getStatusClass(booking.status)}`}>
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-bold">{getStatusName(booking.status)}</span>
                      </div>
                      
                      {booking.status === 'pending' && (
                        <p className="text-sm">
                          Ваше бронирование ожидает подтверждения администратором. 
                          Мы свяжемся с вами в ближайшее время.
                        </p>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <p className="text-sm">
                          Ваше бронирование подтверждено! Вы можете готовиться к поездке.
                          Детали будут отправлены на ваш email.
                        </p>
                      )}
                      
                      {booking.status === 'completed' && (
                        <p className="text-sm">
                          Поездка завершена. Спасибо, что выбрали нас! 
                          Будем рады видеть вас снова.
                        </p>
                      )}
                      
                      {booking.status === 'cancelled' && (
                        <p className="text-sm">
                          Бронирование отменено. Если у вас есть вопросы, 
                          пожалуйста, свяжитесь с нами.
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-600 mt-2">
                        Дата создания: {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Дополнительная информация о туре */}
                {booking.tour && (
                  <div className="mt-4">
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Детали тура</h4>
                      
                      {booking.tour && booking.tour.destinations && booking.tour.destinations.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-gray-600">Направления:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {booking.tour.destinations.map((destination, index) => (
                              <span 
                                key={index} 
                                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                {destination.city} ({destination.nights} {destination.nights === 1 ? 'ночь' : 
                                  (destination.nights >= 2 && destination.nights <= 4) ? 'ночи' : 'ночей'})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {booking.tour && booking.tour.included && booking.tour.included.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-gray-600">Включено в стоимость:</p>
                          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                            {booking.tour.included.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {booking.tour && booking.tour.hotels && booking.tour.hotels.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-gray-600">Отели:</p>
                          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                            {booking.tour.hotels.map((hotel, index) => (
                              <li key={index}>
                                {hotel.name} {hotel.stars && '⭐'.repeat(hotel.stars)} 
                                {hotel.city && ` (${hotel.city})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Кнопки действий */}
                <div className="mt-4 flex justify-end">
                  {booking.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md w-full text-center">
                      <p className="text-yellow-800 text-sm">
                        Ожидайте подтверждения бронирования от администратора
                      </p>
                    </div>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-md w-full text-center">
                      <p className="text-green-800 text-sm">
                        Ваше бронирование подтверждено! Готовьтесь к поездке
                      </p>
                    </div>
                  )}
                  
                  {booking.status === 'completed' && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-md w-full text-center">
                      <p className="text-blue-800 text-sm">
                        Поездка завершена. Спасибо за выбор нашей компании!
                      </p>
                    </div>
                  )}
                  
                  {booking.status === 'cancelled' && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-md w-full text-center">
                      <p className="text-red-800 text-sm">
                        Бронирование отменено
                      </p>
                    </div>
                  )}
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
