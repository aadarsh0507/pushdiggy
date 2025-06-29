import Client from '../models/client.js';
import bcrypt from 'bcryptjs';

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
    const client = new Client({
      name,
      email,
      password: hashedPassword,
      phone,
      joinDate: new Date(), // <-- Add this line if you want to set explicitly
    });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Only find clients
    const client = await Client.findOne({ email, role: 'client' });
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }
    if (client.status !== 'active') {
      return res.status(403).json({ message: "Your account is deactivated. Please contact support." });
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
        company: client.company,
        role: client.role,
        status: client.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getAllClients = async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
};

export const updateClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const client = await Client.findByIdAndUpdate(id, { status }, { new: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};