import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публичные маршруты
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Защищенные маршруты
router.use(authenticate);
router.get('/profile', authController.getProfile);
router.put('/update-password', authController.updatePassword);

export default router; 