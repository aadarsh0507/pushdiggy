import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminController = {
  async registerAdmin(req, res) {
    try {
      const { name, email, password, employeeId, department, phone } = req.body;

      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({ message: "Email already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        employeeId,
        department,
        phone,
        role: 'admin',
        status: 'active' // All admins are active by default
      });

      await newAdmin.save();

      res.status(201).json({
        message: "Admin registered successfully.",
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          employeeId: newAdmin.employeeId,
          department: newAdmin.department,
          role: newAdmin.role,
          status: newAdmin.status,
          phone: newAdmin.phone
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      // Find admin by email
      const admin = await Admin.findOne({ email, role: 'admin' });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: admin._id, 
          email: admin.email, 
          role: admin.role 
        }, 
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Ensure only 'admin' role gets through this controller
      res.status(200).json({
        success: true,
        message: "Admin logged in successfully.",
        token: token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          employeeId: admin.employeeId,
          department: admin.department,
          phone: admin.phone,
          status: admin.status
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async getAllAdmins(req, res) {
    try {
      const admins = await Admin.find({});
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async getAdminById(req, res) {
    try {
      const admin = await Admin.findById(req.params.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(200).json(admin);
    } catch (error) {
      // Handle cases like invalid ID format
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

export default adminController;
