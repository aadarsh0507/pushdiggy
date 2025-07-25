import express from 'express';
import { getAllClients, registerClient, loginClient, updateClientStatus, getClientById, updateClientGeneral } from '../controllers/clientController.js';
import Client from '../models/client.js';


const router = express.Router();

router.get('/', getAllClients);
router.post('/register', registerClient);
router.post('/login', loginClient);
router.get('/:id', getClientById); // Add this line to fetch client by ID
router.put('/:id/status', updateClientStatus);
router.put('/:id', updateClientGeneral); // Use authMiddleware here

export default router;
