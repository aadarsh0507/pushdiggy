import express from 'express';
import { getAllClients, registerClient, loginClient, updateClientStatus, getClientById, updateClientGeneral, getActiveClientCount, getTotalClientCount, toggleAMC } from '../controllers/clientController.js';
import Client from '../models/client.js';


const router = express.Router();

router.get('/', getAllClients);
router.get('/active', getActiveClientCount);
router.get('/count/active', getActiveClientCount);
router.get('/count', getTotalClientCount);
router.get('/debug/statuses', async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json({
      totalClients: clients.length,
      clients: clients.map(c => ({ 
        id: c._id, 
        name: c.name, 
        status: c.status, 
        email: c.email 
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.post('/register', registerClient);
router.post('/login', loginClient);
router.put('/:id/status', updateClientStatus);
router.put('/:id/toggle-amc', toggleAMC);
router.put('/:id', updateClientGeneral);
router.get('/:id', getClientById);

export default router;
