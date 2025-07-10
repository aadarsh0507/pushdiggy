import Bill from '../models/Bill.js';
import Counter from '../models/Counter.js';
import SupportRequest from '../models/SupportRequest.js';

import Client from '../models/client.js'; // Import the Client model
export const createBill = async (req, res) => {
  try {
    const { client, subject, items, subtotal, sgst, cgst, grandTotal, date, bankDetails, ticketIds, sgstPercent, cgstPercent, billTo } = req.body;
    console.log('Received bill data in controller:', req.body);

    const currentYear = new Date().getFullYear();

    // Generate invoice number
    const counter = await Counter.findOneAndUpdate(
      { year: currentYear },
      { $inc: { sequenceNumber: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const paddedSequenceNumber = counter.sequenceNumber.toString().padStart(3, '0');
    const invoiceNumber = `${currentYear}${paddedSequenceNumber}`;

    // Fetch client details to get the name
    const clientDetails = await Client.findById(client);

    if (!clientDetails) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Construct the billTo object with client name
    const billToObject = {
      name: clientDetails.name,
      address: billTo.address,
      gstin: billTo.gstin,
    };
    const newBill = new Bill({
      subtotal,
      sgst,
      cgst,
      sgstPercent,
      cgstPercent,
      grandTotal,
      date,
      invoiceNumber,
      client, // Store client ID as a reference
      subject,
      items,
      billTo: billToObject, // Assign the constructed billTo object
      bankDetails,
    });

    console.log('New Bill object before saving:', newBill);
    await newBill.save();

    // Update support ticket billing status
    if (ticketIds && ticketIds.length > 0) {
      console.log('Attempting to update support tickets with IDs:', ticketIds);
      await SupportRequest.updateMany(
        { _id: { $in: ticketIds } },
        { $set: { readyForBilling: false, billed: true, bill: newBill._id } }
      );
      console.log('Support tickets updated successfully.');
    }

    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({}).populate('client', 'name address gstin'); // Populate the 'client' field, selecting only name, address, and gstin
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('client', 'name address gstin'); // Populate the 'client' field
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Bill ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBill = async (req, res) => {
  try {
    const { invoiceNumber, client, subject, items, subtotal, sgst, cgst, grandTotal, date, bankDetails, sgstPercent, cgstPercent } = req.body;

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id, // Use req.params.id to find the bill
      { invoiceNumber, client, subject, items, subtotal, sgst, cgst, grandTotal, date, bankDetails, sgstPercent, cgstPercent }, // Include sgstPercent and cgstPercent in the update object
      { new: true, runValidators: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json(updatedBill);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Bill ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBillsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const bills = await Bill.find({ client: clientId }).populate('client', 'name address gstin');
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};