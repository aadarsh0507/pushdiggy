import express from 'express';
import { getAllClients, registerClient, loginClient, updateClientStatus, getClientById } from '/home/user/pushdiggy/backend/src/controllers/clientController.js';
import Client from '../models/client.js';

const router = express.Router();

router.get('/', getAllClients);
router.post('/register', registerClient);
router.post('/login', loginClient);
router.get('/:id', getClientById); // Add this line to fetch client by ID
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const client = await Client.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

router.put('/:id', updateClientStatus);

export default router;
