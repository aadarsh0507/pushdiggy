import express from 'express';
import { createBill } from '../controllers/billingController.js';

const router = express.Router();

router.post('/bills', createBill);

export default router;