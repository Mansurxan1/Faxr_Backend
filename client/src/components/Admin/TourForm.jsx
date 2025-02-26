import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../features/auth/authSlice";
import {
  useGetTourByIdQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
} from "../../features/tours/toursApiSlice";

const TourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const isEditMode = Boolean(id);

  // Редирект если пользователь не админ
  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  // Получение данных тура для редактирования
  const { data: tour, isLoading: isTourLoading } = useGetTourByIdQuery(id, {
    skip: !isEditMode,
  });

  const [createTour, { isLoading: isCreating }] = useCreateTourMutation();
  const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    price: {
      amount: "",
      currency: "USD",
      perPerson: true
    },
    duration: "",
    maxGroupSize: "",
    difficulty: "easy",
    startLocation: "",
    image: "",
    destinations: [{ city: "", nights: 1 }],
    included: [""],
    hotels: [{ name: "", stars: 3, city: "" }],
  });

  const [errorMsg, setErrorMsg] = useState("");

  // Заполнение формы данными тура при редактировании
  useEffect(() => {
    if (tour && isEditMode) {
      const tourData = tour.data;
      setFormData({
        name: tourData.name || "",
        description: tourData.description || "",
        startDate: tourData.startDate ? new Date(tourData.startDate).toISOString().split('T')[0] : "",
        price: {
          amount: tourData.price?.amount || "",
          currency: tourData.price?.currency || "USD",
          perPerson: tourData.price?.perPerson || true
        },
        duration: tourData.duration || "",
        maxGroupSize: tourData.maxGroupSize || "",
        difficulty: tourData.difficulty || "easy",
        startLocation: tourData.startLocation || "",
        image: tourData.image ? tourData.image[0] : "",
        destinations: tourData.destinations?.length > 0 
          ? tourData.destinations 
          : [{ city: "", nights: 1 }],
        included: tourData.included?.length > 0 
          ? tourData.included 
          : [""],
        hotels: tourData.hotels?.length > 0 
          ? tourData.hotels 
          : [{ name: "", stars: 3, city: "" }],
      });
    }
  }, [tour, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: value,
      }));
    } else if (name.startsWith('price.')) {
      // Обработка изменения цены
      const priceField = name.split('.')[1];
      let fieldValue = value;
      
      // Преобразуем правильно значения
      if (priceField === 'amount') fieldValue = value === '' ? '' : Number(value);
      if (priceField === 'perPerson') fieldValue = type === 'checkbox' ? e.target.checked : value;
      
      setFormData((prev) => ({
        ...prev,
        price: {
          ...prev.price,
          [priceField]: fieldValue
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Обработчики для динамических полей (destinations, included, hotels)
  const handleDestinationChange = (index, field, value) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[index] = {
      ...updatedDestinations[index],
      [field]: field === 'nights' ? Number(value) : value
    };
    setFormData(prev => ({ ...prev, destinations: updatedDestinations }));
  };

  const handleIncludedChange = (index, value) => {
    const updatedIncluded = [...formData.included];
    updatedIncluded[index] = value;
    setFormData(prev => ({ ...prev, included: updatedIncluded }));
  };

  const handleHotelChange = (index, field, value) => {
    const updatedHotels = [...formData.hotels];
    updatedHotels[index] = {
      ...updatedHotels[index],
      [field]: field === 'stars' ? Number(value) : value
    };
    setFormData(prev => ({ ...prev, hotels: updatedHotels }));
  };

  // Добавление элементов
  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, { city: "", nights: 1 }]
    }));
  };

  const addIncluded = () => {
    setFormData(prev => ({
      ...prev,
      included: [...prev.included, ""]
    }));
  };

  const addHotel = () => {
    setFormData(prev => ({
      ...prev,
      hotels: [...prev.hotels, { name: "", stars: 3, city: "" }]
    }));
  };

  // Удаление элементов
  const removeDestination = (index) => {
    if (formData.destinations.length > 1) {
      const updatedDestinations = formData.destinations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, destinations: updatedDestinations }));
    }
  };

  const removeIncluded = (index) => {
    if (formData.included.length > 1) {
      const updatedIncluded = formData.included.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, included: updatedIncluded }));
    }
  };

  const removeHotel = (index) => {
    if (formData.hotels.length > 1) {
      const updatedHotels = formData.hotels.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, hotels: updatedHotels }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Создаем объект tourData из formData
    const tourData = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      price: formData.price,
      duration: Number(formData.duration),
      maxGroupSize: Number(formData.maxGroupSize || 0),
      difficulty: formData.difficulty,
      startLocation: formData.startLocation,
      image: formData.image ? [formData.image] : [],
      destinations: formData.destinations,
      included: formData.included,
      hotels: formData.hotels
    };

    try {
      if (isEditMode) {
        await updateTour({ id, ...tourData }).unwrap();
      } else {
        await createTour(tourData).unwrap();
      }

      navigate("/");
    } catch (err) {
      setErrorMsg(err?.data?.message || "Ошибка при сохранении тура");
    }
  };

  if (isTourLoading) {
    return <div className="text-center py-8">Загрузка данных тура...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-12">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {isEditMode ? "Редактирование тура" : "Создание нового тура"}
          </h2>

          {errorMsg && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
              role="alert">
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-bold mb-4 text-gray-700">Основная информация</h3>
              
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2">
                  Название тура
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-bold mb-2">
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-gray-700 font-bold mb-2">
                    Дата начала
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-gray-700 font-bold mb-2">
                    Продолжительность (дней)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="price.amount"
                      className="block text-gray-700 font-bold mb-2">
                      Цена
                    </label>
                    <input
                      type="number"
                      id="price.amount"
                      name="price.amount"
                      value={formData.price.amount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="w-[120px]">
                    <label
                      htmlFor="price.currency"
                      className="block text-gray-700 font-bold mb-2">
                      Валюта
                    </label>
                    <select
                      id="price.currency"
                      name="price.currency"
                      value={formData.price.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="RUB">RUB</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="price.perPerson"
                      name="price.perPerson"
                      checked={formData.price.perPerson}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="price.perPerson"
                      className="ml-2 block text-gray-700">
                      Цена за человека
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Места назначения */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">Места назначения</h3>
                <button
                  type="button"
                  onClick={addDestination}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition"
                >
                  + Добавить
                </button>
              </div>
              
              {formData.destinations.map((destination, index) => (
                <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Место назначения #{index + 1}</span>
                    
                    {formData.destinations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDestination(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Город
                      </label>
                      <input
                        type="text"
                        value={destination.city}
                        onChange={(e) => handleDestinationChange(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Ночей
                      </label>
                      <input
                        type="number"
                        value={destination.nights}
                        onChange={(e) => handleDestinationChange(index, 'nights', e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Что включено */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">Что включено</h3>
                <button
                  type="button"
                  onClick={addIncluded}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition"
                >
                  + Добавить
                </button>
              </div>
              
              {formData.included.map((item, index) => (
                <div key={index} className="mb-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleIncludedChange(index, e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Например: трансфер, экскурсия, завтрак..."
                    required
                  />
                  
                  {formData.included.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIncluded(index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Отели */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">Отели</h3>
                <button
                  type="button"
                  onClick={addHotel}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition"
                >
                  + Добавить
                </button>
              </div>
              
              {formData.hotels.map((hotel, index) => (
                <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Отель #{index + 1}</span>
                    
                    {formData.hotels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHotel(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold mb-2">
                        Название отеля
                      </label>
                      <input
                        type="text"
                        value={hotel.name}
                        onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Звёзд
                      </label>
                      <select
                        value={hotel.stars}
                        onChange={(e) => handleHotelChange(index, 'stars', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(star => (
                          <option key={star} value={star}>{star}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-gray-700 font-bold mb-2">
                        Город
                      </label>
                      <input
                        type="text"
                        value={hotel.city}
                        onChange={(e) => handleHotelChange(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Фото */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-bold mb-4 text-gray-700">Фото тура</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  URL изображения
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Введите URL изображения"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Укажите прямую ссылку на изображение (например, https://example.com/image.jpg)
                </p>
              </div>

              {formData.image && (
                <div className="mt-4">
                  <p className="text-gray-700 font-bold mb-2">Предпросмотр:</p>
                  <img
                    src={formData.image}
                    alt="Предпросмотр"
                    className="w-full max-h-64 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x600?text=Ошибка+загрузки+изображения';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Кнопки управления */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
              >
                {isCreating || isUpdating
                  ? "Сохранение..."
                  : isEditMode
                  ? "Обновить"
                  : "Создать"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourForm;
