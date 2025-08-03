import mongoose from 'mongoose';

const ClientServiceSchema = new mongoose.Schema({
  // Client who this service is assigned to
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  
  // Service details
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  price: {
    type: String,
    default: 'Contact for pricing'
  },
  
  features: {
    type: [String],
    default: []
  },
  
  category: {
    type: String,
    required: true,
    enum: ['Camera', 'Printer', 'Website', 'Software', 'Hardware', 'Network', 'Security', 'Other'],
    default: 'Other'
  },
  
  // Service status
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'completed'],
    default: 'active'
  },
  
  // Assignment details
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false
  },
  
  assignedDate: {
    type: Date,
    default: Date.now
  },
  
  // Service images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Service Image'
    }
  }],
  
  // Additional metadata
  notes: {
    type: String,
    trim: true
  },
  
  // Billing information
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'one-time'],
    default: 'monthly'
  },
  
  startDate: {
    type: Date,
    default: Date.now
  },
  
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
ClientServiceSchema.index({ clientId: 1, status: 1 });
ClientServiceSchema.index({ category: 1 });
ClientServiceSchema.index({ assignedDate: -1 });

export default mongoose.model('ClientService', ClientServiceSchema); 