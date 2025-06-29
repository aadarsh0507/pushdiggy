import express from 'express';
import { getAllServices, createService } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getAllServices);
router.post('/', createService);

export default router;
