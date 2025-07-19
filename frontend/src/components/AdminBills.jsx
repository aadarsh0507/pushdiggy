import React, { useState, useEffect } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import EditBillModal from './EditBillModal';
import api from '../api/api';
import { Eye, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminBills = ({ bills, clients, setBills }) => {
  const { user } = useAuth();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [updatingBills, setUpdatingBills] = useState(new Set());

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

  const handleBillCompletionChange = async (billId, isCompleted) => {
    // Prevent multiple clicks
    if (updatingBills.has(billId)) return;
    
    try {
      setUpdatingBills(prev => new Set(prev).add(billId));
      console.log('Updating bill completion:', { billId, isCompleted, adminId: user.id });
      
      const requestData = {
        adminId: user.id,
        isCompleted: isCompleted
      };
      
      console.log('Sending request to:', `/billing/bills/${billId}/completion`);
      console.log('Request data:', requestData);
      
      const response = await api.put(`/billing/bills/${billId}/completion`, requestData);
      
      console.log('Completion update response:', response.data);
      
      // Update the bills list with the updated bill
      if (setBills) {
        setBills(prevBills => {
          const updatedBills = prevBills.map(bill => 
            bill._id === billId ? response.data : bill
          );
          console.log('Updated bills list:', updatedBills);
          return updatedBills;
        });
      }
      
      // Show success message
      console.log(`Bill ${isCompleted ? 'marked as completed' : 'marked as pending'}`);
    } catch (error) {
      console.error('Error updating bill completion status:', error);
      console.error('Error response:', error.response?.data);
      // Show error message to user
      alert(`Failed to update bill status: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingBills(prev => {
        const newSet = new Set(prev);
        newSet.delete(billId);
        return newSet;
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Bills</h2>
        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
          💡 <strong>Tip:</strong> Check the "Complete" checkbox to disable editing for a bill
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.invoiceType === 'performa' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {bill.invoiceType === 'performa' ? 'Performa' : 'Invoice'}
                        {bill.performaInvoice && ' (Marked)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bill.grandTotal ? bill.grandTotal.toFixed(2) : '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.isCompleted ? (
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                          {bill.completedBy && (
                            <span className="ml-2 text-xs text-gray-500">
                              by {bill.completedBy.name || 'Admin'}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                      <button 
                        className="p-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 mr-2" 
                        onClick={() => { setSelectedBill(bill); setShowInvoiceModal(true); }}
                        title="View Bill"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        className={`p-1 rounded-full text-white ${bill.isCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`} 
                        onClick={() => !bill.isCompleted && fetchBillDetails(bill._id)}
                        title={bill.isCompleted ? "Cannot edit completed bill" : "Edit Bill"}
                        disabled={bill.isCompleted}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <div className="ml-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={bill.isCompleted || false}
                          onChange={(e) => handleBillCompletionChange(bill._id, e.target.checked)}
                          disabled={updatingBills.has(bill._id)}
                          className={`h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer ${
                            updatingBills.has(bill._id) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={bill.isCompleted ? "Mark as Pending" : "Mark as Completed"}
                        />
                        <span className={`ml-2 text-xs ${
                          updatingBills.has(bill._id) ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {updatingBills.has(bill._id) ? "Updating..." : (bill.isCompleted ? "Completed" : "Complete")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-bills">
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
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