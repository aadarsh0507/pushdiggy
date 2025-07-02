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
      joinDate: new Date(),
      amc: amc || false,
      status: 'enquiry',
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
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
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
    const { name, email, phone, amc, company } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update fields if they exist in the request
    if (name) client.name = name;
    if (email) client.email = email;
    if (phone) client.phone = phone;
    if (company) client.company = company;
    
    // Explicitly check for amc in request body (can be false)
    if ('amc' in req.body) {
      client.amc = Boolean(amc);
      console.log(`Updated AMC status to: ${client.amc}`);
    }

    await client.save();

    res.status(200).json({
      message: 'Client updated successfully',
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        amc: client.amc,
        status: client.status
      }
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateClientStatus = async (req, res) => {
  try {
    const clientId = req.params.id;
    const { status, inactiveDate } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.status = status;
    if (status === 'inactive' && inactiveDate) {
      client.inactiveDate = new Date(inactiveDate);
    } else if (status === 'active') {
      client.inactiveDate = null;
    }

    await client.save();

    res.status(200).json({
      message: 'Client status updated successfully',
      client: {
        id: client._id,
        status: client.status,
        inactiveDate: client.inactiveDate
      }
    });
  } catch (error) {
    console.error('Error updating client status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};