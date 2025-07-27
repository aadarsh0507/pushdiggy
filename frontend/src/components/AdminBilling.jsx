import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
import api from '../api/api';
import InvoiceTemplate from './InvoiceTemplate';
import { useNavigate } from 'react-router-dom';

const AdminBilling = ({ onBillCreated }) => {
  const [resolvedTicketsReadyForBilling, setResolvedTicketsReadyForBilling] = useState([]);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [clients, setClients] = useState([]);
  const [bills, setBills] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [previewBillData, setPreviewBillData] = useState(null);

  const navigate = useNavigate();

  const [billForm, setBillForm] = useState({
    invoiceNumber: '',
    subject: '',
    client: '', // This will remain empty for one-time customers
    billTo: { name: '', address: '', gstin: '' },
    items: [{ description: '', amount: '', quantity: 0 }],
    bankDetails: { accountName: '', accountNumber: '', ifscCode: '', bankName: '', branch: '' },
    subtotal: 0,
    sgst: 0,
    cgst: 0,
    sgstPercent: 0,
    cgstPercent: 0,
    grandTotal: 0,
    date: '',
    ticketIds: [],
    invoiceType: 'invoice',
    performaInvoice: false,
  });

  const fetchResolvedTickets = async () => {
    try {
      const res = await api.get('/support-requests?readyForBilling=true');
      setResolvedTicketsReadyForBilling(res.data);
    } catch (err) {
      console.error('Error fetching resolved tickets:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  useEffect(() => {
    fetchResolvedTickets();
    fetchClients();

    const handleTicketUpdated = () => fetchResolvedTickets();
    window.addEventListener('ticketUpdatedEvent', handleTicketUpdated);
    return () => window.removeEventListener('ticketUpdatedEvent', handleTicketUpdated);
  }, []);

  useEffect(() => {
    const subtotal = billForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0) * (parseFloat(item.quantity) || 0), 0);
    const sgstAmount = (subtotal * (parseFloat(billForm.sgstPercent) || 0)) / 100;
    const cgstAmount = (subtotal * (parseFloat(billForm.cgstPercent) || 0)) / 100;
    const grandTotal = subtotal + sgstAmount + cgstAmount;

    // Round off all amounts to nearest rupee
    const roundedSubtotal = Math.round(subtotal);
    const roundedSgst = Math.round(sgstAmount);
    const roundedCgst = Math.round(cgstAmount);
    const roundedGrandTotal = Math.round(grandTotal);

    setBillForm(prev => ({
      ...prev,
      subtotal: roundedSubtotal.toFixed(2),
      sgst: roundedSgst.toFixed(2),
      cgst: roundedCgst.toFixed(2),
      grandTotal: roundedGrandTotal.toFixed(2),
    }));
  }, [billForm.items, billForm.sgstPercent, billForm.cgstPercent]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    if (name === 'sgst' || name === 'cgst') {
      const percentage = parseFloat(value) || 0;
      setBillForm(prev => ({ ...prev, [`${name}Percent`]: percentage }));
    } else {
      setBillForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedFormChange = (section, field, value) => {
    setBillForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...billForm.items];
    newItems[index][field] = value;
    setBillForm(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => setBillForm(prev => ({ ...prev, items: [...prev.items, { description: '', amount: '', quantity: 1 }] }));

  const handleRemoveItem = index => {
    const newItems = [...billForm.items];
    newItems.splice(index, 1);
    setBillForm(prev => ({ ...prev, items: newItems }));
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/billing/bills', {
        ...billForm,
        sgst: parseFloat(billForm.sgst),
        cgst: parseFloat(billForm.cgst),
        sgstPercent: parseFloat(billForm.sgstPercent),
        cgstPercent: parseFloat(billForm.cgstPercent),
        client: billForm.client || undefined,
      });
      onBillCreated();
      console.log('Bill created successfully:', res.data);
      setPreviewBillData({
        ...res.data,
        sgstPercent: billForm.sgstPercent,
        cgstPercent: billForm.cgstPercent,
      });
      setShowPreview(true);
      fetchResolvedTickets(); // Refresh resolved tickets to remove them from the list
      setSelectedTicketIds([]);
      setShowBillModal(false);
      setBillForm({
        invoiceNumber: '',
        subject: '',
        client: '',
        billTo: { name: '', address: '', gstin: '' },
        items: [{ description: '', amount: '', quantity: 1 }],
        bankDetails: { accountName: '', accountNumber: '', ifscCode: '', bankName: '', branch: '' },
        subtotal: 0,
        sgst: 0,
        cgst: 0,
        sgstPercent: 0,
        cgstPercent: 0,
        grandTotal: 0,
        date: '',
        ticketIds: [],
        invoiceType: 'invoice',
        performaInvoice: false,
      });
    } catch (err) {
      setSelectedTicketIds([]);
      setShowBillModal(false);
      console.error('Error creating bill:', err.response?.data || err.message);
    }
  };

  const handleCreateBillFromSelected = () => {
    const selectedTickets = resolvedTicketsReadyForBilling.filter(ticket =>
      selectedTicketIds.includes(ticket._id)
    );

    if (selectedTickets.length === 0) return;

    const firstSelectedTicket = selectedTickets[0];
    const selectedTicketIdsArray = selectedTickets.map(ticket => ticket._id);

    setBillForm(prevForm => ({
      ...prevForm,
      invoiceNumber: '',
      subject: selectedTickets[0].subject || '',
      client: firstSelectedTicket.clientId?._id || '',
      billTo: {
        name: firstSelectedTicket.clientId?.name || '',
        address: firstSelectedTicket.clientId?.address || '',
        gstin: firstSelectedTicket.clientId?.gstin || '',
      },
      items: selectedTickets.map(ticket => ({
        description: `Support Ticket: ${ticket.subject}`,
        amount: '0.00',
        quantity: 1,
      })),
      ticketIds: selectedTicketIdsArray,
      invoiceType: 'invoice',
      performaInvoice: false,
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
          <button onClick={() => {
            setEditingBill(null);
            setShowBillModal(true);
            setBillForm({
              invoiceNumber: '',
              subject: '',
              client: '',
              billTo: { name: '', address: '', gstin: '' },
              items: [{ description: '', amount: '', quantity: 1 }],
              bankDetails: { accountName: '', accountNumber: '', ifscCode: '', bankName: '', branch: '' },
              subtotal: 0,
              sgst: 0,
              cgst: 0,
              sgstPercent: 0,
              cgstPercent: 0,
              grandTotal: 0,
              date: '',
              ticketIds: [],
              invoiceType: 'invoice',
              performaInvoice: false,
            });
          }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create New Bill</button>
        </div>
      </div>

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

      {showPreview && previewBillData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-8 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Invoice Preview</h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewBillData(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <InvoiceTemplate billData={previewBillData} />
          </div>
        </div>
      )}

      {showBillModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-10 mx-auto p-8 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingBill ? 'Edit Bill' : 'Create Bill'}
              </h3>
              <button onClick={() => setShowBillModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <form onSubmit={handleBillSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input type="text" name="subject" value={billForm.subject} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" name="date" value={billForm.date} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Type</label>
                  <select 
                    name="invoiceType" 
                    value={billForm.invoiceType} 
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  >
                    <option value="invoice">Invoice</option>
                    <option value="performa">Performa Invoice</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="performaInvoice"
                    name="performaInvoice"
                    checked={billForm.performaInvoice}
                    onChange={(e) => setBillForm(prev => ({ ...prev, performaInvoice: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="performaInvoice" className="ml-2 block text-sm text-gray-900">
                    Mark as Performa Invoice
                  </label>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Bill To</h4>
                <input type="text" name="billTo.name" placeholder="Name" value={billForm.billTo.name} onChange={(e) => handleNestedFormChange('billTo', 'name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                <input type="text" name="billTo.address" placeholder="Address" value={billForm.billTo.address} onChange={(e) => handleNestedFormChange('billTo', 'address', e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                <input type="text" name="billTo.gstin" placeholder="GSTIN" value={billForm.billTo.gstin} onChange={(e) => handleNestedFormChange('billTo', 'gstin', e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Items</h4>
                {billForm.items.map((item, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Description" className="flex-grow rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} placeholder="Quantity" className="w-16 rounded-md border-gray-300 shadow-sm sm:text-sm" min="1" />
                    <input type="number" value={item.amount} onChange={(e) => handleItemChange(index, 'amount', e.target.value)} placeholder="Amount" className="w-24 rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    {billForm.items.length > 1 && <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500"><Trash2 size={18} /></button>}
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-blue-600 text-sm mt-2"><Plus size={16} className="inline" /> Add Item</button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Bank Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Name</label>
                    <input type="text" value={billForm.bankDetails.accountName} onChange={(e) => handleNestedFormChange('bankDetails', 'accountName', e.target.value)} placeholder="Account Name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <input type="text" value={billForm.bankDetails.accountNumber} onChange={(e) => handleNestedFormChange('bankDetails', 'accountNumber', e.target.value)} placeholder="Account Number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                    <input type="text" value={billForm.bankDetails.ifscCode} onChange={(e) => handleNestedFormChange('bankDetails', 'ifscCode', e.target.value)} placeholder="IFSC Code" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input type="text" value={billForm.bankDetails.bankName} onChange={(e) => handleNestedFormChange('bankDetails', 'bankName', e.target.value)} placeholder="Bank Name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <input type="text" value={billForm.bankDetails.branch} onChange={(e) => handleNestedFormChange('bankDetails', 'branch', e.target.value)} placeholder="Branch" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">SGST (%)</label>
                  <input type="number" name="sgst" value={billForm.sgstPercent} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CGST (%)</label>
                  <input type="number" name="cgst" value={billForm.cgstPercent} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-right font-semibold pt-2">
                <div>Subtotal: ₹{billForm.subtotal}</div>
                <div>SGST: ₹{billForm.sgst}</div>
                <div>CGST: ₹{billForm.cgst}</div>
                <div>Grand Total: ₹{billForm.grandTotal}</div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setShowBillModal(false)} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{editingBill ? 'Update Bill' : 'Create Bill'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBilling;
