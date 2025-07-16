import Bill from '../models/Bill.js';
import Counter from '../models/Counter.js';
import SupportRequest from '../models/SupportRequest.js';

import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import fs from 'fs';import font from 'pdfmake/build/vfs_fonts.js';
// Import puppeteer-core and the Chrome executable path
import puppeteer from 'puppeteer-core';
import path from 'path';
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

    let billToObject;
    if (client) {
      // If a client ID is provided, fetch the client's details
      const clientDetails = await Client.findById(client);
      if (!clientDetails) {
        return res.status(404).json({ message: 'Client not found' });
      }
      billToObject = {
        name: clientDetails.name,
        address: clientDetails.address,
        gstin: clientDetails.gstin,
      };
    } else {
      // For one-time customers, use the billTo details from the form
      billToObject = billTo;
    }

    const newBill = new Bill({
      subtotal,
      sgst,
      cgst,
      sgstPercent,
      cgstPercent,
      grandTotal,
      date,
      invoiceNumber,
      client: client || undefined, // Store client ID if it exists, otherwise undefined
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
pdfMake.vfs = pdfFonts.vfs;

export const generateInvoicePdf = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('client', 'name address gstin');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
 console.log('Bill found for PDF generation:', bill);
    // Define the document definition for pdfmake

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachmenconst bill = await Bill.findById(req.params.id).populate('client', 'name address gstin'); // Fetch bill to get invoice number for filenamet; filename="invoice_${bill.invoiceNumber}.pdf"`);
    const stream = pdfDoc.getStream();
    stream.pipe(res);
    stream.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const downloadInvoicePdf = async (req, res) => {
  let browser;
  try {
    const bill = await Bill.findById(req.params.id).populate('client', 'name address gstin');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Read logo file and convert to base64
    const logoPath = path.resolve(__dirname, '../../frontend/src/assets/push_diggy_logo.png');
    const logoData = fs.readFileSync(logoPath);
    const base64Logo = Buffer.from(logoData).toString('base64');
    const logoDataUrl = `data:image/png;base64,${base64Logo}`;


    const formatDate = (dateString) => {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };


    // Specify the path to the Chrome executable
    const executablePath = process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome'; // Adjust this path as needed

    // Use puppeteer-core and specify the executable path
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }); // Use this line if running in a constrained environment like a Docker container
    const page = await browser.newPage();

    // Load the received HTML content into the page
    await page.setContent(invoiceHTML, { waitUntil: 'networkidle0' }); // Use networkidle0 to wait for network to be idle

    // await page.emulateMediaType('screen'); // Ensure media type is screen for CSS

    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.setHeader('Content-Type', 'application/pdf'); // Corrected header setting
    // You might want to get the invoice number from the bill data if needed for the filename
    res.setHeader('Content-Disposition', `attachment; filename="invoice_${bill.invoiceNumber}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    if (browser !== undefined) { // Check if browser was initialized
      await browser.close();
    }
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
    const { invoiceNumber, client, subject, items, subtotal, sgst, cgst, grandTotal, date, bankDetails, sgstPercent, cgstPercent, billTo } = req.body;

    const updateData = {
      invoiceNumber,
      subject,
      items,
      subtotal,
      sgst,
      cgst,
      grandTotal,
      date,
      bankDetails,
      sgstPercent,
      cgstPercent,
      client: client || undefined,
      billTo: billTo, // Always update billTo from the form
    };

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      updateData,
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
