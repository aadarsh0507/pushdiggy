import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

const adminController = {
  async registerAdmin(req, res) {
    try {
      const { name, email, password, employeeId, department, role, phone } = req.body;

      if (!name || !email || !password || !employeeId || !department || !role || !phone) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({ message: "Admin already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Registering admin:', { email, password, hashedPassword });

      // Create new admin
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        employeeId,
        department,
        role: "admin", // always admin
        designation: role, // store user-typed value as designation
        phone
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
          designation: newAdmin.designation, // include in response
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

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        message: "Admin logged in successfully.",
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          employeeId: admin.employeeId,
          department: admin.department,
          role: admin.role,
          phone: admin.phone
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  }
};

export default adminController;
