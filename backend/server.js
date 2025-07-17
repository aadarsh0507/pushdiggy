import dotenv from 'dotenv';
dotenv.config();

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***set***' : undefined);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import adminRoutes from './src/routes/adminRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import otpRoutes from './src/routes/otpRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import adminController from './src/controllers/adminController.js';
import supportRoutes from './src/routes/supportRoutes.js'; // Import the new support routes
import billingRoutes from './src/routes/billingRoutes.js'; // Import billing routes

const app = express();

// CORS middleware FIRST
app.use(cors({
  origin: 'http://localhost:5173', // Change this to your frontend URL
  // 'https://5173-firebase-pushdiggygit-1751345989139.cluster-isls3qj2gbd5qs4jkjqvhahfv6.cloudworkstations.dev',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

// Log incoming requests to debug routing
app.use((req, res, next) => {
  console.log('Request Path:', req.path, 'Original URL:', req.originalUrl);
  next();
});
app.use('/api/admin', adminRoutes);
app.use('/api/clients', clientRoutes); // Keep only this one for clients
app.use('/api/auth', otpRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/support-requests', supportRoutes); // Use the new support routes
app.use('/api/billing', billingRoutes); // Use billing routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Push Diggy API');
});