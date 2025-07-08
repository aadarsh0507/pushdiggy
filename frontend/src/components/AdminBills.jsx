import React, { useState } from 'react';
// Assume InvoiceTemplate is imported and available
import InvoiceTemplate from './InvoiceTemplate';

const AdminBills = ({ bills, clients }) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Bills</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                {/* Add more headers if needed */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.length > 0 ? (
 bills.map((bill) => {
                  console.log(bill);
 return (
                  <tr
                    key={bill._id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.date ? new Date(bill.date).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{clients.find(client => client._id === bill.client)?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bill.grandTotal.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
 <button className="px-3 py-1 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mr-4" onClick={() => { setSelectedBill(bill); setShowInvoiceModal(true); }}>View</button>
 <button className="px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700" onClick={() => { /* Add edit logic here */ }}>Edit</button>
                    </td>
                    {/* Add more data cells if needed */}
                  </tr>
 );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showInvoiceModal && selectedBill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Invoice Preview</h3>
            <InvoiceTemplate billData={selectedBill} />
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBills;