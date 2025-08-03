import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, Plus, X, CheckCircle, Search } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const CreateClientService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    category: category || 'general',
    source: 'admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, []);

  // Filter clients based on search - show first 4 if no search, otherwise show all matching
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                         client.company?.toLowerCase().includes(clientSearchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Show first 4 clients if no search term, otherwise show all filtered results
  const displayedClients = clientSearchTerm ? filteredClients : filteredClients.slice(0, 4);

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClientToggle = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAllClients = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client._id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'enquiry':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedClients.length === 0) {
      alert('Please select at least one client');
      return;
    }

    if (!serviceForm.name || !serviceForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const featuresArr = serviceForm.features.split(',').map(f => f.trim()).filter(Boolean);
      
      // Map frontend category to backend format
      const categoryMapping = {
        'camera': 'Camera',
        'printer': 'Printer',
        'website': 'Website',
        'digital-marketing': 'Software',
        'mobile-app': 'Software',
        'it-consultation': 'Hardware'
      };
      
      const backendCategory = categoryMapping[category] || 'Other';
      
      console.log('=== SERVICE CREATION START ===');
      console.log('Creating services for clients:', selectedClients);
      console.log('Service form data:', serviceForm);
      console.log('Features array:', featuresArr);
      console.log('Frontend category:', category);
      console.log('Backend category:', backendCategory);
      
      // Create client service for each selected client using the new client service API
      const promises = selectedClients.map(clientId => {
        const clientServiceData = {
          ...serviceForm,
          features: featuresArr,
          category: backendCategory, // Use the mapped category
          clientId: clientId,
          assignedBy: user?.id, // Use current admin ID
          status: 'active',
          billingCycle: 'monthly'
        };
        console.log(`Creating client service for client ${clientId}:`, clientServiceData);
        return api.post('/client-services', clientServiceData);
      });

      const results = await Promise.all(promises);
      console.log('=== SERVICE CREATION SUCCESS ===');
      console.log('Services created successfully:', results.map(r => r.data));
      console.log('Total services created:', results.length);
      
      alert(`Services created successfully for ${results.length} client(s)!`);
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('=== SERVICE CREATION ERROR ===');
      console.error('Error creating services:', error);
      console.error('Error response:', error.response?.data);
      alert('Error creating services. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryInfo = (category) => {
    const categories = {
      'camera': {
        name: 'Camera Services',
        icon: '📷',
        description: 'Professional camera installation, maintenance, and support services'
      },
      'printer': {
        name: 'Printer Services',
        icon: '🖨️',
        description: 'Printer setup, maintenance, and troubleshooting services'
      },
      'website': {
        name: 'Website Services',
        icon: '🌐',
        description: 'Website development, hosting, and maintenance services'
      },
      'digital-marketing': {
        name: 'Digital Marketing',
        icon: '📈',
        description: 'SEO, social media marketing, and digital advertising services'
      },
      'mobile-app': {
        name: 'Mobile Apps',
        icon: '📱',
        description: 'Mobile application development and maintenance services'
      },
      'it-consultation': {
        name: 'IT Consultation',
        icon: '💼',
        description: 'IT consulting and technical support services'
      }
    };
    return categories[category] || { name: 'General Services', icon: '⚙️', description: 'General IT services' };
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{categoryInfo.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create {categoryInfo.name}</h1>
              <p className="text-gray-600">{categoryInfo.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={serviceForm.name}
                    onChange={handleServiceFormChange}
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
                    value={serviceForm.price}
                    onChange={handleServiceFormChange}
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
                  value={serviceForm.description}
                  onChange={handleServiceFormChange}
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
                  value={serviceForm.features}
                  onChange={handleServiceFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 24/7 support, remote access, backup services"
                />
              </div>
            </div>

            {/* Client Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Clients</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                                 {/* Search Controls */}
                 <div className="mb-4 space-y-3">
                   <div className="flex items-center space-x-3">
                     <div className="flex-1 relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                       <input
                         type="text"
                         placeholder="Search clients by name, email, or company..."
                         value={clientSearchTerm}
                         onChange={(e) => setClientSearchTerm(e.target.value)}
                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between">
                     <div className="flex items-center">
                       <Users className="h-5 w-5 text-gray-600 mr-2" />
                       <span className="text-sm font-medium text-gray-700">
                         {selectedClients.length} client(s) selected
                       </span>
                       <span className="text-sm text-gray-500 ml-2">
                         {clientSearchTerm ? `(${filteredClients.length} found)` : `(Showing first 4 of ${clients.length} clients)`}
                       </span>
                     </div>
                     <div className="flex space-x-2">
                       <button
                         type="button"
                         onClick={handleSelectAllClients}
                         className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                       >
                         {selectedClients.length === displayedClients.length ? 'Deselect All' : 'Select All'}
                       </button>
                       {selectedClients.length > 0 && (
                         <button
                           type="button"
                           onClick={() => setSelectedClients([])}
                           className="text-sm text-red-600 hover:text-red-800"
                         >
                           Clear Selection
                         </button>
                       )}
                     </div>
                   </div>
                 </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {displayedClients.map((client) => (
                    <div
                      key={client._id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedClients.includes(client._id)
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleClientToggle(client._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{client.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                          <p className="text-sm text-gray-500">{client.phone}</p>
                          {client.company && (
                            <p className="text-sm text-gray-500 mt-1">{client.company}</p>
                          )}
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                              {client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Unknown'}
                            </span>
                          </div>
                        </div>
                        {selectedClients.includes(client._id) && (
                          <CheckCircle className="h-6 w-6 text-blue-600 ml-3" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                                 {displayedClients.length === 0 && (
                   <div className="text-center py-8 text-gray-500">
                     <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                     <p>{clientSearchTerm ? 'No clients found matching your search' : 'No clients available'}</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedClients.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Service for {selectedClients.length} Client(s)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClientService; 