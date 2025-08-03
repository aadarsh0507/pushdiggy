import dotenv from 'dotenv';
dotenv.config();

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-secret-key';
  console.log('JWT_SECRET not found in environment, using default');
}

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***set***' : undefined);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***set***' : 'NOT SET');

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import adminRoutes from './src/routes/adminRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import otpRoutes from './src/routes/otpRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import clientServiceRoutes from './src/routes/clientServiceRoutes.js';
import adminController from './src/controllers/adminController.js';
import supportRoutes from './src/routes/supportRoutes.js'; // Import the new support routes
import billingRoutes from './src/routes/billingRoutes.js'; // Import billing routes
import contactRoutes from './src/routes/contactRoutes.js'; // Import contact routes
import statsRoutes from './src/routes/statsRoutes.js'; // Import stats routes
import aboutStatsRoutes from './src/routes/aboutStatsRoutes.js'; // Import about stats routes

const app = express();

// CORS middleware FIRST
app.use(cors({
  origin: 
  'http://localhost:5173', // Change this to your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

// Log incoming requests to debug routing
app.use((req, res, next) => {
  console.log('Request Path:', req.path, 'Original URL:', req.originalUrl, 'Method:', req.method);
  next();
});

app.use('/api/admin', adminRoutes);
app.use('/api/clients', clientRoutes); // Keep only this one for clients
app.use('/api/auth', otpRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/client-services', clientServiceRoutes); // Use client service routes
app.use('/api/support-requests', supportRoutes); // Use the new support routes
app.use('/api/billing', billingRoutes); // Use billing routes
app.use('/api/contact', contactRoutes); // Use contact routes
app.use('/api/stats', statsRoutes); // Use stats routes
app.use('/api/about-stats', aboutStatsRoutes); // Use about stats routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Push Diggy API');
});