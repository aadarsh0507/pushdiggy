import express from 'express';
import multer from 'multer';
import { getAllServices, createService, updateService, deleteService, uploadService, uploadMiddleware } from '../controllers/serviceController.js';
 
const router = express.Router();

router.get('/', getAllServices);
router.post('/', createService);
router.post('/upload', uploadMiddleware, uploadService);

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: error.message });
  }
  
  if (error.message && error.message.includes('Only image files are allowed')) {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
});
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
