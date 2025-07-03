import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
import api from '../api/api';

const AdminBilling = () => {
  const [resolvedTicketsReadyForBilling, setResolvedTicketsReadyForBilling] = useState([]);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]); // ✅ Add this
  const [bills, setBills] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [gstRate, setGstRate] = useState(18);

  const [billForm, setBillForm] = useState({
    invoiceNumber: '',
    subject: '',
    billTo: { name: '', address: '', gstin: '' },
    items: [{ description: '', amount: '' }],
    bankDetails: { accountName: '', accountNumber: '', ifscCode: '', bankName: '', branch: '' },
    subtotal: 0,
    gst: 0,
    grandTotal: 0,
    date: '',
  });

  const fetchResolvedTickets = async () => {
    try {
      const res = await api.get('/support-requests?readyForBilling=true'); // ✅ Updated
      setResolvedTicketsReadyForBilling(res.data);
    } catch (err) {
      console.error('Error fetching resolved tickets:', err);
    }
  };

  useEffect(() => {
    fetchResolvedTickets();
    // Fetch on mount and when ticketUpdatedEvent is dispatched

    // Add event listener for custom event
    const handleTicketUpdated = () => {
      fetchResolvedTickets();
    };
    window.addEventListener('ticketUpdatedEvent', handleTicketUpdated);

    return () => {
      window.removeEventListener('ticketUpdatedEvent', handleTicketUpdated);
    };
  }, []);

  useEffect(() => {
    const subtotal = billForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const gst = subtotal * (gstRate / 100);
    const grandTotal = subtotal + gst;
    setBillForm(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      gst: gst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    }));
  }, [billForm.items, gstRate]);

  const handleFormChange = e => setBillForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNestedFormChange = (section, field, value) => setBillForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const handleItemChange = (index, field, value) => {
    const newItems = [...billForm.items];
    newItems[index][field] = value;
    setBillForm(prev => ({ ...prev, items: newItems }));
  };
  const handleAddItem = () => setBillForm(prev => ({ ...prev, items: [...prev.items, { description: '', amount: '' }] }));
  const handleRemoveItem = index => {
    const newItems = [...billForm.items];
    newItems.splice(index, 1);
    setBillForm(prev => ({ ...prev, items: newItems }));
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submitting bill data to backend:", billForm); // Removed console log

    // Send the billForm data to your backend API to create a bill
    try {
      const res = await api.post('/billing/bills', billForm); // Assuming you have a '/bills' endpoint for creating bills

      console.log('Bill created successfully:', res.data);

      // After successful bill creation, you might want to:
      // 1. Fetch the updated list of bills to display
      // 2. Potentially mark the processed tickets as billed in the backend
      // 3. Clear the selected tickets and hide the modal

      // Clear selected tickets and hide modal
      setSelectedTicketIds([]);
      setShowBillModal(false);
      // Reset bill form to initial state
      setBillForm({ invoiceNumber: '', subject: '', billTo: { name: '', address: '', gstin: '' }, items: [{ description: '', amount: '' }], bankDetails: { accountName: '', accountNumber: '', ifscCode: '', bankName: '', branch: '' }, subtotal: 0, gst: 0, grandTotal: 0, date: '', });

    } catch (err) {
      console.error('Error creating bill:', err.response?.data || err.message);
    }
  };

  const handleCreateBillFromSelected = () => {
    const selectedTickets = resolvedTicketsReadyForBilling.filter(ticket =>
      selectedTicketIds.includes(ticket._id)
    );

    if (selectedTickets.length === 0) return;

    const firstSelectedTicket = selectedTickets[0];

    setBillForm(prevForm => ({
      ...prevForm,
      invoiceNumber: '',
      subject: selectedTickets[0].subject || '',
      client: firstSelectedTicket.clientId?._id || '', // Set client to the client's ObjectId
      billTo: {
        name: firstSelectedTicket.clientId?.name || '',
        address: firstSelectedTicket.clientId?.address || '',
        gstin: firstSelectedTicket.clientId?.gstin || '',
      },
      items: selectedTickets.map(ticket => ({
        description: `Support Ticket: ${ticket.subject}`,
        amount: '0.00',
      })),
    }));
    setEditingBill(null);
    setShowBillModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Billing Management</h2>
        <div>
          <button onClick={fetchResolvedTickets} className="bg-gray-600 text-white px-3 py-1 rounded mr-2">Refresh</button>
          <button onClick={() => { setEditingBill(null); setShowBillModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create New Bill</button>
        </div>
      </div>

      {/* 🧾 List Resolved Tickets for Selection */}
      {resolvedTicketsReadyForBilling.length > 0 && (

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Resolved Tickets Ready for Billing</h3>
          <ul className="space-y-2">
            {resolvedTicketsReadyForBilling.map(ticket => (
              <li key={ticket._id} className="flex items-center justify-between border p-2 rounded">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTicketIds.includes(ticket._id)}
                    onChange={() => {
                      setSelectedTicketIds(prev =>
                        prev.includes(ticket._id)
                          ? prev.filter(id => id !== ticket._id)
                          : [...prev, ticket._id]
                      );
                    }}
                  />
                  <span>{ticket.subject} - {ticket.clientId?.name}</span>
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCreateBillFromSelected}
            disabled={selectedTicketIds.length === 0}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Bill from Selected
          </button>
        </div>
      )}

      {resolvedTicketsReadyForBilling.length === 0 && (
        <div className="text-gray-500 text-center">No resolved tickets available for billing.</div>
      )}

      {/* Bill Creation/Editing Modal */}
      {showBillModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-10 mx-auto p-8 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingBill ? 'Edit Bill' : 'Create Bill'}
              </h3>
              <button onClick={() => setShowBillModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="px-4 py-3">
              <form onSubmit={handleBillSubmit} className="space-y-6 text-left">
                  {/* Basic Bill Details */}
                  <div>
                    <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
                    <input type="text" name="invoiceNumber" id="invoiceNumber" value={billForm.invoiceNumber} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" name="subject" id="subject" value={billForm.subject} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" value={billForm.date} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                  </div>

                  {/* Bill To Information */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold mb-2">Bill To</h4>
                    <div>
                      <label htmlFor="billTo.name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="name" id="billTo.name" value={billForm.billTo.name} onChange={(e) => handleNestedFormChange('billTo', 'name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="billTo.address" className="block text-sm font-medium text-gray-700">Address</label>
                      <input type="text" name="address" id="billTo.address" value={billForm.billTo.address} onChange={(e) => handleNestedFormChange('billTo', 'address', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="billTo.gstin" className="block text-sm font-medium text-gray-700">GSTIN</label>
                      <input type="text" name="gstin" id="billTo.gstin" value={billForm.billTo.gstin} onChange={(e) => handleNestedFormChange('billTo', 'gstin', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold mb-2">Items</h4>
                    {billForm.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 mb-3">
                        <div className="flex-grow">
                          <label htmlFor={`item-description-${index}`} className="block text-sm font-medium text-gray-700 sr-only">Description</label>
                          <input
                            type="text"
                            name={`item-description-${index}`}
                            id={`item-description-${index}`}
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor={`item-amount-${index}`} className="block text-sm font-medium text-gray-700 sr-only">Amount</label>
                          <input
                            type="number"
                            name={`item-amount-${index}`}
                            id={`item-amount-${index}`}
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm w-24"
                          />
                        </div>
                        {billForm.items.length > 1 && (
                          <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-600 hover:text-red-900">
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-semibold">
                      <Plus size={20} className="inline-block mr-1" /> Add Item
                    </button>
                  </div>

                  {/* Bank Details */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold mb-2">Bank Details</h4>
                    <div>
                      <label htmlFor="bankDetails.accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                      <input type="text" name="accountName" id="bankDetails.accountName" value={billForm.bankDetails.accountName} onChange={(e) => handleNestedFormChange('bankDetails', 'accountName', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                     <div className="mt-2">
                      <label htmlFor="bankDetails.accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                      <input type="text" name="accountNumber" id="bankDetails.accountNumber" value={billForm.bankDetails.accountNumber} onChange={(e) => handleNestedFormChange('bankDetails', 'accountNumber', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="bankDetails.ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code</label>
                      <input type="text" name="ifscCode" id="bankDetails.ifscCode" value={billForm.bankDetails.ifscCode} onChange={(e) => handleNestedFormChange('bankDetails', 'ifscCode', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="bankDetails.bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                      <input type="text" name="bankName" id="bankDetails.bankName" value={billForm.bankDetails.bankName} onChange={(e) => handleNestedFormChange('bankDetails', 'bankName', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="bankDetails.branch" className="block text-sm font-medium text-gray-700">Branch</label>
                      <input type="text" name="branch" id="bankDetails.branch" value={billForm.bankDetails.branch} onChange={(e) => handleNestedFormChange('bankDetails', 'branch', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                  </div>

                  {/* Totals */}
                   <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700">GST Rate (%)</label>
                         <input type="number" name="gstRate" id="gstRate" value={gstRate} onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 text-right font-semibold">
                       <div>Subtotal: ₹{billForm.subtotal}</div>
                       <div>GST ({gstRate}%): ₹{billForm.gst}</div>
                       <div>Grand Total: ₹{billForm.grandTotal}</div>
                   </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                    <button type="button" onClick={() => setShowBillModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      {editingBill ? 'Update Bill' : 'Create Bill'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        
      )}
    </div>
  );
};

export default AdminBilling;
