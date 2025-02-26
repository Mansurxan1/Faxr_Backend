import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useGetTourByIdQuery } from "../../features/tours/toursApiSlice";
import { useCreateBookingMutation } from "../../features/bookings/bookingsApiSlice";

const BookingForm = () => {
  const { id: tourId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  // Редирект если пользователь не авторизован
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const { data: tour, isLoading: isTourLoading } = useGetTourByIdQuery(tourId);
  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  const [participants, setParticipants] = useState(1);
  const [date, setDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (isTourLoading) {
    return (
      <div className="text-center py-8">Загрузка информации о туре...</div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Тур не найден</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Вернуться к списку туров
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await createBooking({
        tour: tourId,
        date,
        passengers: 1,
        customer: { name: user.name || "test", phone: user.phone || "test" },
        participants: Number(participants),
      }).unwrap();

      navigate("/bookings/my-bookings", { replace: true });
    } catch (err) {
      setErrorMsg(err?.data?.message || "Ошибка при создании бронирования");
    }
  };

  // Расчет общей стоимости
  const totalPrice = tour.data.price.amount * participants;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Бронирование тура</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>
            <p className="text-gray-600 mb-2">{tour.description}</p>
            <p className="text-blue-600 font-bold">
              Цена: {tour.price} ₽ за человека
            </p>
          </div>

          {errorMsg && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
              role="alert">
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-gray-700 font-bold mb-2">
                Дата поездки
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="participants"
                className="block text-gray-700 font-bold mb-2">
                Количество участников
              </label>
              <input
                type="number"
                id="participants"
                value={participants}
                onChange={(e) =>
                  setParticipants(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-6 p-4 bg-gray-100 rounded-md">
              <h4 className="font-bold mb-2">Итого:</h4>
              <p className="text-xl text-blue-600 font-bold">{totalPrice} ₽</p>
            </div>

            <div className="flex justify-between">
              <Link
                to="/"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
                Отмена
              </Link>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                disabled={isBookingLoading}>
                {isBookingLoading ? "Обработка..." : "Забронировать"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
