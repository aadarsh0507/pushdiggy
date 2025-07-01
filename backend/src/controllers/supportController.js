import SupportRequest from '../models/SupportRequest.js';

export const createSupportRequest = async (req, res) => {
  try {
    const newRequest = new SupportRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSupportRequestsByClientId = async (req, res) => {
  try {
    const { clientId } = req.query;
    console.log('Received request for support requests with clientId:', clientId);
    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required.' });
    }
    const requests = await SupportRequest.find({ clientId });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find({});
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSupportRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionDetails, resolvedBy } = req.body;

    const updatedRequest = await SupportRequest.findByIdAndUpdate(
      id,
      { status, resolutionDetails, resolvedBy, resolvedDate: status === 'resolved' ? new Date() : null },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};