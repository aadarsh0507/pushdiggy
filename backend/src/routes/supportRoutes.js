import express from 'express';
import { createSupportRequest, getSupportRequestsByClientId, getAllSupportRequests, updateSupportRequestStatus } from '../controllers/supportController.js';

const router = express.Router();

router.post('/', createSupportRequest);
router.get('/client/:clientId', getSupportRequestsByClientId); // Assuming route to get tickets by client ID
router.get('/', getAllSupportRequests); // Add this line to handle requests to the root path with potential queries
router.get('/all', (req, res, next) => {
  console.log('GET request to /api/support-requests/all received by support router');
  next(); // Pass control to the next handler (getAllSupportRequests)
}, getAllSupportRequests); // For admin to get all support requests
router.put('/:id', updateSupportRequestStatus);

export default router;
