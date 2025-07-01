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
    type: String,
    default: 'Support Team',
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
}, { timestamps: true });

const SupportRequest = mongoose.model('SupportRequest', supportRequestSchema);

export default SupportRequest;