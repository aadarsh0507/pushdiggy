import bcrypt from 'bcryptjs';
import Client from '../models/client.js';

export const registerClient = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Client already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newClient = new Client({ name, email, password: hashedPassword, phone });
    await newClient.save();
    res.status(201).json({ message: "Client registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    res.status(200).json({
      success: true,
      message: "Client logged in successfully.",
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: client.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
