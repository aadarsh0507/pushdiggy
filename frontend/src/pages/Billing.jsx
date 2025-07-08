import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import InvoiceTemplate from '../components/InvoiceTemplate'; // Import InvoiceTemplate

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null); // State to hold the selected bill for viewing
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Get the logged-in user from context

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        // Assuming your backend has an endpoint like /api/clients/:clientId/bills
        // and user.id contains the logged-in client's ID
        const res = await api.get(`/clients/${user.id}/bills`);
        setBills(res.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch bills only if the user is logged in and has an ID
    if (user?.id) {
      fetchBills();
    }
  }, [user]); // Re-run effect if user changes

  const handleDownloadBill = (billId) => {
    // Placeholder for future PDF download logic
    alert(`Download bill ${billId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">My Bills</h2>

      {isLoading ? (
        <div className="text-center">Loading bills...</div>
      ) : bills.length === 0 ? (
        <div className="text-center text-gray-600">No bills found for your account.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">₹{bill.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bill.paymentStatus || 'unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => setSelectedBill(bill)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadBill(bill._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Placeholder for Bill Detail Modal/View */}
      {selectedBill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <InvoiceTemplate billData={selectedBill} /> {/* Render InvoiceTemplate with selectedBill data */}
              <div className="items-center px-4 py-3 mt-4"> {/* Added margin-top for spacing */}
                <button
                  onClick={() => setSelectedBill(null)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Billing;

