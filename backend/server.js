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
import supportRoutes from './src/routes/supportRoutes.js'; // Import the new support routes

const app = express();

// CORS middleware FIRST
app.use(cors({
  origin: 'https://5173-firebase-pushdiggygit-1751345989139.cluster-isls3qj2gbd5qs4jkjqvhahfv6.cloudworkstations.dev',
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

app.use('/api/admin', adminRoutes);
app.use('/api/clients', clientRoutes); // Keep only this one for clients
app.use('/api/auth', otpRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/support-requests', supportRoutes); // Use the new support routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});