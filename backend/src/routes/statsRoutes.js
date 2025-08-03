import express from 'express';
import { getStats, updateStats } from '../controllers/statsController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get stats (public)
router.get('/', getStats);

// Update stats (admin only)
router.put('/', authenticateToken, isAdmin, updateStats);

export default router; 