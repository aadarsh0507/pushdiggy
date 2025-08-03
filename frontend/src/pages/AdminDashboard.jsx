// Admin Dashboard Component
import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Settings, BarChart3, Plus, Edit, Trash2, Eye, CheckCircle, Clock, AlertTriangle, ToggleLeft, ToggleRight, CreditCard, Camera, Printer, Globe, TrendingUp, Smartphone, Briefcase, Package, Calendar, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
// Import the new components (will be created next)
import AdminSupportTickets from '../components/AdminSupportTickets';
import AdminBilling from '../components/AdminBilling';
import AdminBills from '../components/AdminBills'; // Import the new AdminBills component
import AdminUsers from '../components/AdminUsers'; // Import the new AdminUsers component
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Debug: Log user object to understand its structure
  console.log('Current user object:', user);
  console.log('User ID (_id):', user?._id);
  console.log('User ID (id):', user?.id);
  console.log('User ID type:', typeof user?._id);
  console.log('User keys:', user ? Object.keys(user) : 'No user');
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [clientServices, setClientServices] = useState([]); // New state for client services
  const [clients, setClients] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [contactMessages, setContactMessages] = useState([]); // State to hold contact messages
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingService, setEditingService] = useState(null);
  const [supportTicketsData, setSupportTicketsData] = useState([]);
  const [bills, setBills] = useState([]); // State to hold bill data

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    category: 'Printer',
    selectedClients: []
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    category: 'general',
    images: []
  });

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        console.log('Fetched clients:', res.data); // Log fetched data
        setClients(res.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, []);

  // Fetch client services from backend
  useEffect(() => {
    fetchClientServices();
  }, []);

  const fetchClientServices = async () => {
    try {
      const res = await api.get('/client-services');
      console.log('Fetched client services:', res.data.length, 'services');
      console.log('Sample client service structure:', res.data[0]);
      setClientServices(res.data);
    } catch (err) {
      console.error('Error fetching client services:', err);
    }
  };

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        // Filter out services created from public pages
        // These services typically have images array and are created through the upload endpoint
        const adminServices = res.data.filter(service => {
          // Filter out services that were created from public pages
          // Services created from public pages have images array and specific patterns
          const hasImagesFromPublic = service.images && service.images.length > 0;
          const hasPublicPattern = service.name === 'New Image' || service.name === 'Replaced Image';
          
          // Only show services that were created through admin dashboard
          // (services without images array or with different patterns)
          return !hasImagesFromPublic && !hasPublicPattern;
        });
        setServices(adminServices);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, []);

  // Fetch support tickets from backend
  useEffect(() => {
    const fetchSupportTickets = async () => {
      try {
        const res = await api.get('/support-requests/all'); // Corrected endpoint to match backend
        setSupportTicketsData(res.data);
      } catch (err) {
        console.error('Error fetching support tickets:', err);
      }
    };
    fetchSupportTickets();
  }, []); // Fetch when component mounts

  // Fetch bills from backend
  const fetchBills = async () => {
    try {
      const res = await api.get('/billing/bills'); // Corrected endpoint to match backend routing
      setBills(res.data);
    } catch (err) {
      console.error('Error fetching bills:', err);
    }
  };
  useEffect(() => {
    fetchBills();
  }, []); // Fetch when component mounts

  // Fetch contact messages from backend
 useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const res = await api.get('/contact/messages');
        setContactMessages(res.data);
      } catch (err) {
        console.error('Error fetching contact messages:', err);
      }
    };
    fetchContactMessages();
  }, []); // Fetch messages when component mounts

  const deleteMessage = async (messageId) => {
    try {
      await api.delete(`/contact/${messageId}`);
      setContactMessages(contactMessages.filter(msg => msg._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Check for tab parameter in URL and set active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'clients', 'services', 'messages', 'support', 'billing', 'bills'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    totalMessages: contactMessages.length,
    newMessages: contactMessages.filter(msg => msg.status === 'new').length,
    totalServices: services.length,
    totalClientServices: clientServices.length,
    activeClientServices: clientServices.filter(s => s.status === 'active').length,
    supportTickets: supportTicketsData.length // Use the length of the fetched data
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'read': return 'text-yellow-600 bg-yellow-100';
      case 'replied': return 'text-green-600 bg-green-100';
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

  const deleteService = async (serviceId) => {
    try {
      await api.delete(`/services/${serviceId}`);
      setServices(services.filter(s => s._id !== serviceId));
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  // Delete client service
  const deleteClientService = async (serviceName) => {
    try {
      if (window.confirm(`Are you sure you want to delete all instances of "${serviceName}" for all clients?`)) {
        console.log('Attempting to delete client service:', serviceName);
        console.log('Current clientServices count before deletion:', clientServices.length);
        
        // Find all services with the same name
        const servicesToDelete = clientServices.filter(service => service.name === serviceName);
        console.log(`Found ${servicesToDelete.length} services to delete for "${serviceName}"`);
        console.log('Services to delete:', servicesToDelete.map(s => ({ id: s._id, name: s.name, clientId: s.clientId })));
        
        // Delete all services with the same name
        const deletePromises = servicesToDelete.map(service => {
          console.log(`Deleting service ${service._id} for client ${service.clientId}`);
          return api.delete(`/client-services/${service._id}`);
        });
        
        const responses = await Promise.all(deletePromises);
        console.log('Delete API responses:', responses);
        
        // Refresh the client services data from the backend to ensure proper grouping
        await fetchClientServices();
        
        alert(`Successfully deleted ${servicesToDelete.length} instance(s) of "${serviceName}"!`);
      }
    } catch (err) {
      console.error('Error deleting client service:', err);
      alert('Error deleting client service. Please try again.');
    }
  };

  // Map frontend category values to backend enum values
  const mapCategoryToBackend = (category) => {
    const categoryMap = {
      'printer': 'Printer',
      'website': 'Website',
      'mobile-app': 'Software',
      'digital-marketing': 'Other',
      'it-consultation': 'Other',
      'camera': 'Camera',
      'general': 'Other'
    };
    return categoryMap[category] || category || 'Other';
  };

  // Open edit modal for client service
  const openEditModal = (service) => {
    setEditingService(service);
    
    // Debug: Log the service features to understand the data structure
    console.log('Service features:', service.features, 'type:', typeof service.features, 'isArray:', Array.isArray(service.features));
    
    const featuresString = Array.isArray(service.features) 
      ? service.features.join(', ') 
      : (typeof service.features === 'string' ? service.features : '');
    
    console.log('Converted features to string:', featuresString);
    
    const newEditForm = {
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      features: featuresString,
      category: mapCategoryToBackend(service.category), // Map to backend-compatible category
      selectedClients: [typeof service.clientId === 'object' ? service.clientId._id : service.clientId] // Initialize with current client
    };
    
    console.log('Setting editForm to:', newEditForm);
    setEditForm(newEditForm);
    setShowEditModal(true);
  };

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    console.log(`handleEditFormChange - name: ${name}, value:`, value, 'type:', typeof value);
    setEditForm(prev => {
      const newForm = {
        ...prev,
        [name]: value
      };
      console.log('New editForm state:', newForm);
      return newForm;
    });
  };

  // Handle client selection for multi-select
  const handleClientSelection = (clientId) => {
    setEditForm(prev => {
      const currentSelected = prev.selectedClients || [];
      const isSelected = currentSelected.includes(clientId);
      
      if (isSelected) {
        // Remove client if already selected
        return {
          ...prev,
          selectedClients: currentSelected.filter(id => id !== clientId)
        };
      } else {
        // Add client if not selected
        return {
          ...prev,
          selectedClients: [...currentSelected, clientId]
        };
      }
    });
  };

  // Edit client service
  const editClientService = async (e) => {
    e.preventDefault();
    
    if (!editForm.name || !editForm.description || !editForm.selectedClients || editForm.selectedClients.length === 0) {
      alert('Please fill in all required fields and select at least one client');
      return;
    }

    try {
      // Ensure features is always an array
      let featuresArray = [];
      if (editForm.features) {
        if (typeof editForm.features === 'string') {
          featuresArray = editForm.features.split(',').map(f => f.trim()).filter(Boolean);
        } else if (Array.isArray(editForm.features)) {
          featuresArray = editForm.features;
        }
      }
      
      console.log('Processed features array:', featuresArray);
      console.log('User ID for assignedBy:', user?._id);
      
      // Create multiple service entries for each selected client
      const updatePromises = editForm.selectedClients.map(clientId => {
        const updateData = {
          name: editForm.name,
          description: editForm.description,
          price: editForm.price || undefined,
          features: featuresArray,
          category: editForm.category,
          clientId: clientId,
          ...(user?._id || user?.id ? { assignedBy: user?._id || user?.id } : {})
        };
        
        console.log('Sending updateData for clientId:', clientId, updateData);

        // If this is the original service, update it
        const originalClientId = typeof editingService.clientId === 'object' ? editingService.clientId._id : editingService.clientId;
        if (clientId === originalClientId) {
          return api.put(`/client-services/${editingService._id}`, updateData);
        } else {
          // For new clients, create new service entries
          return api.post('/client-services', updateData);
        }
      });

      const responses = await Promise.all(updatePromises);
      
      // Refresh client services to get updated data
      await fetchClientServices();
      
      setShowEditModal(false);
      setEditingService(null);
      alert('Client service updated successfully!');
    } catch (err) {
      console.error('Error updating client service:', err);
      alert('Error updating client service. Please try again.');
    }
  };

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const featuresArr = serviceForm.features.split(',').map(f => f.trim()).filter(Boolean);

    if (editingService) {
      try {
        const res = await api.put(`/services/${editingService._id}`, {
          ...serviceForm,
          features: featuresArr
        });
        setServices(services.map(service => service._id === editingService._id ? res.data : service));
      } catch (err) {
        console.error('Error updating service:', err);
      }
    } else {
      try {
        const res = await api.post('/services', {
          ...serviceForm,
          features: featuresArr
        });
        setServices([res.data, ...services]);
      } catch (err) {
        console.error('Error creating service:', err);
      }
    }
    // Clear form after successful submission (either create or update)
    setServiceForm({ name: '', description: '', price: '', features: '', category: 'general', images: [] });
    setShowServiceModal(false);
    setEditingService(null);
  };

  useEffect(() => {
    if (editingService) {
      setServiceForm({
        name: editingService.name,
        description: editingService.description,
        price: editingService.price,
        features: editingService.features.join(', '),
        category: editingService.category || 'general',
        images: editingService.images || []
      });
    } else {
      setServiceForm({ name: '', description: '', price: '', features: '', category: 'general', images: [] });
    }
  }, [editingService, showServiceModal]);

  const handleClientRowClick = (client) => {
    setSelectedClient(client);
    setIsSidebarOpen(true);
  };

  const handleToggleStatus = async (client) => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    try {
      const updateData = { 
        status: newStatus,
        // Clear inactive date if status is being set to active
 inactiveDate: newStatus === 'inactive' ? new Date().toISOString() : null
      };
  
      await api.put(`/clients/${client._id}/status`, updateData);
      setClients(clients.map(c => 
        c._id === client._id 
          ? { 
              ...c, 
              status: newStatus,
              inactiveDate: newStatus === 'inactive' ? new Date().toISOString() : null
            } 
          : c
      ));
    } catch (err) {
      console.error('Error updating client status:', err);
    } 
  };

  const handleToggleAMC = async (client) => {
    try {
      const res = await api.put(`/clients/${client._id}/toggle-amc`);
      // Update the client with the new AMC status
      setClients(clients.map(c => 
        c._id === client._id 
          ? { ...c, amc: res.data.client.amc }
          : c
      ));
    } catch (err) {
      console.error('Error toggling AMC:', err);
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

  const renderOverview = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Client Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClientServices}</p>
                <p className="text-xs text-gray-500">{stats.activeClientServices} active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                <p className="text-xs text-gray-500">{stats.newMessages} new</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.supportTickets}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
              <div className="space-y-4">
                {contactMessages.length > 0 ? (
                  // Sort by date descending and take the last 3
                  contactMessages.slice() // Create a shallow copy before sorting
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by creation date descending
                    .slice(0, 3) // Take the first 3 after sorting
                    .map(message => (
                      <div key={message._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">{message.subject}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">from {message.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(message.createdAt).toLocaleString()}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500">No messages to display.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Support Requests</h3>
              <div className="space-y-4">
                {supportTicketsData.length > 0 ? (
                  // Sort by date descending and take the last 5
                  supportTicketsData.slice() // Create a shallow copy before sorting
 .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)) // Sort by update date descending, fallback to creation date
 .slice(0, 3) // Take the first 3 after sorting by update date (which are the most recently updated)
                    .map(ticket => (
                      <div key={ticket._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">from {ticket.clientName}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(ticket.createdAt).toLocaleString()}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500">No support requests to display.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {['All', 'enquiry', 'active', 'inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'enquiry' ? 'Enquiry' : status.charAt(0).toUpperCase() + status.slice(1)} Clients
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            const filteredClients = clients.filter(client => filterStatus === 'All' || client.status === filterStatus);
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Filtered Client List</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
            printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; }');
            printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
            printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
            printWindow.document.write('h2 { color: #333; margin-bottom: 10px; }');
            printWindow.document.write('.status-active { color: green; }');
            printWindow.document.write('.status-inactive { color: red; }');
            printWindow.document.write('.status-enquiry { color: blue; }');
            printWindow.document.write('.amc-yes { color: green; font-weight: bold; }');
            printWindow.document.write('.amc-no { color: red; }');
            printWindow.document.write('</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h2>Push Diggy - Client List (' + (filterStatus === 'All' ? 'All' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)) + ' Clients)</h2>');
            printWindow.document.write('<p>Generated on: ' + new Date().toLocaleString() + '</p>');
            printWindow.document.write('<table>');
            printWindow.document.write('<thead>');
            printWindow.document.write('<tr>');
            printWindow.document.write('<th>S.No</th>');
            printWindow.document.write('<th>Client Name</th>');
            printWindow.document.write('<th>Email</th>');
            printWindow.document.write('<th>Company</th>');
            printWindow.document.write('<th>Phone</th>');
            printWindow.document.write('<th>Status</th>');
            printWindow.document.write('<th>Join Date</th>');
            printWindow.document.write('<th>AMC</th>');
            printWindow.document.write('<th>Inactive Date</th>');
            printWindow.document.write('</tr>');
            printWindow.document.write('</thead>');
            printWindow.document.write('<tbody>');
            
            filteredClients.forEach((client, index) => {
              const statusClass = client.status ? `status-${client.status}` : 'status-unknown';
              const amcClass = client.amc ? 'amc-yes' : 'amc-no';
              const amcText = client.amc ? 'Yes' : 'No';
              const statusText = client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Unknown';
              
              printWindow.document.write('<tr>');
              printWindow.document.write('<td>' + (index + 1) + '</td>');
              printWindow.document.write('<td>' + (client.name || 'N/A') + '</td>');
              printWindow.document.write('<td>' + (client.email || 'N/A') + '</td>');
              printWindow.document.write('<td>' + (client.company || 'N/A') + '</td>');
              printWindow.document.write('<td>' + (client.phone || 'N/A') + '</td>');
              printWindow.document.write('<td class="' + statusClass + '">' + statusText + '</td>');
              printWindow.document.write('<td>' + (client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A') + '</td>');
              printWindow.document.write('<td class="' + amcClass + '">' + amcText + '</td>');
              printWindow.document.write('<td>' + (client.inactiveDate ? new Date(client.inactiveDate).toLocaleDateString() : '-') + '</td>');
              printWindow.document.write('</tr>');
            });
            
            printWindow.document.write('</tbody>');
            printWindow.document.write('</table>');
            printWindow.document.write('<p style="margin-top: 20px; font-size: 12px; color: #666;">Total Clients: ' + filteredClients.length + '</p>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
        >
          Print Filtered List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table id="client-table" className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inactive Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentItems(clients
                .filter(client => filterStatus === 'All' || client.status === filterStatus))
                .map((client, index) => (
                  <tr 
                    key={client._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const serviceCount = clientServices.filter(service => {
                          // Handle both populated and non-populated clientId
                          const serviceClientId = typeof service.clientId === 'object' ? service.clientId._id : service.clientId;
                          return serviceClientId === client._id;
                        }).length;
                        console.log(`Client ${client.name} (${client._id}): ${serviceCount} services`);
                        return `${serviceCount} services`;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(client);
                      }}
                      className={`flex items-center focus:outline-none ${
                        client.status === 'active' ? 'text-green-500' : 'text-gray-400'
                      }`}
                      title={client.status === 'active' ? 'Deactivate client' : 'Activate client'}
                    >
                      {client.status === 'active' ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Unknown'}
                      </span>
                    </button>
                     
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 no-click">
                      <input
                        type="checkbox"
                        checked={client.amc || false}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleAMC(client);
                          
                        }}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    {/* Removed click handler/link for inactive date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 no-click"
                        style={{ cursor: 'default' }} // Ensure cursor doesn't indicate clickability
                         onClick={(e) => e.stopPropagation()} // Prevent row click handler
                    >
                      {client.inactiveDate && client.inactiveDate !== '1970-01-01T00:00:00.000Z' && new Date(client.inactiveDate).getTime() !== new Date('1970-01-01').getTime()
                        ? new Date(client.inactiveDate).toLocaleDateString() 
                        : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 no-click"
                           onClick={(e) => e.stopPropagation()} // Prevent row click handler
                           >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClientRowClick(client);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {renderPagination(clients.filter(client => filterStatus === 'All' || client.status === filterStatus))}

      {isSidebarOpen && selectedClient && (
        <div className="fixed inset-y-0 right-0 w-full md:w-1/3 bg-white shadow-lg z-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">Client Details</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="text-lg text-gray-900">{selectedClient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-lg text-gray-900">{selectedClient.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-lg text-gray-900">{selectedClient.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Company</p>
              <p className="text-lg text-gray-900">{selectedClient.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className={`text-lg font-semibold ${getStatusColor(selectedClient.status)}`}>
                {selectedClient.status}
              </p>
            </div>
            {selectedClient.inactiveDate && (
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Date</p>
                <p className="text-lg text-gray-900">
                  {new Date(selectedClient.inactiveDate).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">Join Date</p>
              <p className="text-lg text-gray-900">
                {selectedClient.createdAt ? new Date(selectedClient.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">AMC</p>
              <p className="text-lg text-gray-900">{selectedClient.amc ? 'Yes' : 'No'}</p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
        <button 
          onClick={() => {
            setShowServiceModal(true);
            setEditingService(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div> */}

      {/* Service Category Icons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            to="/create-client-service?category=camera"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">Camera Services</span>
          </Link>

          <Link
            to="/create-client-service?category=printer"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Printer className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">Printer Services</span>
          </Link>

          <Link
            to="/create-client-service?category=website"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">Website Services</span>
          </Link>

          <Link
            to="/create-client-service?category=digital-marketing"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">Digital Marketing</span>
          </Link>

          <Link
            to="/create-client-service?category=mobile-app"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">Mobile Apps</span>
          </Link>

          <Link
            to="/create-client-service?category=it-consultation"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">IT Consultation</span>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setShowServiceModal(true);
                    setEditingService(service);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => deleteService(service._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="text-xl font-bold text-blue-600 mb-4">{service.price}</div>
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {service.category}
              </span>
            </div>
            <div className="space-y-2">
              {service.features && service.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
            {service.images && service.images.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Images ({service.images.length})</h5>
                <div className="grid grid-cols-3 gap-2">
                  {service.images.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.alt || image.title}
                      className="w-full h-16 object-cover rounded"
                    />
                  ))}
                  {service.images.length > 3 && (
                    <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      +{service.images.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showServiceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button 
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={serviceForm.name}
                    onChange={handleServiceFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={serviceForm.description}
                    onChange={handleServiceFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={serviceForm.price}
                    onChange={handleServiceFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                  <input
                    type="text"
                    name="features"
                    value={serviceForm.features}
                    onChange={handleServiceFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={serviceForm.category}
                    onChange={handleServiceFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="general">General</option>
                    <option value="camera">Camera</option>
                    <option value="printer">Printer</option>
                    <option value="website">Website</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="it-consultation">IT Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <div className="space-y-2">
                    {serviceForm.images.map((image, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={image.url}
                          onChange={(e) => {
                            const newImages = [...serviceForm.images];
                            newImages[index].url = e.target.value;
                            setServiceForm({ ...serviceForm, images: newImages });
                          }}
                          className="flex-1 border border-gray-300 rounded-md p-2"
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={image.title}
                          onChange={(e) => {
                            const newImages = [...serviceForm.images];
                            newImages[index].title = e.target.value;
                            setServiceForm({ ...serviceForm, images: newImages });
                          }}
                          className="flex-1 border border-gray-300 rounded-md p-2"
                        />
                        <textarea
                          placeholder="Description"
                          value={image.description}
                          onChange={(e) => {
                            const newImages = [...serviceForm.images];
                            newImages[index].description = e.target.value;
                            setServiceForm({ ...serviceForm, images: newImages });
                          }}
                          className="flex-1 border border-gray-300 rounded-md p-2"
                          rows="2"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = serviceForm.images.filter((_, i) => i !== index);
                            setServiceForm({ ...serviceForm, images: newImages });
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setServiceForm({
                          ...serviceForm,
                          images: [...serviceForm.images, { url: '', title: '', description: '', tags: [] }]
                        });
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Add Image
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceModal(false);
                      setEditingService(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {editingService ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactMessages.length > 0 ? (
                getCurrentItems(contactMessages).map((message, index) => (
                  <tr key={message._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{message.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                       <button
                        onClick={() => deleteMessage(message._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No messages to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {renderPagination(contactMessages)}
    </div>
  );
  

  // Render a modal or sidebar for viewing a single message
  const renderMessageDetails = () => {
    console.log('Selected message:', selectedMessage);
    console.log('Selected message:', selectedMessage);
    if (!selectedMessage) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">From</p>
                <p className="text-lg text-gray-900">{selectedMessage.name} ({selectedMessage.email})</p>
              </div>
              {selectedMessage.phone && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-lg text-gray-900">{selectedMessage.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Subject</p>
                <p className="text-lg text-gray-900">{selectedMessage.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Message</p>
                <p className="text-lg text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Received At</p>
                <p className="text-lg text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              {/* You can add Reply or Delete buttons here */}
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the Bills section (using the new component)
  const renderBills = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Bills</h2>
      <AdminBills bills={getCurrentItems(bills)} clients={clients} setBills={setBills} />
      {renderPagination(bills)}
    </div>
  );

  // Render the Client Services section
  const renderClientServices = () => {
    // Group services by service name/type
    const groupedServices = clientServices.reduce((acc, service) => {
      const serviceKey = service.name;
      if (!acc[serviceKey]) {
        acc[serviceKey] = {
          service: service,
          clients: []
        };
      }
      // Add the populated client object if it exists, otherwise use clientId
      if (service.clientId && typeof service.clientId === 'object') {
        acc[serviceKey].clients.push(service.clientId);
      } else if (service.clientId) {
        acc[serviceKey].clients.push({ name: service.clientId, _id: service.clientId });
      }
      return acc;
    }, {});

    const groupedServicesArray = Object.values(groupedServices);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Client Services</h2>
            <p className="text-gray-600 mt-1">Manage and monitor all client services</p>
          </div>
          <Link
            to="/create-client-service?category=printer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Client Service
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCurrentItems(groupedServicesArray).map((groupedService) => {
            const service = groupedService.service;
            const clients = groupedService.clients;
            
            return (
              <div key={service._id} className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden">
                {/* Service Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Package className="h-16 w-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold truncate">{service.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.status === 'active' ? 'bg-green-500 text-white' :
                        service.status === 'pending' ? 'bg-yellow-500 text-white' :
                        service.status === 'inactive' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="max-h-16 overflow-y-auto bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                      <p className="text-white/90 text-sm leading-relaxed">
                        {service.description || 'Service description not available'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-4">
                  {/* Service Details */}
                  <div className="space-y-3 mb-4">
                    {service.price && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 shadow-sm">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-emerald-600 mr-2" />
                          <span className="text-sm font-medium text-emerald-700">Price</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-900 bg-white/60 px-2 py-1 rounded-md">{service.price}</span>
                      </div>
                    )}
                    
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

                  {/* Clients Section */}
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-700">Assigned Clients ({clients.length})</span>
                    </div>
                    <div className="space-y-1 max-h-24 overflow-y-auto bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 border border-purple-100 shadow-sm">
                      {clients.map((client, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 animate-pulse"></div>
                            <div className="flex flex-col">
                              <span className="text-sm text-purple-800 font-medium">
                                {client.name || 'Unknown Client'}
                              </span>
                              {client.email && (
                                <span className="text-xs text-purple-600">
                                  {client.email}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-purple-600 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 rounded-full font-medium">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Features
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

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                                         <button
                       onClick={() => openEditModal(service)}
                       className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center text-sm"
                     >
                       <Edit className="h-3 w-3 mr-1" />
                       Edit
                     </button>
                    <button
                      onClick={() => deleteClientService(service.name)}
                      className="flex-1 border-2 border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 font-medium flex items-center justify-center text-sm"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
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
            );
          })}
        </div>
        

        
        {renderPagination(groupedServicesArray)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome {user?.name || 'Admin'}
          </h1>
          <p className="text-gray-600">Manage your clients, services, and business operations</p>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'clients', label: 'Clients', icon: Users },
              { key: 'services', label: 'General Services', icon: Settings },
              { key: 'client-services', label: 'Client Services', icon: Package },
              { key: 'messages', label: 'Messages', icon: MessageSquare },
              { key: 'support', label: 'Support Tickets', icon: MessageSquare }, // Reusing MessageSquare for now
              { key: 'billing', label: 'Billing', icon: CreditCard },
              { key: 'bills', label: 'Bills', icon: CreditCard }, // New tab for Bills
              { key: 'admin-users', label: 'Admin Users', icon: Users }, // New tab for Admin Users
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

        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'client-services' && renderClientServices()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'support' && <AdminSupportTickets />}
          {activeTab === 'billing' && <AdminBilling clients={clients} onBillCreated={fetchBills} />}
          {activeTab === 'bills' && renderBills()} {/* Render the Bills section */}
          {activeTab === 'admin-users' && <AdminUsers />} {/* Render the Admin Users section */}
        </div>
        {renderMessageDetails()} {/* Render the message details modal/sidebar */}
        
        {/* Edit Client Service Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Client Service</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingService(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={editClientService} className="space-y-6">
                  {/* Service Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter service name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., $500/month or Contact for pricing"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditFormChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the service in detail"
                        required
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Features (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="features"
                        value={editForm.features}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 24/7 support, remote access, backup services"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Printer">Printer Services</option>
                        <option value="Website">Website Services</option>
                        <option value="Software">Software Services</option>
                        <option value="Hardware">Hardware Services</option>
                        <option value="Network">Network Services</option>
                        <option value="Security">Security Services</option>
                        <option value="Camera">Camera Services</option>
                        <option value="Other">Other Services</option>
                      </select>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign to Clients *
                      </label>
                      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                        {clients.map((client) => {
                          const isSelected = editForm.selectedClients?.includes(client._id);
                          return (
                            <div
                              key={client._id}
                              onClick={() => handleClientSelection(client._id)}
                              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-blue-100 border border-blue-300'
                                  : 'hover:bg-gray-50 border border-transparent'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-3 ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">{client.email}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {editForm.selectedClients?.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected: {editForm.selectedClients.length} client(s)
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingService(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Service
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;