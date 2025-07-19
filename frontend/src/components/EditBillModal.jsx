import React, { useState, useEffect } from 'react';

const EditBillModal = ({ billData, clients, onSave, onClose }) => {
  // Initialize state by explicitly picking properties to avoid unexpected nested objects
  // Initialize sgstAmount and cgstAmount from billData, as they are now editable or directly provided.
  const [editedBill, setEditedBill] = useState({
    _id: billData._id || '',
    invoiceNumber: billData.invoiceNumber || '',
    date: billData.date ? new Date(billData.date).toISOString().split('T')[0] : '',
    subject: billData.subject || '',
    sgstPercent: billData.sgstPercent || 0,
    cgstPercent: billData.cgstPercent || 0,
    subtotal: billData.subtotal || 0, // Initialize subtotal directly from billData
    sgstAmount: billData.sgst || 0, // Initialize SGST Amount directly
    cgstAmount: billData.cgst || 0, // Initialize CGST Amount directly
    grandTotal: billData.grandTotal || 0,
    services: billData.items.map(item => ({ ...item, quantity: item.quantity || 1 })) || [], // Use 'items' from billData, ensure quantity exists
    clientId: billData.client?._id || '', // Store the client ID
    invoiceType: billData.invoiceType || 'invoice',
    performaInvoice: billData.performaInvoice || false,
    billTo: {
      name: billData.billTo?.name || '',
      address: billData.billTo?.address || '',
      gstin: billData.billTo?.gstin || '',
    },
    bankDetails: {
      accountName: billData.bankDetails?.accountName || '',
      accountNumber: billData.bankDetails?.accountNumber || '',
      ifscCode: billData.bankDetails?.ifscCode || '',
      bankName: billData.bankDetails?.bankName || '',
      branch: billData.bankDetails?.branch || '',
    },
  });

  // Effect to update state when billData prop changes
  useEffect(() => {
    const newEditedBill = {
      _id: billData._id || '',
      invoiceNumber: billData.invoiceNumber || '',
      date: billData.date ? new Date(billData.date).toISOString().split('T')[0] : '',
      subject: billData.subject || '',
      sgstPercent: billData.sgstPercent || 0,
      cgstPercent: billData.cgstPercent || 0,
      subtotal: billData.subtotal || 0, // Set subtotal directly from billData
      sgstAmount: billData.sgst || 0, // Set SGST Amount directly
      cgstAmount: billData.cgst || 0, // Set CGST Amount directly
      grandTotal: billData.grandTotal || 0,
      services: billData.items.map(item => ({ ...item, quantity: item.quantity || 1 })) || [], // Use 'items' from billData, ensure quantity exists
      clientId: billData.client?._id || '', // Update the client ID
      invoiceType: billData.invoiceType || 'invoice',
      performaInvoice: billData.performaInvoice || false,
      billTo: {
        name: billData.billTo?.name || '',
        address: billData.billTo?.address || '',
        gstin: billData.billTo?.gstin || '',
      },
      bankDetails: {
        accountName: billData.bankDetails?.accountName || '',
        accountNumber: billData.bankDetails?.accountNumber || '',
        ifscCode: billData.bankDetails?.ifscCode || '',
        bankName: billData.bankDetails?.bankName || '',
        branch: billData.bankDetails?.branch || '',
      },
    };
    setEditedBill(newEditedBill);
    // Trigger initial calculation based on loaded data
    // This will calculate grandTotal, and re-calculate sgstAmount/cgstAmount if percentages are changed later
  }, [billData]);

  // Function to calculate SGST Amount, CGST Amount, and Grand Total
  // This now depends on editable subtotal and percentages
  const calculateTotals = () => {
    // Recalculate subtotal based on items, amount, and quantity
    const currentSubtotal = editedBill.services.reduce((sum, item) =>
      sum + (parseFloat(item.amount || 0) * parseFloat(item.quantity || 0))
    , 0);
    const sgstPercent = parseFloat(editedBill.sgstPercent || 0);
    const cgstPercent = parseFloat(editedBill.cgstPercent || 0);

    const calculatedSgstAmount = currentSubtotal * (sgstPercent / 100);
    const calculatedCgstAmount = currentSubtotal * (cgstPercent / 100);
    const calculatedGrandTotal = currentSubtotal + calculatedSgstAmount + calculatedCgstAmount;

    setEditedBill(prev => ({
      ...prev, // Keep previous state
      subtotal: currentSubtotal, // Update subtotal based on items
      sgstAmount: calculatedSgstAmount,
      cgstAmount: calculatedCgstAmount,
      grandTotal: calculatedGrandTotal,
    }));
  };

  // Effect to trigger calculations when services (items), amount, or percentages change
  useEffect(() => {
    calculateTotals();
  }, [editedBill.services, editedBill.sgstPercent, editedBill.cgstPercent]);


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedBill(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else {
      setEditedBill(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  // handleServiceChange handles description, amount, and quantity
  const handleServiceChange = (index, e) => {
    const { name, value, type } = e.target;
    const updatedServices = [...editedBill.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [name]: type === 'number' ? parseFloat(value) : value,
    };
    setEditedBill(prev => ({ ...prev, services: updatedServices }));
  };

  // addService now adds an item with description, amount, and quantity
  const addService = () => {
    setEditedBill(prev => ({
      ...prev,
      services: [...prev.services, { description: '', amount: 0, quantity: 1 }],
    }));
  };

  // removeService remains the same
  const removeService = (index) => {
    const updatedServices = editedBill.services.filter((_, i) => i !== index);
    setEditedBill(prev => ({ ...prev, services: updatedServices }));
  };

  const handleSave = () => {
    const billToSave = {
      ...editedBill,
      client: editedBill.clientId || undefined, // Ensure clientId is correctly mapped to client for backend
      items: editedBill.services, // Map services to items for backend
      sgst: editedBill.sgstAmount, // Map sgstAmount to sgst
      cgst: editedBill.cgstAmount, // Map cgstAmount to cgst
    };
    // Remove properties not expected by the backend to avoid conflicts
    delete billToSave.services;
    delete billToSave.sgstAmount;
    delete billToSave.cgstAmount;
    delete billToSave.clientId;

    onSave(billToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Bill</h3>
        <form>
          {/* Subject */}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={editedBill.subject}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
          </div>

          {/* Invoice & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                id="invoiceNumber"
                value={editedBill.invoiceNumber}
                readOnly
                className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                id="date"
                value={editedBill.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>
          </div>

          {/* Invoice Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="invoiceType" className="block text-sm font-medium text-gray-700">Invoice Type</label>
              <select 
                name="invoiceType" 
                id="invoiceType"
                value={editedBill.invoiceType} 
                onChange={handleInputChange}
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
                checked={editedBill.performaInvoice}
                onChange={(e) => setEditedBill(prev => ({ ...prev, performaInvoice: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="performaInvoice" className="ml-2 block text-sm text-gray-900">
                Mark as Performa Invoice
              </label>
            </div>
          </div>

          {/* Services - now using 'amount' directly */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Services</h4>
            {/* Header for item columns */}
            <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-700 mb-1 px-1">
              <div className="col-span-2">Description</div><div>Quantity</div><div>Amount</div><div></div> {/* Empty header for remove button column */}
            </div>
            {editedBill.services.map((service, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 items-center mb-2"> {/* Adjusted grid-cols to 5 for description (2), quantity (1), amount (1), remove (1) */}
                <input type="text" name="description" value={service.description} onChange={(e) => handleServiceChange(index, e)} placeholder="Description" className="rounded-md border-gray-300 shadow-sm sm:text-sm col-span-2" />
                <input type="number" name="quantity" value={service.quantity} onChange={(e) => handleServiceChange(index, e)} placeholder="Quantity" className="rounded-md border-gray-300 shadow-sm sm:text-sm" min="1" />
                <input type="number" name="amount" value={service.amount} onChange={(e) => handleServiceChange(index, e)} placeholder="Amount" step="0.01" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
                <button type="button" onClick={() => removeService(index)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addService} className="mt-2 text-sm text-blue-600 hover:underline">+ Add Service</button>
          </div>

          {/* Tax and Totals - Subtotal is now derived from items */}
          <div className="mb-4">
            <div>
              <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700">Subtotal Amount</label>
              <input
                type="number"
                name="subtotal"
                id="subtotal"
                value={(editedBill.subtotal || 0).toFixed(2)} // Display calculated subtotal
                readOnly // Subtotal is calculated, not directly editable
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="sgstPercent" className="block text-sm font-medium text-gray-700">SGST (%)</label>
              <input
                type="number"
                name="sgstPercent"
                id="sgstPercent"
                value={editedBill.sgstPercent}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                step="0.01"
              />
              <p className="mt-1 text-sm text-gray-600">SGST Amount: ₹{(editedBill.sgstAmount || 0).toFixed(2)}</p>
            </div>
            <div>
              <label htmlFor="cgstPercent" className="block text-sm font-medium text-gray-700">CGST (%)</label>
              <input
                type="number"
                name="cgstPercent"
                id="cgstPercent"
                value={editedBill.cgstPercent}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                step="0.01"
              />
              <p className="mt-1 text-sm text-gray-600">CGST Amount: ₹{(editedBill.cgstAmount || 0).toFixed(2)}</p>
            </div>
            <div>
              <label htmlFor="grandTotal" className="block text-sm font-medium text-gray-700">Grand Total</label>
              <p className="mt-1 p-2 bg-indigo-100 rounded-md font-semibold sm:text-sm">
                ₹{(editedBill.grandTotal || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Bill To</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="billTo.name" value={editedBill.billTo.name} onChange={handleInputChange} placeholder="Name" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
              <input type="text" name="billTo.gstin" value={editedBill.billTo.gstin} onChange={handleInputChange} placeholder="GSTIN" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
              <textarea name="billTo.address" value={editedBill.billTo.address} onChange={handleInputChange} rows="3" placeholder="Address" className="col-span-2 rounded-md border-gray-300 shadow-sm sm:text-sm" />
            </div>
          </div>

          {/* Bank Details */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Bank Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="bankDetails.accountName" value={editedBill.bankDetails.accountName} onChange={handleInputChange} placeholder="Account Name" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
              <input type="text" name="bankDetails.accountNumber" value={editedBill.bankDetails.accountNumber} onChange={handleInputChange} placeholder="Account Number" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
              <input type="text" name="bankDetails.ifscCode" value={editedBill.bankDetails.ifscCode} onChange={handleInputChange} placeholder="IFSC Code" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
              <input type="text" name="bankDetails.bankName" value={editedBill.bankDetails.bankName} onChange={handleInputChange} placeholder="Bank Name" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
              <input type="text" name="bankDetails.branch" value={editedBill.bankDetails.branch} onChange={handleInputChange} placeholder="Branch" className="rounded-md border-gray-300 shadow-sm sm:text-sm" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBillModal;
