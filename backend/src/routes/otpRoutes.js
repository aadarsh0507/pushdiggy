// src/routes/otpRoutes.js
import express from 'express';
import { sendOtp, verifyOtpAndRegister } from '../controllers/otpController.js';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';
import Client from '../models/client.js';

const router = express.Router();

// Route: Send OTP to email
router.post('/send-otp', sendOtp);

// Route: Verify OTP and Register the client
router.post('/verify-otp-register', verifyOtpAndRegister);

export default router;
export { sendOtp, verifyOtpAndRegister };
