import express from 'express';
import * as tourController from '../controllers/tourController.js';
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Публичные маршруты
router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTourById);

// Защищенные маршруты (требуют авторизации)
router.use(authenticate); // Все маршруты ниже будут защищены

router.post('/', tourController.createTour);
router.put('/:id', tourController.updateTour);
router.delete('/:id', tourController.deleteTour);

export default router; 