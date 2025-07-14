import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api'; // Assuming your API utility is here
import InvoiceTemplate from '../components/InvoiceTemplate'; // Assuming your InvoiceTemplate is here

const PrintInvoicePage = () => {
  const { invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/billing/bills/${invoiceId}`);
        setInvoiceData(response.data);
        setLoading(false);
      } catch (err) {
        // Log the error to the console for debugging
        setError('Failed to load invoice.');
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  useEffect(() => {
    if (invoiceData) {
      // Wait a moment for the component to render before printing
      const printTimeout = setTimeout(() => {
        window.print();
      }, 500); // Adjust delay if needed

      return () => clearTimeout(printTimeout);
    }
  }, [invoiceData]);

  if (loading) {
    return <div className="text-center py-12">Loading invoice...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!invoiceData) {
    return <div className="text-center py-12">Invoice not found.</div>;
  }

  return (
    <div id="invoice-content-to-print" className="print-only">
      <InvoiceTemplate billData={invoiceData} />
    </div>
  );
};

export default PrintInvoicePage;