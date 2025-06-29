import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  features: [String],
  // add other fields as needed
});

export const Service = mongoose.model('Service', ServiceSchema);
