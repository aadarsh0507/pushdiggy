import Bill from '../models/Bill.js';

export const createBill = async (req, res) => {
  try {
    const { invoiceNumber, client, subject, items, subtotal, gst, grandTotal, date, bankDetails } = req.body;
    console.log('Received bill data in controller:', req.body);

    const newBill = new Bill({
      invoiceNumber,
      client,
      subject,
      items,
      subtotal,
      gst,
      grandTotal,
      date,
      bankDetails,
    });
    console.log('New Bill object before saving:', newBill);

    await newBill.save();

    console.log('Bill saved successfully:', newBill);
    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};