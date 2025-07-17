import express from 'express';
import { createBill, getAllBills, getBillById, updateBill, getBillsByClientId, generateInvoicePdf, downloadInvoicePdf, toggleBillCompletion } from '../controllers/billingController.js';
 
const router = express.Router();

router.post('/bills', createBill);
router.get('/bills', getAllBills);
router.get('/bills/client/:clientId', getBillsByClientId);
router.put('/bills/:billId/completion', toggleBillCompletion);
router.get('/bills/:id/pdf', generateInvoicePdf);
router.post('/bills/:id/download', downloadInvoicePdf);
router.get('/bills/:id', getBillById);
router.put('/bills/:id', updateBill);

export default router;