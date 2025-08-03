import { Service } from '../models/Service.js'; // Assuming default export
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname || 'image';
    const extension = path.extname(originalName) || '.jpg';
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Check MIME type - more lenient check
    const isImageMimeType = file.mimetype.startsWith('image/');
    
    if (allowedExtensions.includes(fileExtension) && isImageMimeType) {
      return cb(null, true);
    } else {
      return cb(new Error(`Only image files are allowed! Received: ${file.mimetype} with extension: ${fileExtension}`));
    }
  }
});

export const uploadMiddleware = upload.single('image');

// Helper function to extract filename from URL
const getFilenameFromUrl = (url) => {
  if (!url) return null;
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
};

// Helper function to delete image files
const deleteImageFiles = (images) => {
  if (!images || !Array.isArray(images)) return;
  
  images.forEach(image => {
    if (image.url) {
      const filename = getFilenameFromUrl(image.url);
      if (filename) {
        const filePath = path.join('uploads', filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
          }
        }
      }
    }
  });
};

// Helper function to find images that were removed
const findRemovedImages = (oldImages, newImages) => {
  if (!oldImages || !newImages) return [];
  
  const oldUrls = oldImages.map(img => img.url);
  const newUrls = newImages.map(img => img.url);
  
  return oldImages.filter(img => !newUrls.includes(img.url));
};

export const getAllServices = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    const services = await Service.find(query);
    console.log('All services requested, returning:', services.length, 'services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getServicesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required' });
    }
    
    const services = await Service.find({ clientId: clientId });
    console.log(`Services requested for client ${clientId}, returning:`, services.length, 'services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const uploadService = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Check if this is just an image upload (for adding to existing service)
    if (req.body.isImageUpload === 'true') {
      // Just return the image URL for adding to existing service
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-production-domain.com' 
        : `${req.protocol}://${req.get('host')}`;
      const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      
      console.log('Image uploaded for existing service:', imageUrl);
      
      res.status(200).json({
        url: imageUrl,
        filename: req.file.filename
      });
      return;
    }

    // Validate required fields for creating new service
    if (!req.body.name || !req.body.description || !req.body.category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }

    // Create image URL from uploaded file
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log('Generated image URL:', imageUrl);
    
    // Create service with uploaded image
    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price || 'Contact for pricing',
      features: req.body.features || 'Service',
      category: req.body.category,
      images: [{
        url: imageUrl,
        title: req.body.name,
        description: req.body.description,
        tags: [req.body.category, 'service']
      }]
    };

    const newService = new Service(serviceData);
    await newService.save();
    
    console.log('New service created:', newService);
    res.status(201).json(newService);
  } catch (error) {
    console.error('Upload service error:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    // Get the current service to compare images
    const currentService = await Service.findById(req.params.id);
    if (!currentService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Find images that were removed
    const removedImages = findRemovedImages(currentService.images, req.body.images || []);
    
    // Update the service
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    // Delete the removed image files
    deleteImageFiles(removedImages);
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    // Get the service first to access its images
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    // Delete associated image files
    deleteImageFiles(service.images);
    
    // Delete the service from database
    await Service.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
