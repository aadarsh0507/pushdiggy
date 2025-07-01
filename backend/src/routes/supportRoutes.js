import express from 'express';
import { createSupportRequest, getSupportRequestsByClientId, getAllSupportRequests, updateSupportRequestStatus } from '../controllers/supportController.js';

const router = express.Router();

router.post('/', createSupportRequest);
router.get('/', getSupportRequestsByClientId); // For fetching by client ID
router.get('/all', getAllSupportRequests); // For admin to get all support requests
router.put('/:id', updateSupportRequestStatus);

export default router;