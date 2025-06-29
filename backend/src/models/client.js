import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client' },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
