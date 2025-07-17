import SupportRequest from '../models/SupportRequest.js';
import mongoose from 'mongoose';
import SupportTicketCounter from '../models/SupportTicketCounter.js';
import Admin from '../models/admin.js';

// Create a new support request
export const createSupportRequest = async (req, res) => {
  try {
    // Generate unique ticket number
    // Use findOneAndUpdate to get the updated counter value
    const counter = await SupportTicketCounter.findByIdAndUpdate(
      { _id: 'supportTicket' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    const ticketNumber = `TKPD${counter.sequence_value.toString().padStart(3, '0')}`;
    const newRequest = new SupportRequest({
      ...req.body,
      ticketNumber: ticketNumber,
    });

    console.log('New request object before saving:', newRequest);
    await newRequest.save();
    console.log('New request object after saving:', newRequest);
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
      requests = await SupportRequest.find({ clientId: objectIdClientId }).populate('assignedTo').populate('billingReadyBy'); // Explicitly use ObjectId
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

    const requests = await SupportRequest.find(filter).populate('clientId').populate('assignedTo').populate('billingReadyBy');
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
    // Handle assignedTo: convert to ObjectId if it's a valid ID, otherwise set to null
    if (assignedTo !== undefined) {
      if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
 updateFields.assignedTo = new mongoose.Types.ObjectId(assignedTo);
      } else {
 updateFields.assignedTo = null; // Set to null if assignedTo is empty, null, or not a valid ObjectId
      }
    }
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

// Toggle billing ready status for a specific admin
export const toggleBillingReadyStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adminId } = req.body;

    console.log('Toggle billing ready request received');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Extracted values:', { ticketId, adminId });

    // Validate adminId
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Verify admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Find the ticket
    const ticket = await SupportRequest.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    // Check if this admin has already marked it as billing ready
    const isCurrentlyReady = ticket.billingReadyBy && ticket.billingReadyBy.toString() === adminId;

    let updateFields = {};

    if (isCurrentlyReady) {
      // Admin is unmarking it as billing ready
      updateFields = {
        billingReadyBy: null,
        billingReadyAt: null,
        isBillingReady: false
      };
    } else {
      // Admin is marking it as billing ready
      updateFields = {
        billingReadyBy: adminId,
        billingReadyAt: new Date(),
        isBillingReady: true
      };
    }

    console.log('Updating ticket with fields:', updateFields);

    const updatedTicket = await SupportRequest.findByIdAndUpdate(
      ticketId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('clientId').populate('assignedTo').populate('billingReadyBy');

    console.log('Updated ticket:', updatedTicket);

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error('Toggle billing ready error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};