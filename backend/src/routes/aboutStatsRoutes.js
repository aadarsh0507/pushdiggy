import express from 'express';
import { getAboutStats, updateAboutStats } from '../controllers/aboutStatsController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get about stats (public)
router.get('/', getAboutStats);

// Update about stats (admin only)
router.put('/', authenticateToken, isAdmin, updateAboutStats);

export default router; 