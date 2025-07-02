import Client from '../models/client.js';
import bcrypt from 'bcryptjs';

export const registerClient = async (req, res) => {
  try {
    const { name, email, password, phone, amc } = req.body;
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
      amc: amc || false, // Add default or provided AMC status
      status: 'enquiry', // Set default status to enquiry
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

export const getClientById = async (req, res) => {
  try {
    console.log('Fetching client with ID:', req.params.id);
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const updateData = req.body; // Data to update the client with

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update client document with data from req.body
    Object.assign(client, updateData);

    await client.save();

    res.status(200).json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateClientStatus = async (req, res) => {
  try {
    const clientId = req.params.id;
    const { status, inactiveDate } = req.body; // Extract status and inactiveDate

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.status = status;
    if (status === 'inactive' && inactiveDate) {
      client.inactiveDate = new Date(inactiveDate); // Save the inactiveDate
    } else if (status === 'active') {
      client.inactiveDate = null; // Clear inactiveDate if status is active
    }


    await client.save();

    res.status(200).json(client);
  } catch (error) {
    console.error('Error updating client status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};