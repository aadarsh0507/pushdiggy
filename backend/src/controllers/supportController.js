import SupportRequest from '../models/SupportRequest.js';

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
    const { clientId } = req.query;
    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required.' });
    }
    const requests = await SupportRequest.find({ clientId });
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

    const requests = await SupportRequest.find(filter).populate('clientId');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update support request status (e.g., to resolved)
export const updateSupportRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionDetails, resolvedBy, assignedTo } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updateFields = {
      status,
      ...(resolutionDetails && { resolutionDetails }),
      ...(resolvedBy && { resolvedBy }),
      ...(assignedTo && { assignedTo }),
      resolvedDate: status === 'resolved' ? new Date() : null,
    };

    const updatedRequest = await SupportRequest.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    // ✅ Mark as ready for billing if resolved
    if (status === 'resolved') {
      updatedRequest.readyForBilling = true;
      await updatedRequest.save();
    }

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
