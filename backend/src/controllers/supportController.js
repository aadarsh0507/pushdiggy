import SupportRequest from '../models/SupportRequest.js';
import mongoose from 'mongoose';

// Create a new support request
export const createSupportRequest = async (req, res) => {
  try {
    const newRequest = new SupportRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get support requests by client ID
export const getSupportRequestsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required.' });
    }
    console.log('Type of received clientId:', typeof clientId); // Log type of clientId
    console.log('Fetching support requests for client ID:', clientId); // More specific log
    
    let requests;
    try {
      const objectIdClientId = new mongoose.Types.ObjectId(clientId);
      console.log('Attempting to find tickets with clientId as ObjectId:', objectIdClientId);
      requests = await SupportRequest.find({ clientId: objectIdClientId }).populate('assignedTo'); // Explicitly use ObjectId
      console.log('Found requests for client ID:', requests);
    } catch (mongooseError) {
      console.error('Mongoose find error:', mongooseError); // Log Mongoose-specific errors
      return res.status(500).json({ message: 'Error fetching support requests', error: mongooseError.message });
    }

    // Log the clientId of each returned ticket
    requests.forEach(request => {console.log(`Ticket ID: ${request._id}, Ticket ClientId: ${request.clientId}`);});
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all support requests (with optional filters for status / billing)
export const getAllSupportRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.readyForBilling !== undefined) {
      filter.readyForBilling = req.query.readyForBilling === 'true';
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const requests = await SupportRequest.find(filter).populate('clientId').populate('assignedTo');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update support request status and other fields
export const updateSupportRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionDetails, resolvedBy, assignedTo, readyForBilling } = req.body;

    const updateFields = {};

    // Explicitly add fields from req.body if they are present
    if (status !== undefined) updateFields.status = status;
    if (resolutionDetails !== undefined) updateFields.resolutionDetails = resolutionDetails;
    if (resolvedBy !== undefined) updateFields.resolvedBy = resolvedBy;
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;
    const existingRequest = await SupportRequest.findById(id);
    if (!existingRequest) {
 return res.status(404).json({ message: 'Support request not found' });
    }
    if (status === 'resolved' && existingRequest.status !== 'resolved') {
      updateFields.resolvedDate = new Date();
    }

    // Automatically set readyForBilling to true if status is set to 'resolved' and readyForBilling was not provided in the request.
    if (status === 'resolved' && readyForBilling === undefined) {
      updateFields.readyForBilling = true;
    }
    // Prioritize readyForBilling value from the request body if it was provided.
    if (readyForBilling !== undefined) updateFields.readyForBilling = readyForBilling;

 console.log('updateFields before Mongoose update:', updateFields);
    console.log('Updating ticket with ID:', id, 'and fields:', updateFields); // Added log
 console.log('updateFields before Mongoose update:', updateFields);

    const updatedRequest = await SupportRequest.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: true }).populate('clientId');
    await updatedRequest.populate('assignedTo');

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Support request not found' });
    }
 console.log('Result of Mongoose update:', updatedRequest);

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Update error:', error); // Log the full error object
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};