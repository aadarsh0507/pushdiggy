import React from 'react';
import logo from '../assets/push_diggy_logo.png';

const InvoiceTemplate = ({ billData }) => {
  if (!billData) {
    console.log("InvoiceTemplate: billData prop is not available yet or is null/undefined.");
    console.log("Type of billData:", typeof billData);
    return <div className="text-center text-gray-500">Loading invoice data...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  console.log("InvoiceTemplate: Received billData prop:", billData);

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-[190mm] mx-auto my-8">
      <div className="flex justify-between items-start border-b pb-6 border-gray-300">
        <div className="flex items-center">
          <img src={logo} alt="PUSH DIGGY Logo" className="h-12 mr-4" />
          <div className="ml-2">
            <h1 className="text-2xl font-bold text-gray-800">PUSH DIGGY</h1>
            <p className="text-sm text-gray-600">Solutions</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>Acharapakkam</p>
          <p>Mobile: 8608706864 | Email: pushdiggy@gmail.com</p>
          <p className="mt-1">GST No: 33CCMEPP16211ZO</p>
        </div>
      </div>

      <div className="flex justify-between items-start mt-6">
        <div className="w-1/2">
          <p className="text-sm font-semibold text-gray-800">Date: {billData.date ? formatDate(billData.date) : 'N/A'}</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">Invoice No: INV-PDS-{billData.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
        </div>
      </div>

      <div className="mt-8 border-b pb-6 border-gray-200">
        <p className="text-base font-semibold text-gray-800">To</p>
        <p className="text-sm text-gray-700 mt-2">{billData.billTo?.name}</p>
        <p className="text-sm text-gray-700 mt-1">{billData.billTo?.address}</p>
        <p className="text-sm text-gray-700 mt-1">GSTIN: {billData.billTo?.gstin}</p>
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-800">Subject: {billData.subject}</p>
      </div>

      <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300 w-1/12">S.NO</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300 w-8/12">Description</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300 w-3/12">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {billData.items && billData.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{index + 1}</td>
                <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{item.description}</td>
                <td className="py-3 px-4 text-sm text-gray-700 text-right border-b border-gray-200">{parseFloat(item.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 bg-gray-50 text-right text-sm text-gray-700 space-y-1">
          <p>
            SGST ({billData.sgstPercent || 0}%): ₹{parseFloat(billData.sgst || 0).toFixed(2)}
          </p>
          <p>
            CGST ({billData.cgstPercent || 0}%): ₹{parseFloat(billData.cgst || 0).toFixed(2)}
          </p>
          <p className="text-xl font-bold text-gray-800 pt-2">
            Grand Total: ₹{parseFloat(billData.grandTotal || 0).toFixed(2)}
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default InvoiceTemplate;