import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.body.tour);
  if (!tour) {
    res.status(404);
    throw new Error("Тур не найден");
  }

  const totalPrice = tour.price.amount * (req.body.passengers || 1);

  const newBooking = await Booking.create({
    tour: tour._id,
    passengers: req.body.passengers || 1,
    totalPrice,
    customer: {
      name: req.body.customer.name,
      email: req.user.email,
      phone: req.body.customer.phone,
    },
  });

  // Полное заполнение данных о туре
  await newBooking.populate({
    path: "tour",
    select: "name startDate price destinations hotels image duration description included",
  });

  res.status(201).json({
    status: "success",
    data: newBooking,
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    "customer.email": req.user.email,
  }).populate({
    path: "tour",
    select: "name startDate price destinations hotels image duration description included",
  });

  // Проверяем, что все туры корректно загружены
  const processedBookings = await Promise.all(
    bookings.map(async (booking) => {
      const bookingObj = booking.toObject ? booking.toObject() : booking;
      
      // Если тур не был найден через populate, попробуем найти его вручную
      if (!bookingObj.tour && bookingObj._id) {
        try {
          // Получаем исходное бронирование из базы
          const originalBooking = await Booking.findById(bookingObj._id);
          if (originalBooking && originalBooking.tour) {
            const tourId = originalBooking.tour;
            const tourData = await Tour.findById(tourId);
            
            if (tourData) {
              // Если тур найден, добавляем его данные в бронирование
              bookingObj.tour = tourData.toObject();
            } else {
              // Если тур не найден, оставляем информацию о его ID
              bookingObj.tour = { 
                _id: tourId,
                name: "Тур не найден",
                info: "Подробная информация о туре недоступна"
              };
            }
          }
        } catch (error) {
          console.error(`Ошибка при поиске тура: ${error.message}`);
        }
      }
      return bookingObj;
    })
  );

  res.status(200).json({
    status: "success",
    count: processedBookings.length,
    data: processedBookings,
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate({
    path: "tour",
    select: "name startDate price destinations hotels image duration description included",
  });

  // Проверяем, что все туры корректно загружены
  const processedBookings = await Promise.all(
    bookings.map(async (booking) => {
      const bookingObj = booking.toObject ? booking.toObject() : booking;
      
      // Если тур не был найден через populate, попробуем найти его вручную
      if (!bookingObj.tour && bookingObj._id) {
        try {
          // Получаем исходное бронирование из базы
          const originalBooking = await Booking.findById(bookingObj._id);
          if (originalBooking && originalBooking.tour) {
            const tourId = originalBooking.tour;
            const tourData = await Tour.findById(tourId);
            
            if (tourData) {
              // Если тур найден, добавляем его данные в бронирование
              bookingObj.tour = tourData.toObject();
            } else {
              // Если тур не найден, оставляем информацию о его ID
              bookingObj.tour = { 
                _id: tourId,
                name: "Тур не найден",
                info: "Подробная информация о туре недоступна"
              };
            }
          }
        } catch (error) {
          console.error(`Ошибка при поиске тура: ${error.message}`);
        }
      }
      return bookingObj;
    })
  );

  res.status(200).json({
    status: "success",
    count: processedBookings.length,
    data: processedBookings,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: "tour",
    select: "name startDate price destinations hotels image duration description included",
  });

  if (!booking) {
    res.status(404);
    throw new Error("Бронирование не найдено");
  }

  if (!req.user.isAdmin && booking.customer.email !== req.user.email) {
    res.status(403);
    throw new Error("У вас нет прав для просмотра этого бронирования");
  }

  const bookingObj = booking.toObject ? booking.toObject() : booking;
  
  // Если тур не был найден через populate, попробуем найти его вручную
  if (!bookingObj.tour && booking.tour) {
    try {
      const tourId = booking.tour;
      const tourData = await Tour.findById(tourId);
      
      if (tourData) {
        // Если тур найден, добавляем его данные в бронирование
        bookingObj.tour = tourData.toObject();
      } else {
        // Если тур не найден, оставляем информацию о его ID
        bookingObj.tour = { 
          _id: tourId,
          name: "Тур не найден",
          info: "Подробная информация о туре недоступна"
        };
      }
    } catch (error) {
      console.error(`Ошибка при поиске тура: ${error.message}`);
    }
  }

  res.status(200).json({
    status: "success",
    data: bookingObj,
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  // Проверяем, является ли пользователь админом
  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error("Только администратор может изменять статус бронирования");
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Бронирование не найдено");
  }

  // Проверяем, что в запросе передан только статус
  if (!req.body.status || Object.keys(req.body).length > 1) {
    res.status(400);
    throw new Error("Можно изменять только статус бронирования");
  }

  // Проверяем валидность статуса
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error("Недопустимый статус. Разрешены: pending, confirmed, cancelled, completed");
  }

  booking.status = req.body.status;
  await booking.save();

  // Получаем обновленное бронирование с данными о туре
  const updatedBooking = await Booking.findById(req.params.id).populate({
    path: "tour",
    select: "name startDate price destinations hotels image duration description included",
  });

  const bookingObj = updatedBooking.toObject ? updatedBooking.toObject() : updatedBooking;
  
  // Если тур не был найден через populate, попробуем найти его вручную
  if (!bookingObj.tour && updatedBooking.tour) {
    try {
      const tourId = updatedBooking.tour;
      const tourData = await Tour.findById(tourId);
      
      if (tourData) {
        // Если тур найден, добавляем его данные в бронирование
        bookingObj.tour = tourData.toObject();
      } else {
        // Если тур не найден, оставляем информацию о его ID
        bookingObj.tour = { 
          _id: tourId,
          name: "Тур не найден",
          info: "Подробная информация о туре недоступна"
        };
      }
    } catch (error) {
      console.error(`Ошибка при поиске тура: ${error.message}`);
    }
  }

  res.status(200).json({
    status: "success",
    data: bookingObj,
  });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Бронирование не найдено");
  }

  await booking.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
