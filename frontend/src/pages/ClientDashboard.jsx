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
  const [clientServices, setClientServices] = useState([]); // New state for client services
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false); // New state for invoice modal
  const [selectedBill, setSelectedBill] = useState(null); // New state for selected bill
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

        console.log(`Fetching client services for client ID: ${user.id}`);
        const clientServicesRes = await api.get(`/client-services/client/${user.id}`);
        console.log('=== CLIENT SERVICES RETRIEVAL ===');
        console.log('Response data from fetching client services:', clientServicesRes.data);
        console.log('Number of client services found:', clientServicesRes.data.length);
        console.log('Client services details:', clientServicesRes.data.map(s => ({ id: s._id, name: s.name, clientId: s.clientId, status: s.status })));
        setClientServices(clientServicesRes.data);

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
      console.log('Response data from ticket creation:', res.data); // Add this line to inspect res.data
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

  // Pagination functions
  const getCurrentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = (items) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = (totalItems) => {
    const totalPages = getTotalPages(totalItems);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems.length)} of {totalItems.length} results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === number
                  ? 'text-white bg-blue-600 border border-blue-600'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!clientData) return <div className="text-center py-12">No client data found</div>;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          
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
                      <p className="text-sm text-gray-600 mt-1">
                        {request.description.length > 100 
                          ? `${request.description.substring(0, 100)}...` 
                          : request.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</span>
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

    // Add debugging information
    console.log('Client Services:', clientServices);
    console.log('Client Data:', clientData);
    console.log('User ID:', user?.id);

    const getServiceIcon = (category) => {
      switch (category?.toLowerCase()) {
        case 'printer':
          return '🖨️';
        case 'camera':
          return '📷';
        case 'website':
          return '🌐';
        case 'software':
          return '💻';
        case 'hardware':
          return '🔧';
        default:
          return '⚙️';
      }
    };

    const getServiceColor = (category) => {
      switch (category?.toLowerCase()) {
        case 'printer':
          return 'from-orange-500 to-red-500';
        case 'camera':
          return 'from-purple-500 to-pink-500';
        case 'website':
          return 'from-blue-500 to-cyan-500';
        case 'software':
          return 'from-green-500 to-emerald-500';
        case 'hardware':
          return 'from-gray-500 to-slate-500';
        default:
          return 'from-indigo-500 to-purple-500';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
            <p className="text-gray-600 mt-1">Manage and monitor your active services</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {clientServices.length} service(s) active
            </span>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Upgrade Services
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clientServices.map((service, index) => (
            <div key={service._id || index} className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden">
              {/* Service Header with Gradient */}
              <div className={`bg-gradient-to-r ${getServiceColor(service.category)} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 opacity-10">
                  <span className="text-6xl">{getServiceIcon(service.category)}</span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{service.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.status === 'active' ? 'bg-green-500 text-white' :
                      service.status === 'pending' ? 'bg-yellow-500 text-white' :
                      service.status === 'inactive' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {service.status?.charAt(0).toUpperCase() + service.status?.slice(1) || 'Active'}
                    </span>
                  </div>
                  <div className="max-h-16 overflow-y-auto bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                    <p className="text-white/90 text-sm leading-relaxed">
                      {service.description || `Your ${service.name.toLowerCase()} service is running smoothly.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                {service.price && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 shadow-sm">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-medium text-emerald-700">Price</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-900 bg-white/60 px-2 py-1 rounded-md">{service.price}</span>
                    </div>
                  </div>
                )}

                {service.features && service.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Features Included
                    </h4>
                    <div className="max-h-20 overflow-y-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100 shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Details */}
                <div className="space-y-3 mb-6">
                  {service.category && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100 shadow-sm">
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-orange-700">Category</span>
                      </div>
                      <span className="text-sm font-semibold text-orange-900 bg-white/60 px-2 py-1 rounded-md">{service.category}</span>
                    </div>
                  )}
                </div>


              </div>

              {/* Service Status Indicator */}
              <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${
                service.status === 'active' ? 'bg-green-400' :
                service.status === 'pending' ? 'bg-yellow-400' :
                service.status === 'inactive' ? 'bg-red-400' :
                'bg-gray-400'
              } animate-pulse`}></div>
            </div>
          ))}
          
          {clientServices.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-12">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No Services Assigned</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You don't have any active services yet. Contact your account manager to get started with our premium services.
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                  Contact Account Manager
                </button>
                
                {/* Debug Information (only in development) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-8 bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Debug Information:</p>
                    <p className="text-xs text-gray-500">User ID: {user?.id}</p>
                    <p className="text-xs text-gray-500">Client Data: {clientData ? 'Loaded' : 'Not loaded'}</p>
                    <p className="text-xs text-gray-500">Services Count: {clientServices.length}</p>
                  </div>
                )}
              </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Raised Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentItems(supportRequests).map((request, index) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.ticketNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.subject}</div>
                        <div className="text-sm text-gray-500">
                          {request.description.length > 50 
                            ? `${request.description.substring(0, 50)}...` 
                            : request.description}
                        </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</td>
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
        {renderPagination(supportRequests)}
      </div>
    );
  };

  // Function to handle viewing an invoice
  const handleViewInvoice = (bill) => {    setSelectedBill(bill);    setShowInvoiceModal(true);
  };
  const renderBilling = () => {    if (isLoading) return <div className="text-center py-12">Loading...</div>;    if (!clientData) return <div className="text-center py-12">No client data found</div>;


    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">My Bills</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientBills.length > 0 ? (
                  getCurrentItems(clientBills).map((bill, index) => (
                    <tr key={bill._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bill.grandTotal ? bill.grandTotal.toFixed(2) : '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
 <button className="flex items-center justify-center text-green-600 hover:text-green-900"
                          onClick={() => handleViewInvoice(bill)} // Call handleViewInvoice on click
                         
                          title="View Invoice"
                        >
 <Eye className="h-5 w-5" /> {/* Corrected the closing tag */}
 </button>
                      </td>
                    </tr>
                  ))
                ) : (

                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {renderPagination(clientBills)}
      </div>
    );
  };

  return (

      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome {user?.name || 'Client'}
              </h1>
              <p className="text-gray-600">Manage your services and support requests</p>
            </div>
    
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'overview', label: 'Overview', icon: Settings },
                  { key: 'services', label: 'My Services', icon: Settings },
                  { key: 'support', label: 'Support', icon: MessageSquare },
                  { key: 'billing', label: 'Billing', icon: CreditCard }
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
            </div>
    
            {/* Support Modal */}
            {showSupportModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">New Support Request</h3>
                    <button
                      onClick={() => setShowSupportModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleSupportSubmit}>
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={supportForm.subject}
                        onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="description"
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={supportForm.description}
                        onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                      <select
                        id="priority"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={supportForm.priority}
                        onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowSupportModal(false)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
    
            {/* Invoice Modal */}
            {showInvoiceModal && selectedBill && (
              console.log('selectedBill data:', selectedBill), // Added console log here
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10 pb-10 ">
                <div key={selectedBill?._id} className="relative mx-auto w-11/12 md:w-3/4 lg:w-2/3 print:w-auto print:mx-0 print:my-0 print:shadow-none print:p-0 print:bg-white print:!max-w-full print:!top-0">
                  <div>
                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 p-4 rounded-t-lg">
                      <button
                        onClick={() => setShowInvoiceModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div>
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