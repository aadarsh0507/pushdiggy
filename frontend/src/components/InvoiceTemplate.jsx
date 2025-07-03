jsx
import React from 'react';

const InvoiceTemplate = ({ billData }) => {
  if (!billData) {
    return <div className="text-center text-gray-500">Loading invoice data...</div>;
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6 border-gray-300">
        <div className="flex items-center">
          {/* Replace with your actual logo */}
          <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
            AP
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AP Solutions</h1>
            <p className="text-sm text-gray-600">Technology Forward. Always.</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>250/3 Kampanur Road, NGO Nagar</p>
          <p>Pachal, Tirupattur - 635601, Tirupattur Dist</p>
          <p>Mobile: 9894564967 | Email: info@apsolutions.com</p>
          <p>Website: www.apsolutions.com</p>
          <p className="mt-1">GST No: 33CCMEPP16211ZO</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between items-start mt-6">
        <div>
          <p className="text-sm font-semibold text-gray-800">Date: {formatDate(billData.date)}</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">Invoice No: INV-APS-{billData.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
        </div>
      </div>

      {/* Bill To */}
      <div className="mt-8 border-b pb-6 border-gray-200">
        <p className="text-sm font-semibold text-gray-800">To</p>
        <p className="text-sm text-gray-700 mt-1">{billData.billTo?.name}</p>
        <p className="text-sm text-gray-700">{billData.billTo?.address}</p>
        <p className="text-sm text-gray-700 mt-1">GSTIN: {billData.billTo?.gstin}</p>
      </div>

      {/* Subject */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-800">Subject: {billData.subject}</p>
      </div>

      {/* Items Table */}
      <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                #
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                Description
              </th>
              <th className="py-3 px-4 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {billData.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{index + 1}</td>
                <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{item.description}</td>
                <td className="py-3 px-4 text-sm text-gray-700 text-right border-b border-gray-200">{parseFloat(item.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 text-right text-sm text-gray-700">
          <p className="font-semibold">Subtotal: ₹{parseFloat(billData.subtotal || 0).toFixed(2)}</p>
          <p className="mt-1">GST ({billData.gstRate || '18'}%): ₹{parseFloat(billData.gst || 0).toFixed(2)}</p>
          <p className="mt-2 text-lg font-bold text-gray-800">Grand Total: ₹{parseFloat(billData.grandTotal || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Bank Transfer Details */}
      <div className="mt-8 text-sm text-gray-700">
        <h4 className="font-semibold text-gray-800 mb-2">Bank Transfer Details</h4>
        <p>Account Name: {billData.bankDetails?.accountName}</p>
        <p>A/c No: {billData.bankDetails?.accountNumber}</p>
        <p>IFSC Code: {billData.bankDetails?.ifscCode}</p>
        <p>Bank: {billData.bankDetails?.bankName}</p>
        <p>Branch: {billData.bankDetails?.branch}</p>
      </div>

      {/* Authorization */}
      <div className="mt-12 flex justify-end pr-8">
        <div className="text-center text-sm text-gray-700">
          <p>For AP Solutions</p>
          {/* Replace with your actual signature image or placeholder */}
          <div className="mt-4 h-16 w-40 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-500 text-xs italic">
            [Signature Area]
          </div>
          <p className="mt-2 border-t border-gray-400 pt-1 font-semibold">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;