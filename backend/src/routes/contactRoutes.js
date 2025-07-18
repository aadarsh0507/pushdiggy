import express from 'express';
const router = express.Router();
import { submitContactForm, getContactMessages, deleteContactMessage } from '../controllers/contactController.js'; // Import controller functions
import Contact from '../models/Contact.js'; // Import the Contact model

// @desc    Submit contact form
// @route   POST /
// @access  Public
router.post('/', submitContactForm);

// @desc    Get all contact messages
// @route   GET /messages
// @access  Admin (you might want to add authentication middleware later)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.route('/:id').delete(deleteContactMessage);

export default router;
