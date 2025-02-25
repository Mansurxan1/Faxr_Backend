import { Response } from 'express';
import Booking, { IBooking } from '../models/Booking';
import Tour from '../models/Tour';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../types/express';
import { CreateBookingBody, UpdateBookingStatusBody } from '../types/booking';

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { tour: tourId, passengers, customer } = req.body as CreateBookingBody;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    res.status(404);
    throw new Error("Тур не найден");
  }

  const totalPrice = tour.price.amount * (passengers || 1);

  const newBooking = await Booking.create({
    tour: tour._id,
    passengers: passengers || 1,
    totalPrice,
    customer: {
      name: customer.name,
      email: req.user!.email,
      phone: customer.phone,
    },
  });

  await newBooking.populate("tour");

  res.status(201).json({
    status: "success",
    data: newBooking,
  });
});

export const updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.isAdmin) {
    res.status(403);
    throw new Error("Только администратор может изменять статус бронирования");
  }

  const { status } = req.body as UpdateBookingStatusBody;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Бронирование не найдено");
  }

  if (!status || Object.keys(req.body).length > 1) {
    res.status(400);
    throw new Error("Можно изменять только статус бронирования");
  }

  const validStatuses = ['pending', 'confirmed', 'cancelled'] as const;
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Недопустимый статус. Разрешены: pending, confirmed, cancelled");
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    status: "success",
    data: booking,
  });
}); 