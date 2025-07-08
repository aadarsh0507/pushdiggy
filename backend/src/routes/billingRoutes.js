import express from 'express';
import { createBill, getAllBills, getBillById, updateBill } from '../controllers/billingController.js';

const router = express.Router();

router.post('/bills', createBill);
router.get('/bills', getAllBills);
router.get('/bills/:id', getBillById);
router.put('/bills/:id', updateBill);

export default router;