import React, { useState, useEffect } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import EditBillModal from './EditBillModal';
import api from '../api/api';
import { Eye, Edit } from 'lucide-react';

const AdminBills = ({ bills, clients, setBills }) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [checkedBills, setCheckedBills] = useState(() => {
    const storedCheckedBills = localStorage.getItem('checkedBills');
    return storedCheckedBills ? new Set(JSON.parse(storedCheckedBills)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('checkedBills', JSON.stringify(Array.from(checkedBills)));
  }, [checkedBills]);

  const fetchBills = async () => {
    try {
      const response = await api.get('/billing/bills'); 
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };
 
  const fetchBillDetails = async (billId) => {
    try {
      const response = await api.get(`/billing/bills/${billId}`); 
      setSelectedBill(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  const handleSaveEditedBill = async (editedBill) => {
    console.log("Attempting to save edited bill:", editedBill);
    try {
      const response = await api.put(`/billing/bills/${editedBill._id}`, editedBill);
      console.log('Bill updated successfully:', response.data);

      setShowEditModal(false);
      fetchBills();
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const handleBillCompletionChange = (billId) => {
    setCheckedBills(prev => new Set(prev.add(billId)));
  };

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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <tr key={bill._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.date ? new Date(bill.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.client?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bill.grandTotal ? bill.grandTotal.toFixed(2) : '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                      <button 
                        className="p-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 mr-2" 
                        onClick={() => { setSelectedBill(bill); setShowInvoiceModal(true); }}
                        title="View Bill"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        className={`p-1 rounded-full text-white bg-green-600 hover:bg-green-700 ${checkedBills.has(bill._id) ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        onClick={() => fetchBillDetails(bill._id)}
                        title="Edit Bill"
                        disabled={checkedBills.has(bill._id)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={checkedBills.has(bill._id)}
                        onChange={() => handleBillCompletionChange(bill._id)}
                        disabled={checkedBills.has(bill._id)}
                        className="ml-4 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        title="Mark as Completed"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-bills">
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
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

      {showEditModal && selectedBill && (
        <EditBillModal
          billData={selectedBill}
          clients={clients}
          onSave={handleSaveEditedBill}
          onClose={() => setShowEditModal(false)}
        />
      )}

    </div>
  );
};

export default AdminBills;