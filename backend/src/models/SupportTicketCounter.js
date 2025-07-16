import mongoose from 'mongoose';

const supportTicketCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const SupportTicketCounter = mongoose.model('SupportTicketCounter', supportTicketCounterSchema);

export default SupportTicketCounter;