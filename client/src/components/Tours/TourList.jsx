import React, { useState } from "react";
import {
  useGetToursQuery,
  useDeleteTourMutation,
} from "../../features/tours/toursApiSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../features/auth/authSlice";
import AdminOnly from "../UI/AdminOnly";

const TourList = () => {
  const {
    data: tours,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetToursQuery();
  const isAdmin = useSelector(selectIsAdmin);
  const [deleteTour, { isLoading: isDeleting }] = useDeleteTourMutation();
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Обработчик удаления тура
  const handleDeleteClick = (tourId) => {
    setDeleteId(tourId);
    setShowConfirmation(true);
  };

  // Подтверждение удаления тура
  const confirmDelete = async () => {
    try {
      await deleteTour(deleteId).unwrap();
      setShowConfirmation(false);
      setDeleteId(null);
      refetch(); // Обновляем список туров
    } catch (err) {
      console.error("Ошибка при удалении тура:", err);
    }
  };

  // Отмена удаления тура
  const cancelDelete = () => {
    setShowConfirmation(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl text-gray-600">Загрузка туров...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"
        role="alert">
        <p>Ошибка: {error?.data?.message || "Не удалось загрузить туры"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Доступные туры</h1>
        <AdminOnly>
          <Link
            to="/admin/tours/new"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition">
            Добавить тур
          </Link>
        </AdminOnly>
      </div>

      {tours?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">Туры не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours?.data.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-lg shadow-md overflow-hidden">
              {tour.image && tour.image.length > 0 ? (
                <Link
                  Link
                  to={`/tours/${tour._id}`}
                  key={tour._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={tour.image[0]}
                    alt={tour.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/800x600?text=Нет+изображения";
                    }}
                  />
                </Link>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Нет изображения</p>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {tour.name}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {tour.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-blue-600">
                    {tour.price?.amount} {tour.price?.currency}
                  </span>

                  <Link
                    to={`/tours/${tour._id}/book`}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm transition">
                    Забронировать
                  </Link>
                </div>
                <AdminOnly>
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => handleDeleteClick(tour._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isDeleting && deleteId === tour._id}>
                      {isDeleting && deleteId === tour._id
                        ? "Удаление..."
                        : "Удалить"}
                    </button>
                    <Link
                      to={`/admin/tours/${tour._id}/edit`}
                      className="text-blue-500 hover:text-blue-700">
                      Редактировать
                    </Link>
                  </div>
                </AdminOnly>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Подтверждение удаления</h3>
            <p className="mb-6">
              Вы уверены, что хотите удалить этот тур? Это действие невозможно
              отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition"
                disabled={isDeleting}>
                Отмена
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition"
                disabled={isDeleting}>
                {isDeleting ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourList;
