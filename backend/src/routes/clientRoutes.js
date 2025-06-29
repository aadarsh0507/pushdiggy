import express from 'express';
import { getAllClients, registerClient, loginClient } from '../controllers/clientController.js';
import Client from '../models/client.js'; // Import the Client model

const router = express.Router();

router.get('/', getAllClients);
router.post('/register', registerClient);
router.post('/login', loginClient);
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

export default router;
