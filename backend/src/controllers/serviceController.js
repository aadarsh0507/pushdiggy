import { Service } from '../models/Service.js';

export const getAllServices = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};

export const createService = async (req, res) => {
  const newService = new Service(req.body);
  await newService.save();
  res.status(201).json(newService);
};
