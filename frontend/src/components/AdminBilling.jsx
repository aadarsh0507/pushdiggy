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

    const interval = setInterval(() => {
      const updated = localStorage.getItem('ticketUpdated');
      if (updated === 'true') {
        fetchResolvedTickets();
        localStorage.setItem('ticketUpdated', 'false');
      }
    }, 2000);

    return () => clearInterval(interval);
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

  const handleBillSubmit = e => {
    e.preventDefault();
    console.log("Submitting bill data to backend:", billForm);
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
      subject: `Billing for Support Tickets (${selectedTickets.length})`,
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

      {/* You can include your modal and preview logic below */}
    </div>
  );
};

export default AdminBilling;
