import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Все маршруты бронирования требуют авторизации
router.use(authenticate);

// POST /api/bookings/
router.post('/', bookingController.createBooking);

// GET /api/bookings/my-bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Маршруты для администраторов
// GET /api/bookings/
router.get('/', isAdmin, bookingController.getAllBookings);

// GET /api/bookings/:id
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id/status
router.put('/:id/status', isAdmin, bookingController.updateBookingStatus);

// DELETE /api/bookings/:id
router.delete('/:id', isAdmin, bookingController.deleteBooking);

export default router; 