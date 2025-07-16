import mongoose from 'mongoose';

const supportRequestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
 ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },

  company: { type: String, required: true, trim: true },
  
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  resolutionDetails: {
    type: String,
  },
  resolvedBy: {
    type: String,
  },
  resolvedDate: {
    type: Date,
  },
  readyForBilling: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const SupportRequest = mongoose.model('SupportRequest', supportRequestSchema);

export default SupportRequest;