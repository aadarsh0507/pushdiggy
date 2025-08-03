import ClientService from '../models/ClientService.js';
import multer from 'multer';
import path from 'path';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'image-' + Date.now() + '-' + Math.round(Math.random() * 1000000000) + path.extname(file.originalname));
  }
});

const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all client services
export const getAllClientServices = async (req, res) => {
  try {
    console.log('Fetching all client services');
    const clientServices = await ClientService.find()
      .populate('clientId', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${clientServices.length} client services`);
    res.json(clientServices);
  } catch (error) {
    console.error('Error fetching all client services:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get client services by client ID
export const getClientServicesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required" });
    }
    
    console.log(`Fetching client services for client ID: ${clientId}`);
    const clientServices = await ClientService.find({ 
      clientId: clientId,
      status: { $in: ['active', 'pending'] } // Only show active and pending services
    })
    .populate('assignedBy', 'name email')
    .sort({ assignedDate: -1 });
    
    console.log(`Found ${clientServices.length} services for client ${clientId}`);
    console.log('Client services found:', clientServices.map(s => ({ id: s._id, name: s.name, status: s.status })));
    
    res.json(clientServices);
  } catch (error) {
    console.error('Error fetching client services by client:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Create a new client service
export const createClientService = async (req, res) => {
  try {
    console.log('Creating client service with data:', req.body);
    
    // assignedBy is now optional, so we don't need to validate it
    
    const clientServiceData = {
      ...req.body,
      assignedDate: new Date()
    };
    
    console.log('Final client service data:', clientServiceData);
    
    const newClientService = new ClientService(clientServiceData);
    await newClientService.save();
    
    console.log('Client service created successfully:', newClientService);
    res.status(201).json(newClientService);
  } catch (error) {
    console.error('Error creating client service:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Create multiple client services (for bulk assignment)
export const createMultipleClientServices = async (req, res) => {
  try {
    const { services, clientIds, assignedBy } = req.body;
    
    console.log('Creating multiple client services:', { services, clientIds, assignedBy });
    
    if (!services || !clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      return res.status(400).json({ message: "Services data and client IDs are required" });
    }
    
    const clientServicesToCreate = clientIds.map(clientId => ({
      ...services,
      clientId: clientId,
      assignedBy: assignedBy || req.user?.id,
      assignedDate: new Date()
    }));
    
    const createdServices = await ClientService.insertMany(clientServicesToCreate);
    
    console.log(`Created ${createdServices.length} client services successfully`);
    res.status(201).json(createdServices);
  } catch (error) {
    console.error('Error creating multiple client services:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Upload client service with image
export const uploadClientService = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const clientServiceData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price || 'Contact for pricing',
      features: req.body.features ? req.body.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      category: req.body.category,
      clientId: req.body.clientId,
      assignedBy: req.body.assignedBy || req.user?.id,
      notes: req.body.notes,
      billingCycle: req.body.billingCycle || 'monthly',
      images: [{
        url: imageUrl,
        alt: req.body.name || 'Client Service Image'
      }]
    };
    
    console.log('Creating client service with image:', clientServiceData);
    
    const newClientService = new ClientService(clientServiceData);
    await newClientService.save();
    
    console.log('Client service with image created successfully:', newClientService);
    res.status(201).json(newClientService);
  } catch (error) {
    console.error('Error uploading client service:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Update client service
export const updateClientService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`Updating client service ${id} with data:`, updateData);
    
    // Remove assignedBy from updateData if it's not provided (to avoid overwriting)
    if (!updateData.assignedBy) {
      delete updateData.assignedBy;
    }
    
    const updatedClientService = await ClientService.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedClientService) {
      return res.status(404).json({ message: "Client service not found" });
    }
    
    console.log('Client service updated successfully:', updatedClientService);
    res.json(updatedClientService);
  } catch (error) {
    console.error('Error updating client service:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Delete client service
export const deleteClientService = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Deleting client service ${id}`);
    
    const deletedClientService = await ClientService.findByIdAndDelete(id);
    
    if (!deletedClientService) {
      return res.status(404).json({ message: "Client service not found" });
    }
    
    console.log('Client service deleted successfully:', deletedClientService);
    res.json({ message: "Client service deleted successfully" });
  } catch (error) {
    console.error('Error deleting client service:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get client service by ID
export const getClientServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Fetching client service by ID: ${id}`);
    
    const clientService = await ClientService.findById(id)
      .populate('clientId', 'name email')
      .populate('assignedBy', 'name email');
    
    if (!clientService) {
      return res.status(404).json({ message: "Client service not found" });
    }
    
    console.log('Client service found:', clientService);
    res.json(clientService);
  } catch (error) {
    console.error('Error fetching client service by ID:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Update client service status
export const updateClientServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating client service ${id} status to: ${status}`);
    
    const validStatuses = ['active', 'inactive', 'pending', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be one of: active, inactive, pending, completed" });
    }
    
    const updatedClientService = await ClientService.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedClientService) {
      return res.status(404).json({ message: "Client service not found" });
    }
    
    console.log('Client service status updated successfully:', updatedClientService);
    res.json(updatedClientService);
  } catch (error) {
    console.error('Error updating client service status:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export { uploadMiddleware }; 