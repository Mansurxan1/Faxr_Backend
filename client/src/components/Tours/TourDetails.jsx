import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetTourByIdQuery } from "../../features/tours/toursApiSlice";

const TourDetails = () => {
  const { id } = useParams();
  const { data: tourData, isLoading, isError, error } = useGetTourByIdQuery(id);

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    try {
      const options = { day: "numeric", month: "long", year: "numeric" };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    } catch (e) {
      return "Дата не указана";
    }
  };

  // Функция для форматирования цены
  const formatPrice = (price) => {
    if (!price || !price.amount) return "Цена не указана";

    try {
      const { amount, currency = "USD" } = price;
      if (currency === "USD") {
        return new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      }
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(amount);
    } catch (e) {
      return `${price.amount} ${price.currency}`;
    }
  };

  // Функция для форматирования продолжительности
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
    event.target.src =
      "https://via.placeholder.com/800x400?text=Изображение+недоступно";
    event.target.alt = "Изображение недоступно";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка информации о туре...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert">
          <p>
            Ошибка:{" "}
            {error?.data?.message || "Не удалось загрузить информацию о туре"}
          </p>
          <Link to="/" className="text-red-700 underline hover:no-underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const tour = tourData?.data;

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>Тур не найден</p>
          <Link to="/" className="text-yellow-700 underline hover:no-underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Навигация */}
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          ← Вернуться к списку туров
        </Link>
      </div>

      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{tour.name}</h1>

      {/* Галерея изображений */}
      {tour.image && tour.image.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tour.image.map((img, index) => (
              <div
                key={index}
                className="relative h-64 overflow-hidden rounded-lg shadow-md">
                <img
                  src={img}
                  alt={`${tour.name} - изображение ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          {/* Описание */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Описание тура
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {tour.description}
            </p>
          </div>

          {/* Направления */}
          {tour.destinations && tour.destinations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Маршрут
              </h2>
              <div className="space-y-4">
                {tour.destinations.map((destination, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">
                        {destination.city}
                      </h3>
                      <p className="text-gray-600">
                        {destination.nights}{" "}
                        {destination.nights === 1
                          ? "ночь"
                          : destination.nights > 1 && destination.nights < 5
                          ? "ночи"
                          : "ночей"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Отели */}
          {tour.hotels && tour.hotels.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Отели
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {tour.hotels.map((hotel, index) => (
                  <div
                    key={index}
                    className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-gray-900">
                      {hotel.name} {"★".repeat(hotel.stars)}
                    </h3>
                    <p className="text-gray-600">{hotel.city}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Основные детали */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Продолжительность</p>
                <p className="text-lg font-semibold">
                  {formatDuration(tour.duration)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Дата начала</p>
                <p className="text-lg font-semibold">
                  {formatDate(tour.startDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Стоимость</p>
                <p className="text-lg font-semibold">
                  {formatPrice(tour.price)}
                  {tour.price?.perPerson && (
                    <span className="text-sm text-gray-600"> за человека</span>
                  )}
                </p>
              </div>
            </div>

            <Link
              to={`/tours/${tour._id}/book/`}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 inline-block text-center">
              Забронировать
            </Link>
          </div>

          {/* Включено в стоимость */}
          {tour.included && tour.included.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Включено в стоимость
              </h2>
              <ul className="space-y-2">
                {tour.included.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
