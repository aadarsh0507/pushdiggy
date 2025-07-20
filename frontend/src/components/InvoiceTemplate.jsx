import React from 'react';
import logo from '../assets/push_diggy_logo.png';
import printJS from 'print-js';

const InvoiceTemplate = ({ billData }) => {
  if (!billData) {
    return <div className="text-center text-gray-500">Loading invoice data...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDownload = () => {
    printJS({
      printable: 'invoice-content-to-print',
      type: 'html',
      base64: false,
      documentTitle: `invoice_${billData.invoiceNumber}`,
      targetStyles: ['*'],
    });
  };

  const printStyles = `
    @media print {
      @page {
        size: A4;
        margin: 15mm;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm;
        height: 297mm;
        font-size: 12px;
      }
      #invoice-content-to-print {
        width: 210mm !important;
        margin: 0 !important;
        padding: 15mm !important;
        box-sizing: border-box !important;
        background: white !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
      }
      .print-table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      .print-table td {
        vertical-align: top !important;
        padding: 0 !important;
        border: none !important;
      }
      .print-header {
        display: table-header-group !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      .print-content {
        display: table-row-group !important;
      }
      .print-content td {
        page-break-inside: auto !important;
      }
      .content-below-header {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        min-height: 0 !important;
      }
      .invoice-table {
        width: 100% !important;
        page-break-inside: auto !important;
        font-size: 10px !important;
      }
      .invoice-table th, .invoice-table td {
        padding: 8px 6px !important;
        font-size: 10px !important;
      }
      .summary-section {
        font-size: 11px !important;
      }
      .footer {
        page-break-inside: avoid !important;
        page-break-before: auto !important;
        margin-top: 20px !important;
      }
      .no-print {
        display: none !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .flex {
        display: flex !important;
      }
      .justify-between {
        justify-content: space-between !important;
      }
      .items-center {
        align-items: center !important;
      }
      .text-right {
        text-align: right !important;
      }
      .text-left {
        text-align: left !important;
      }
      .text-center {
        text-align: center !important;
      }
      .font-bold {
        font-weight: bold !important;
      }
      .font-semibold {
        font-weight: 600 !important;
      }
      .border-b {
        border-bottom: 1px solid #d1d5db !important;
      }
      .border {
        border: 1px solid #d1d5db !important;
      }
      .bg-gray-100 {
        background-color: #f3f4f6 !important;
      }
      .bg-gray-50 {
        background-color: #f9fafb !important;
      }
      .text-gray-800 {
        color: #1f2937 !important;
      }
      .text-gray-700 {
        color: #374151 !important;
      }
      .text-gray-600 {
        color: #4b5563 !important;
      }
      .text-sm {
        font-size: 0.875rem !important;
      }
      .text-xs {
        font-size: 0.75rem !important;
      }
      .text-xl {
        font-size: 1.25rem !important;
      }
      .text-3xl {
        font-size: 1.875rem !important;
      }
      .py-3 {
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
      }
      .px-4 {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      .mt-6 {
        margin-top: 1.5rem !important;
      }
      .mt-8 {
        margin-top: 2rem !important;
      }
      .pb-6 {
        padding-bottom: 1.5rem !important;
      }
      .p-4 {
        padding: 1rem !important;
      }
      .w-1/2 {
        width: 50% !important;
      }
      .h-24 {
        height: 6rem !important;
      }
      .min-w-full {
        min-width: 100% !important;
      }
      .space-y-1 > * + * {
        margin-top: 0.25rem !important;
      }
      .pt-2 {
        padding-top: 0.5rem !important;
      }
      .pr-4 {
        padding-right: 1rem !important;
      }
      .pl-4 {
        padding-left: 1rem !important;
      }
      .mb-2 {
        margin-bottom: 0.5rem !important;
      }
      .break-words {
        word-break: break-word !important;
      }
      .flex-col {
        flex-direction: column !important;
      }
      .items-center {
        align-items: center !important;
      }
      .justify-center {
        justify-content: center !important;
      }
    }
  `;

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-xl mx-auto my-8"
      style={{
        width: '210mm',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        margin: '0 auto',
        padding: '15mm'
      }}
      id="invoice-content-to-print"
    >
      <style>{printStyles}</style>
      
      <table className="print-table" style={{ width: '100%' }}>
        <thead className="print-header">
          <tr>
            <td>
              <div className="flex justify-between items-center border-b pb-6 border-gray-300">
                <div className="flex items-center gap-4">
                  <img src={logo} alt="Logo" className="h-24" style={{ height: '6rem' }}/>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      <span style={{ color: '#2C3E50' }}>PUSH</span> 
                      <span style={{color: '#8B735B'}}>DIGGY</span>
                    </h1>
                    <p className="text-sm text-gray-600">
                      <span style={{ color: '#2C3E50' }}>Solutions</span>
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>Acharapakkam</div>
                  <div><strong>Mobile: </strong>9150690961</div>
                  <div><strong>Email:</strong> pushdiggy@gmail.com</div>
                  <div><strong>GST No:</strong> 96325874125631</div>
                </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody className="print-content">
          <tr>
            <td style={{ verticalAlign: 'top' }}>
              <div className="content-below-header" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%'
              }}>
                <div className="flex justify-between items-start mt-6">
                  <div className="w-1/2">
                    <p className="text-sm font-semibold text-gray-800">Date: {formatDate(billData.date)}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">Invoice No: INV-PDS-{billData.invoiceNumber}</p>
                    {billData.invoiceType && (
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        Type: {billData.invoiceType === 'performa' ? 'Performa Invoice' : 'Invoice'}
                        {billData.performaInvoice && ' (Marked as Performa)'}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <h3 className="text-3xl font-bold text-gray-800 leading-none">
                      {billData.invoiceType === 'performa' ? 'PERFORMA INVOICE' : 'INVOICE'}
                    </h3>
                  </div>
                </div>
                
                <div className="mt-8 border-b pb-6 border-gray-200">
                  <p className="text-base font-semibold text-gray-800">To</p>
                  <p className="text-sm text-gray-700 mt-2">{billData.billTo?.name}</p>
                  <p className="text-sm text-gray-700 mt-1">{billData.billTo?.address}</p>
                  <p className="text-sm text-gray-700 mt-1">GSTIN: {billData.billTo?.gstin}</p>
                </div>
                
                <div className="mt-8">
                  <p className="text-sm font-semibold text-gray-800">Subject: {billData.subject || "N/A"}</p>
                </div>
                
                <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden" style={{ width: '100%' }}>
                  <table className="min-w-full bg-white invoice-table">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">S.NO</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Description</th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Quantity</th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billData.items?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{index + 1}</td>
                          <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{item.description}</td>
                          <td className="py-3 px-4 text-sm text-gray-700 text-center border-b border-gray-200">{item.quantity}</td>
                          <td className="py-3 px-4 text-sm text-gray-700 text-right border-b border-gray-200">₹{parseFloat(item.amount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-gray-50 text-right text-sm text-gray-700 space-y-1">
                    <p>SGST ({billData.sgstPercent || 0}%): ₹{parseFloat(billData.sgst || 0).toFixed(2)}</p>
                    <p>CGST ({billData.cgstPercent || 0}%): ₹{parseFloat(billData.cgst || 0).toFixed(2)}</p>
                    <p className="text-xl font-bold text-gray-800 pt-2">Grand Total: ₹{parseFloat(billData.grandTotal || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 footer">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tr>
                    <td style={{ width: '50%', verticalAlign: 'top', paddingRight: '1rem' }}>
                      <div className="text-sm text-gray-700">
                        <strong>
                          <h4 className="font-semibold text-gray-800 mb-2">Bank Transfer Details</h4>
                          <p className="break-words">Account Name: {billData.bankDetails?.accountName}</p>
                          <p>A/c No: {billData.bankDetails?.accountNumber}</p>
                          <p>IFSC Code: {billData.bankDetails?.ifscCode}</p>
                          <p>Bank: {billData.bankDetails?.bankName}</p>
                          <p>Branch: {billData.bankDetails?.branch}</p>
                        </strong>
                      </div>
                    </td>
                    <td style={{ width: '50%', verticalAlign: 'top', paddingLeft: '1rem', textAlign: 'center' }}>
                      <div className="text-sm text-gray-700" style={{ marginTop: '20px' }}>
                        <p style={{ margin: '0', lineHeight: '1.5' }}>For PD Solutions</p>
                        <p style={{ margin: '80px 0 0 0', lineHeight: '1.5' }}>Authorized Signature</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="text-center mt-8 no-print">
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceTemplate;