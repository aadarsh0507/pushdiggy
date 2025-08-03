import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import Client from '../models/client.js';

const authMiddleware = (role) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (role === 'admin') {
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
          return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }
      } else if (role === 'client') {
        const client = await Client.findById(req.user.id);
        if (!client) {
          return res.status(403).json({ message: 'Access denied. Not a client.' });
        }
      }

      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

// General authentication middleware that doesn't check specific roles
const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('Auth middleware - Authorization header:', req.header('Authorization'));
  console.log('Auth middleware - Token:', token);
  
  if (!token) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth middleware - Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Auth middleware - Invalid token:', error.message);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Admin-only middleware
const isAdmin = async (req, res, next) => {
  try {
    console.log('isAdmin middleware - User ID:', req.user.id);
    const admin = await Admin.findById(req.user.id);
    console.log('isAdmin middleware - Admin found:', admin);
    
    if (!admin) {
      console.log('isAdmin middleware - Admin not found');
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    console.log('isAdmin middleware - Admin access granted');
    next();
  } catch (error) {
    console.log('isAdmin middleware - Error:', error.message);
    res.status(500).json({ message: 'Server error.' });
  }
};

export {
  authMiddleware,
  authenticateToken,
  isAdmin
};