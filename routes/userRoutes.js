import express from 'express';
import {register, login, logout, getProfile} from '../controllers/userController.js';
import { protect } from '../middlewares/userMiddleware.js';

// Initialize router
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);

export default router;