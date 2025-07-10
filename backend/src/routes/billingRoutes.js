import express from 'express';
import { createBill, getAllBills, getBillById, updateBill, getBillsByClientId } from '../controllers/billingController.js';

const router = express.Router();

router.post('/bills', createBill);
router.get('/bills', getAllBills);
router.get('/bills/:id', getBillById);
router.put('/bills/:id', updateBill);
router.get('/bills/client/:clientId', getBillsByClientId); // New route

export default router;