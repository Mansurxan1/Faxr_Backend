import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../features/auth/authSlice';
import { 
  useGetTourByIdQuery,
  useCreateTourMutation,
  useUpdateTourMutation 
} from '../../features/tours/toursApiSlice';

const TourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const isEditMode = Boolean(id);
  
  // Редирект если пользователь не админ
  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  // Получение данных тура для редактирования
  const { data: tour, isLoading: isTourLoading } = useGetTourByIdQuery(id, {
    skip: !isEditMode,
  });
  
  const [createTour, { isLoading: isCreating }] = useCreateTourMutation();
  const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'easy',
    startLocation: '',
    image: null,
    previewImage: null
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  
  // Заполнение формы данными тура при редактировании
  useEffect(() => {
    if (tour && isEditMode) {
      setFormData({
        name: tour.name || '',
        description: tour.description || '',
        price: tour.price || '',
        duration: tour.duration || '',
        maxGroupSize: tour.maxGroupSize || '',
        difficulty: tour.difficulty || 'easy',
        startLocation: tour.startLocation || '',
        image: null,
        previewImage: tour.imagePath ? `/api/tours/${tour._id}/image` : null
      });
    }
  }, [tour, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          image: file,
          previewImage: previewURL
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const tourData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      maxGroupSize: Number(formData.maxGroupSize),
      difficulty: formData.difficulty,
      startLocation: formData.startLocation,
      image: formData.image
    };

    try {
      if (isEditMode) {
        await updateTour({ id, ...tourData }).unwrap();
      } else {
        await createTour(tourData).unwrap();
      }
      
      navigate('/');
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Ошибка при сохранении тура');
    }
  };
  
  if (isTourLoading) {
    return <div className="text-center py-8">Загрузка данных тура...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Редактирование тура' : 'Создание нового тура'}
          </h2>
          
          {errorMsg && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{errorMsg}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
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
              <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
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
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
                  Цена (₽)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">
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
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="maxGroupSize" className="block text-gray-700 font-bold mb-2">
                  Максимальный размер группы
                </label>
                <input
                  type="number"
                  id="maxGroupSize"
                  name="maxGroupSize"
                  value={formData.maxGroupSize}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-gray-700 font-bold mb-2">
                  Сложность
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="easy">Легкая</option>
                  <option value="medium">Средняя</option>
                  <option value="hard">Сложная</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="startLocation" className="block text-gray-700 font-bold mb-2">
                Место начала тура
              </label>
              <input
                type="text"
                id="startLocation"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
                Изображение тура
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              
              {formData.previewImage && (
                <div className="mt-2">
                  <img 
                    src={formData.previewImage} 
                    alt="Предпросмотр" 
                    className="h-40 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                disabled={isCreating || isUpdating}
              >
                {isEditMode ? 'Обновить тур' : 'Создать тур'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourForm; 