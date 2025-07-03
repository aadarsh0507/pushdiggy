import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.get('/admins', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);

export default router;