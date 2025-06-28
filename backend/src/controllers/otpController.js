// src/controllers/otpController.js
import bcrypt from 'bcryptjs';
import Client from '../models/client.js'; // Make sure this path is correct
import { sendOtp as sendOtpUtil } from '../utils/sendOtp.js';

const otpStore = new Map(); // Temporary in-memory store

export async function sendOtp(req, res) {
  const { email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, createdAt: Date.now() });

    console.log('Sending OTP', otp, 'to', email); // Add this line

    await sendOtpUtil(email, otp);
    res.json({ message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

export async function verifyOtpAndRegister(req, res) {
  const { email, otp, password, name, company, phone, role } = req.body;
  const stored = otpStore.get(email);

  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  if (Date.now() - stored.createdAt > 10 * 60 * 1000) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const newClient = await Client.create({
      email,
      password: hashed,
      name,
      company,
      phone,
      role: role || 'client'
    });

    otpStore.delete(email);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err); // Add this for debugging
    res.status(500).json({ error: 'Registration failed' });
  }
}

