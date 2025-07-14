import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, CreditCard, FileText, Plus, Calendar, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
// import InvoiceTemplate from '../components/InvoiceTemplate'; // Import the InvoiceTemplate component
import InvoiceTemplate from '../components/InvoiceTemplate.jsx'; // Import the InvoiceTemplate component
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './../styles/print.css'; // Import the print styles
 
const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [supportRequests, setSupportRequests] = useState([]);
  const [clientBills, setClientBills] = useState([]); // New state for client bills
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false); // New state for invoice modal
  const [selectedBill, setSelectedBill] = useState(null); // New state for selected bill

  // Fetch client data, support requests, and bills
  useEffect(() => {
 console.log('ClientDashboard useEffect: user:', user, 'user?.id:', user?.id); // Log user and user?.id at the beginning
    
    if (!user || !user.id) {
      console.log('User or user ID not available, skipping data fetch');
      return; // Exit if user or user ID is not available
    }
    const fetchClientDataAndBills = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching client data for user ID: ${user.id}`);
        const clientRes = await api.get(`/clients/${user.id}`);
        setClientData(clientRes.data);
        console.log(`Fetching support requests for client ID: ${user.id}`);
        const supportRes = await api.get(`/support-requests/client/${user.id}`);
        setSupportRequests(supportRes.data);

        console.log(`Fetching bills for client ID: ${user.id}`);
        const billsRes = await api.get(`/billing/bills/client/${user.id}`);
        console.log('Response data from fetching bills:', billsRes.data); // Log billsRes.data
        setClientBills(billsRes.data);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDataAndBills();

    const handleTicketUpdated = () => {
      console.log("ticketUpdatedEvent received in ClientDashboard.");
      fetchClientDataAndBills();
    };
    window.addEventListener('ticketUpdatedEvent', handleTicketUpdated);

    return () => {
      window.removeEventListener('ticketUpdatedEvent', handleTicketUpdated);
    };
  }, [user]);

  console.log('ClientBills state after useEffect:', clientBills); // Log clientBills state after useEffect

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('handleSubmitRequest: Entering try block');
      console.log('Attempting to create support request with form data:', supportForm);
      const newRequest = {
        clientId: user.id,
        clientName: user.name,
        company: clientData.company, // Add company from clientData
        subject: supportForm.subject,
        description: supportForm.description,
        priority: supportForm.priority,
        status: 'open',
        date: new Date().toISOString().split('T')[0],
        assignedTo: 'Support Team'
      };
      console.log('New support request object:', newRequest);

      console.log('Sending new support request data:', newRequest);
      const res = await api.post('/support-requests', newRequest);
      console.log('handleSubmitRequest: API call successful, received response:', res);
      console.log('Support request created successfully:', res.data);
      setSupportRequests([...supportRequests, res.data]);
      setShowSupportModal(false);
      // No need to call fetchClientData() here as the useEffect will handle it
      setSupportForm({ subject: '', description: '', priority: 'medium' });
    } catch (err) {
      
      console.log('handleSubmitRequest: Entering catch block');
      console.error('Error creating support request:', err.response?.data || err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'open': return 'text-red-600 bg-red-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderOverview = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!clientData) return <div className="text-center py-12">No client data found</div>;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, {clientData.name}!</h2>
          
          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Services</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.services?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Account Status</p>
                  <p className="text-lg font-semibold text-green-600 capitalize">{clientData.status || 'active'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{supportRequests.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => setShowSupportModal(true)}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">New Support Request</span>
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">View Billing</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <FileText className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Download Reports</span>
              </button>
            </div>
          </div>

          {/* Recent Support Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Support Requests</h3>
                <button 
                  onClick={() => setActiveTab('support')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {supportRequests.slice(-3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{request.subject}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.priority)}`}>
                          {getPriorityIcon(request.priority)}
                          <span>{request.priority}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{request.description.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="text-xs text-gray-500">{request.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {supportRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No support requests yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServices = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!clientData) return <div className="text-center py-12">No client data found</div>;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Services</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Upgrade Services
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientData.services?.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                  {service.status || 'Active'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {service.description || `Your ${service.name.toLowerCase()} service is running smoothly.`}
              </p>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Manage
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
          {(!clientData.services || clientData.services.length === 0) && (
            <div className="col-span-2 text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No services assigned</p>
              <p className="text-gray-500 mb-6">Contact your account manager to get started with our services.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSupport = () => {
    console.log("Rendering support tickets. supportRequests state:", supportRequests); // Added console log
    if (isLoading) return <div className="text-center py-12">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Support Requests</h2>
          <button 
            onClick={() => setShowSupportModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supportRequests.map((request) => (
 console.log("Assigned To for ticket:", request.assignedTo),
                  console.log("Rendering ticket with client ID:", request.clientId, "and ticket ID:", request._id),
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.subject}</div>
                        <div className="text-sm text-gray-500">{request.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(request.priority)}`}>
                        {getPriorityIcon(request.priority)}
                        <span>{request.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.assignedTo?.name || 'Not assigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {supportRequests.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No support requests yet</p>
              <p className="text-gray-500 mb-6">Create your first support request to get help from our team.</p>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create Support Request
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Function to handle viewing an invoice
  const handleViewInvoice = (bill) => {    setSelectedBill(bill);    setShowInvoiceModal(true);
  };
  const renderBilling = () => {
    const handleDownloadInvoice = async (billId) => {
      try {
        // Make API call to backend to get PDF data
        const response = await api.get(`/billing/bills/${billId}/pdf`, {
          responseType: 'blob', // Important: responseType must be 'blob' for file downloads
        });

        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create a link element
        const link = document.createElement('a');
        
        // Set the download attribute and create a URL for the blob
        link.href = window.URL.createObjectURL(blob);
        link.download = `invoice_${billId}.pdf`; // Set the filename

        // Append the link to the body and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link and revoking the object URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Error downloading invoice:', error);
      }
    };
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!clientData) return <div className="text-center py-12">No client data found</div>;


    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">My Bills</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientBills.length > 0 ? (
                  clientBills.map((bill) => (
                    <tr key={bill._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bill.grandTotal ? bill.grandTotal.toFixed(2) : '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewInvoice(bill)} // Call handleViewInvoice on click
                          className="text-blue-600 hover:text-blue-900"
                          title="View Bill"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDownloadInvoice(bill._id)} // Call handleDownloadInvoice on click
                          className="text-green-600 hover:text-green-900 ml-2"
                          title="Download Invoice PDF"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
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
      </div>
    );
  };

  const renderMessages = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No messages to display.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (

      <>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-600">Manage your services and support requests</p>
            </div>
    
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'overview', label: 'Overview', icon: Settings },
                  { key: 'services', label: 'My Services', icon: Settings },
                  { key: 'support', label: 'Support', icon: MessageSquare },
                  { key: 'billing', label: 'Billing', icon: CreditCard },
                  { key: 'messages', label: 'Messages', icon: MessageSquare }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
    
            {/* Tab Content */}
            <div>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'services' && renderServices()}
              {activeTab === 'support' && renderSupport()}
              {activeTab === 'billing' && renderBilling()}
              {activeTab === 'messages' && renderMessages()}
            </div>
    
            {/* Support Modal */}
            {showSupportModal && /* your modal here... */ null}
    
            {/* Invoice Modal */}
            {showInvoiceModal && selectedBill && (
              console.log('selectedBill data:', selectedBill), // Added console log here
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10 pb-10 ">
                <div key={selectedBill?.invoiceNumber} className="relative mx-auto w-11/12 md:w-3/4 lg:w-2/3 print:w-auto print:mx-0 print:my-0 print:shadow-none print:p-0 print:bg-white print:!max-w-full print:!top-0">
                  <div>
                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 p-4 rounded-t-lg">
                      <h3 className="text-lg font-medium text-gray-900">
                        Invoice #{selectedBill.invoiceNumber}
                      </h3>
                      <button
                        onClick={() => setShowInvoiceModal(true)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    <button onClick={() => { navigate(`/print-invoice/${selectedBill._id}`); setShowInvoiceModal(false); }} className="mt-0 mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Print Invoice</button>

                  </div>
                  <div id="invoice-content-to-print" className="print:w-a4 print:h-a4 print:mx-auto print:my-0 print:overflow-visible">
                    <InvoiceTemplate billData={selectedBill} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    
        {/* ✅ PRINT STYLE FIXED AND INCLUDED INSIDE FRAGMENT */}
      </>
    );
  };

export default ClientDashboard;