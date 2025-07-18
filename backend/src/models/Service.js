import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  features: [String],
  category: {
    type: String,
    enum: ['camera', 'printer', 'website', 'digital-marketing', 'mobile-app', 'it-consultation', 'general'],
    default: 'general'
  },
  // Category-specific fields
  cameraType: String,
  resolution: String,
  coverage: String,
  printerType: String,
  connectivity: String,
  printSpeed: String,
  websiteType: String,
  technologies: String,
  hosting: String,
  marketingType: String,
  platform: String,
  duration: String,
  technology: String,
  developmentTime: String,
  consultationType: String,
  expertise: String,
  // add other fields as needed
}, { timestamps: true });

export const Service = mongoose.model('Service', ServiceSchema);
