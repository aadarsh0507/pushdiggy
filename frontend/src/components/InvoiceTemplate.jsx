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
        margin: 10mm;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm;
        height: 297mm;
      }
      #invoice-content-to-print {
        width: 210mm !important;
        margin: 0 !important;
        padding: 10mm !important;
        box-sizing: border-box !important;
        background: white !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      .print-table {
        width: 100% !important; /* Ensure the main table takes full width */
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
      /* Target the main content TD and its direct children divs for full width */
      .print-content > tr > td[style*="vertical-align: top"] {
        width: 100% !important;
      }
      .print-content > tr > td[style*="vertical-align: top"] > div {
        width: 100% !important;
      }
      .invoice-table {
        width: 100% !important; /* Ensure the invoice items table takes full width */
        page-break-inside: auto !important;
      }
      .invoice-table tr {
        page-break-inside: avoid !important;
      }
      .footer {
        page-break-inside: avoid !important;
        page-break-before: auto !important;
      }
      .no-print {
        display: none !important;
      }
      .invoice-table {
        width: 100% !important; /* Redundant but good for specificity */
        font-size: 10px !important;
      }
      .invoice-table th, .invoice-table td {
        padding: 6px 8px !important;
      }
      .summary-section {
        font-size: 11px !important;
      }
      /* Ensure flex containers within table cells also take full width */
      .print-content td > div {
        width: 100% !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  `;

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-xl mx-auto my-8"
      style={{
        width: '210mm',
        boxSizing: 'border-box',
 minHeight: '297mm',
        backgroundColor: 'white'
      }}
      id="invoice-content-to-print"
    >
      <style>{printStyles}</style>
      
      <table className="print-table">
        <thead className="print-header" style={{ minHeight: '277mm' }}>
          <tr>
            <td>
              <div className="flex justify-between items-center border-b pb-6 border-gray-300">
                <div className="flex items-center gap-4">
                  <img src={logo} alt="Logo" className="h-24"/>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800"><span style={{ color: '#2C3E50' }}>PUSH</span> <span style={{color: '	#8B735B'}}>DIGGY</span></h1>
                    <p className="text-sm text-gray-600"><span style={{ color: '#2C3E50' }}>Solutions</span></p>
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
            <td style={{ verticalAlign: 'top', height: '100%' }}>
              {/* Main Content */}
              <div className="content-below-header" style={{ minHeight: '180mm', display: 'flex', flexDirection: 'column', width: '100%' }}> {/* Added width: '100%' and class 'content-below-header' */}
                <div className="flex justify-between items-start mt-6">
                  <div className="w-1/2">
                    <p className="text-sm font-semibold text-gray-800">Date: {formatDate(billData.date)}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">Invoice No: INV-PDS-{billData.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-3xl font-bold text-gray-800 leading-none">INVOICE</h3>
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
                <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden" style={{ width: '100%' }}> {/* Added width: '100%' */}
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
                
                {/* Spacer to push footer down */}
                <div style={{ flex: 1, minHeight: '40mm' }}></div>
              </div>
              
              {/* FOOTER */}
              <div className="flex justify-between items-start mt-8 footer">
                <div className="text-sm text-gray-700 w-1/2 pr-4">
                  <strong>
                    <h4 className="font-semibold text-gray-800 mb-2">Bank Transfer Details</h4>
                    <p className="break-words">Account Name: {billData.bankDetails?.accountName}</p>
                    <p>A/c No: {billData.bankDetails?.accountNumber}</p>
                    <p>IFSC Code: {billData.bankDetails?.ifscCode}</p>
                    <p>Bank: {billData.bankDetails?.bankName}</p>
                    <p>Branch: {billData.bankDetails?.branch}</p>
                  </strong>
                </div>
                <div className="text-center text-sm text-gray-700 w-1/2 pl-4 flex flex-col items-center justify-center">
                  <div style={{ marginTop: '20px' }}>
                    <p>For PD Solutions</p>
                    <p style={{ marginTop: '40px' }}>Authorized Signature</p>
                  </div>
                </div>
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