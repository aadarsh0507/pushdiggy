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
      printable: 'invoice-container',
      type: 'html',
      base64: false,
      documentTitle: `invoice_${billData.invoiceNumber}`,
      targetStyles: ['*'],
    });
  };

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-xl w-[210mm] mx-auto my-8"
      id="invoice-container"
    >
      <style>{`
        @media print {
          body > *:not(#invoice-container) {
            display: none !important;
          }
          #invoice-container {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            padding: 10mm 15mm !important;
          }

          .print-visible {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
          }

          .print-visible img {
            height: 48px !important;
          }

          .print-visible h1 {
            margin: 0 !important;
            font-size: 20px !important;
            line-height: 1.2 !important;
          }

          .print-visible p {
            margin: 0 !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
            word-break: break-word !important;
          }

          .text-right.text-sm.text-gray-600 {
            text-align: right !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 2px !important;
          }

          table, .mt-8 {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="flex justify-between items-start border-b pb-6 border-gray-300 print-visible">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12" />
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-gray-800">PUSH DIGGY</h1>
            <p className="text-sm text-gray-600">Solutions</p>
          </div>
        </div>

        <div className="text-right text-sm text-gray-600 space-y-1">
          <p>Acharapakkam</p>
          <p>Mobile: 9150690961</p>
 <div className="email-display">
 <p>Email: pushdiggy@gmail.com</p>
 </div>
 <div className="gstin-display">
 <p>GST No: 9632587412563</p>
 </div>
        </div>
      </div>

      {/* DATE + INVOICE */}
      <div className="flex justify-between items-start mt-6">
        <div className="w-1/2">
          <p className="text-sm font-semibold text-gray-800">
            Date: {formatDate(billData.date)}
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            Invoice No: INV-PDS-{billData.invoiceNumber}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
        </div>
      </div>

      {/* BILL TO */}
      <div className="mt-8 border-b pb-6 border-gray-200">
        <p className="text-base font-semibold text-gray-800">To</p>
        <p className="text-sm text-gray-700 mt-2">{billData.billTo?.name}</p>
        <p className="text-sm text-gray-700 mt-1">{billData.billTo?.address}</p>
        <p className="text-sm text-gray-700 mt-1">GSTIN: {billData.billTo?.gstin}</p>
      </div>

      {/* SUBJECT */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-800">
          Subject: {billData.subject || 'N/A'}
        </p>
      </div>

      {/* TABLE */}
      <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300 w-1/12">
                S.NO
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300 w-8/12">
                Description
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300 w-3/12">
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {billData.items?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{index + 1}</td>
                <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{item.description}</td>
                <td className="py-3 px-4 text-sm text-gray-700 text-right border-b border-gray-200">
                  ₹{parseFloat(item.amount || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 bg-gray-50 text-right text-sm text-gray-700 space-y-1">
          <p>SGST ({billData.sgstPercent || 0}%): ₹{parseFloat(billData.sgst || 0).toFixed(2)}</p>
          <p>CGST ({billData.cgstPercent || 0}%): ₹{parseFloat(billData.cgst || 0).toFixed(2)}</p>
          <p className="text-xl font-bold text-gray-800 pt-2">
            Grand Total: ₹{parseFloat(billData.grandTotal || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-start mt-8">
        <div className="text-sm text-gray-700 w-1/2 pr-4">
          <h4 className="font-semibold text-gray-800 mb-2">Bank Transfer Details</h4>
          <p>Account Name: {billData.bankDetails?.accountName}</p>
          <p>A/c No: {billData.bankDetails?.accountNumber}</p>
          <p>IFSC Code: {billData.bankDetails?.ifscCode}</p>
          <p>Bank: {billData.bankDetails?.bankName}</p>
          <p>Branch: {billData.bankDetails?.branch}</p>
        </div>
        <div className="text-center text-sm text-gray-700 w-1/2 pl-4">
          <p>For PD Solutions</p>
        </div>
      </div>

      {/* Print Button - Hidden in Print */}

      {/* Add inline style to hide in print */}
      <style>{` @media print { .no-print { display: none !important; } } `}</style>

      <div className="text-center mt-8">
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-print"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
