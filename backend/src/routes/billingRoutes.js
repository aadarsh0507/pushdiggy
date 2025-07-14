import express from 'express';
import { createBill, getAllBills, getBillById, updateBill, getBillsByClientId, generateInvoicePdf, downloadInvoicePdf } from '../controllers/billingController.js';
 
const router = express.Router();

router.post('/bills', createBill);
router.get('/bills', getAllBills);
router.get('/bills/:id', getBillById);
router.put('/bills/:id', updateBill);
router.get('/bills/client/:clientId', getBillsByClientId); // New route
router.get('/bills/:id/pdf', generateInvoicePdf);
router.post('/bills/:id/download', downloadInvoicePdf);

export default router;