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
pdfMake.vfs = pdfFonts.vfs;

export const generateInvoicePdf = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('client', 'name address gstin');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
 console.log('Bill found for PDF generation:', bill);
    // Define the document definition for pdfmake
    const documentDefinition = {
      content: [
        // Company Details
        { text: 'PUSH DIGGY', style: 'header' },
        { text: 'Solutions', style: 'subheader' },
        { text: 'Acharapakkam', alignment: 'right' },
        { text: 'Mobile: 8608706864 | Email: pushdiggy@gmail.com', alignment: 'right' },
        { text: 'GST No: 33CCMEPP16211ZO', alignment: 'right', margin: [0, 0, 0, 20] },

        // Invoice Details
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: `Date: ${bill.date ? new Date(bill.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}`, style: 'invoiceInfo' },
                { text: `Invoice No: INV-PDS-${bill.invoiceNumber}`, style: 'invoiceInfo' },
              ],
            },
            {
              width: '50%',
              text: 'INVOICE',
              style: 'invoiceTitle',
              alignment: 'right',
            },
          ],
          margin: [0, 20, 0, 20]
        },

        // Bill To
        { text: 'Bill To:', style: 'sectionHeader' },
        { text: bill.billTo?.name, style: 'billToInfo' },
        { text: bill.billTo?.address, style: 'billToInfo' },
        { text: `GSTIN: ${bill.billTo?.gstin}`, style: 'billToInfo', margin: [0, 0, 0, 20] },

        // Subject
        { text: `Subject: ${bill.subject}`, style: 'subject', margin: [0, 0, 0, 20] },

        // Items Table
        {
          table: {
            widths: ['10%', '60%', '30%'],
            body: [
              // Table Header
              [{ text: 'S.NO', style: 'tableHeader' }, { text: 'Description', style: 'tableHeader' }, { text: 'Amount (₹)', style: 'tableHeader', alignment: 'right' }],
              // Table Rows
              ...(bill.items && bill.items.length > 0 ? bill.items.map((item, index) => [
                { text: index + 1, style: 'tableCell' },
                { text: item.description, style: 'tableCell' },
                { text: parseFloat(item.amount || 0).toFixed(2), style: 'tableCell', alignment: 'right' },
              ]) : [[{ text: 'No items listed', colSpan: 3, alignment: 'center', style: 'tableCell' }, {}, {}]]),
            ],
          },
          layout: {
            hLineWidth: function (i, node) { return (i === 0 || i === node.table.body.length) ? 2 : 1; },
            vLineWidth: function (i, node) { return (i === 0 || i === node.table.widths.length) ? 2 : 1; },
            hLineColor: function (i, node) { return (i === 0 || i === node.table.body.length) ? '#000' : '#ccc'; },
            vLineColor: function (i, node) { return (i === 0 || i === node.table.widths.length) ? '#000' : '#ccc'; },
            paddingLeft: function(i, node) { return 8; },
            paddingRight: function(i, node) { return 8; },
            paddingTop: function(i, node) { return 5; },
            paddingBottom: function(i, node) { return 5; },
          },
          margin: [0, 0, 0, 20]
        },

        // Totals
        {
          columns: [
            { width: '70%', text: '' },
            {
              width: '30%',
              table: {
                body: [
                  [{ text: `SGST (${bill.sgstPercent || 0}%)`, style: 'totalsLabel' }, { text: `₹${parseFloat(bill.sgst || 0).toFixed(2)}`, style: 'totalsValue', alignment: 'right' }],
                  [{ text: `CGST (${bill.cgstPercent || 0}%)`, style: 'totalsLabel' }, { text: `₹${parseFloat(bill.cgst || 0).toFixed(2)}`, style: 'totalsValue', alignment: 'right' }],
                  [{ text: 'Grand Total', style: 'grandTotalLabel' }, { text: `₹${parseFloat(bill.grandTotal || 0).toFixed(2)}`, style: 'grandTotalValue', alignment: 'right' }],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 0, 0, 20]
        },

        // Bank Details
        { text: 'Bank Transfer Details', style: 'sectionHeader' },
        { text: `Account Name: ${bill.bankDetails?.accountName}`, style: 'bankDetails' },
        { text: `A/c No: ${bill.bankDetails?.accountNumber}`, style: 'bankDetails' },
        { text: `IFSC Code: ${bill.bankDetails?.ifscCode}`, style: 'bankDetails' },
        { text: `Bank: ${bill.bankDetails?.bankName}`, style: 'bankDetails' },
        { text: `Branch: ${bill.bankDetails?.branch}`, style: 'bankDetails', margin: [0, 0, 0, 40] },

        { text: 'For PD Solutions', alignment: 'right', style: 'signature' },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 5] },
        subheader: { fontSize: 14, margin: [0, 0, 0, 15] },
        invoiceInfo: { fontSize: 10, margin: [0, 2, 0, 2] },
        invoiceTitle: { fontSize: 24, bold: true },
        sectionHeader: { fontSize: 12, bold: true, margin: [0, 15, 0, 5] },
        billToInfo: { fontSize: 10, margin: [0, 2, 0, 2] },
        subject: { fontSize: 10, fontStyle: 'italic' },
        tableHeader: { bold: true, fontSize: 10, color: 'black' },
        tableCell: { fontSize: 9, margin: [0, 2, 0, 2] },
        totalsLabel: { fontSize: 10 },
        totalsValue: { fontSize: 10 },
        grandTotalLabel: { fontSize: 12, bold: true },
        grandTotalValue: { fontSize: 12, bold: true },
        bankDetails: { fontSize: 9, margin: [0, 2, 0, 2] },
        signature: { fontSize: 10, margin: [0, 20, 0, 0] },
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    // Create the PDF
    const pdfDoc = pdfMake.createPdf(documentDefinition);

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

    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${bill.invoiceNumber}</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .container { width: 190mm; margin: 0 auto; background-color: #fff; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; }
              .flex-container { display: flex; justify-content: space-between; align-items: flex-start; }
              .flex-item { flex: 1; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              .text-sm { font-size: 12px; }
              .text-base { font-size: 14px; }
              .text-xl { font-size: 20px; }
              .text-2xl { font-size: 24px; }
              .text-3xl { font-size: 30px; }
              .font-bold { font-weight: bold; }
              .font-semibold { font-weight: 600; }
              .text-gray-600 { color: #4b5563; }
              .text-gray-700 { color: #374151; }
              .text-gray-800 { color: #1f2937; }
              .border-b { border-bottom: 1px solid #e5e7eb; }
              .border-gray-300 { border-color: #d1d5db; }
              .pb-6 { padding-bottom: 24px; }
              .mt-6 { margin-top: 24px; }
              .mt-8 { margin-top: 32px; }
              .mb-2 { margin-bottom: 8px; }
              .pt-2 { padding-top: 8px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; }
              th { background-color: #f3f4f6; font-weight: bold; font-size: 10px; text-transform: uppercase; color: #4b5563; }
              td { font-size: 12px; color: #374151; }
              .text-right td, .text-right th { text-align: right; }
              .border { border: 1px solid #d1d5db; }
              .rounded-lg { border-radius: 8px; }
              .overflow-hidden { overflow: hidden; }
              .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 4px; }
              .pr-4 { padding-right: 16px; }
              .pl-4 { padding-left: 16px; }
              .w-1/2 { width: 50%; }
              .w-1\/12 { width: 8.333333%; }
              .w-8\/12 { width: 66.666667%; }
              .w-3\/12 { width: 25%; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="flex-container border-b pb-6 border-gray-300">
                  <div class="flex-item" style="display: flex; align-items: center;">
                      <img src="${logoDataUrl}" alt="PUSH DIGGY Logo" style="height: 48px; margin-right: 16px;" />
                      <div>
                          <h1 class="text-2xl font-bold text-gray-800">PUSH DIGGY</h1>
                          <p class="text-sm text-gray-600">Solutions</p>
                      </div>
                  </div>
                  <div class="flex-item text-right text-sm text-gray-600">
                      <p>Acharapakkam</p>
                      <p>Mobile: 8608706864 | Email: pushdiggy@gmail.com</p>
                      <p class="mt-1">GST No: 33CCMEPP16211ZO</p>
                  </div>
              </div>

              <div class="flex-container mt-6">
                  <div class="flex-item w-1/2">
                      <p class="text-sm font-semibold text-gray-800">Date: ${bill.date ? formatDate(bill.date) : 'N/A'}</p>
                      <p class="text-sm font-semibold text-gray-800 mt-1">Invoice No: INV-PDS-${bill.invoiceNumber}</p>
                  </div>
                  <div class="flex-item text-right">
                      <h2 class="text-3xl font-bold text-gray-800">INVOICE</h2>
                  </div>
              </div>

              <div class="mt-8 border-b pb-6 border-gray-200">
                  <p class="text-base font-semibold text-gray-800">To</p>
                  <p class="text-sm text-gray-700 mt-2">${bill.billTo?.name || ''}</p>
                  <p class="text-sm text-gray-700 mt-1">${bill.billTo?.address || ''}</p>
                  <p class="text-sm text-gray-700 mt-1">GSTIN: ${bill.billTo?.gstin || ''}</p>
              </div>

              <div class="mt-8">
                  <p class="text-sm font-semibold text-gray-800">Subject: ${bill.subject || 'N/A'}</p>
              </div>

              <div class="mt-8 border border-gray-300 rounded-lg overflow-hidden">
                  <table>
                      <thead>
                          <tr>
                              <th class="w-1\/12">S.NO</th>
                              <th class="w-8\/12">Description</th>
                              <th class="w-3\/12 text-right">Amount (₹)</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${bill.items && bill.items.length > 0 ? bill.items.map((item, index) => `
                          <tr>
                              <td>${index + 1}</td>
                              <td>${item.description}</td>
                              <td class="text-right">${parseFloat(item.amount || 0).toFixed(2)}</td>
                          </tr>
                          `).join('') : `
                          <tr>
                              <td colspan="3" class="text-center">No items listed</td>
                          </tr>
                          `}
                      </tbody>
                  </table>

                  <div class="p-4 bg-gray-50 text-right text-sm text-gray-700 space-y-1" style="background-color: #f9fafb; padding: 16px;">
                      <p>
                          SGST (${bill.sgstPercent || 0}%): ₹${parseFloat(bill.sgst || 0).toFixed(2)}
                      </p>
                      <p>
                          CGST (${bill.cgstPercent || 0}%): ₹${parseFloat(bill.cgst || 0).toFixed(2)}
                      </p>
                      <p class="text-xl font-bold text-gray-800 pt-2">
                          Grand Total: ₹${parseFloat(bill.grandTotal || 0).toFixed(2)}
                      </p>
                  </div>
              </div>

              <div class="flex-container mt-8">
                  <div class="flex-item text-sm text-gray-700 w-1/2 pr-4">
                      <h4 class="font-semibold text-gray-800 mb-2">Bank Transfer Details</h4>
                      <p>Account Name: ${bill.bankDetails?.accountName || ''}</p>
                      <p>A/c No: ${bill.bankDetails?.accountNumber || ''}</p>
                      <p>IFSC Code: ${bill.bankDetails?.ifscCode || ''}</p>
                      <p>Bank: ${bill.bankDetails?.bankName || ''}</p>
                      <p>Branch: ${bill.bankDetails?.branch || ''}</p>
                  </div>

                  <div class="flex-item text-center text-sm text-gray-700 w-1/2 pl-4">
                      <p>For PD Solutions</p>
                      <div style="margin-top: 40px;"></div> <!-- Placeholder for signature line -->
                  </div>
              </div>

              <div class="text-center mt-8">
                  <!-- The download button is handled by the frontend -->
              </div>
          </div>
      </body>
      </html>
    `;
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