import express from 'express';
import {
  getAllClientServices,
  getClientServicesByClient,
  createClientService,
  createMultipleClientServices,
  uploadClientService,
  updateClientService,
  deleteClientService,
  getClientServiceById,
  updateClientServiceStatus,
  uploadMiddleware
} from '../controllers/clientServiceController.js';
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(authenticateToken);

// Debug endpoint to test if routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Client service routes are working!' });
});

// Get all client services (admin only)
router.get('/', getAllClientServices);

// Get client services by client ID
router.get('/client/:clientId', getClientServicesByClient);

// Get specific client service by ID
router.get('/:id', getClientServiceById);

// Create a new client service
router.post('/', createClientService);

// Create multiple client services (bulk assignment)
router.post('/bulk', createMultipleClientServices);

// Upload client service with image
router.post('/upload', uploadMiddleware.single('image'), uploadClientService);

// Update client service
router.put('/:id', updateClientService);

// Update client service status
router.patch('/:id/status', updateClientServiceStatus);

// Delete client service
router.delete('/:id', deleteClientService);

export default router; 