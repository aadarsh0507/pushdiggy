const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Client = require('../models/client');

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

module.exports = {
  authMiddleware,
};