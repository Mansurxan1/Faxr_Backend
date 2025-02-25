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

  await newBooking.populate("tour");

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
    select: "name startDate price destinations hotels",
  });

  res.status(200).json({
    status: "success",
    count: bookings.length,
    data: bookings,
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate({
    path: "tour",
    select: "name startDate price",
  });

  res.status(200).json({
    status: "success",
    data: bookings,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("tour");

  if (!booking) {
    res.status(404);
    throw new Error("Бронирование не найдено");
  }

  if (!req.user.isAdmin && booking.customer.email !== req.user.email) {
    res.status(403);
    throw new Error("У вас нет прав для просмотра этого бронирования");
  }

  res.status(200).json({
    status: "success",
    data: booking,
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
  const validStatuses = ['pending', 'confirmed', 'cancelled'];
  if (!validStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error("Недопустимый статус. Разрешены: pending, confirmed, cancelled");
  }

  booking.status = req.body.status;
  await booking.save();

  res.status(200).json({
    status: "success",
    data: booking,
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
