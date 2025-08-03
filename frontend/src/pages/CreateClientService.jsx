import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, Plus, X, CheckCircle } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const CreateClientService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
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
      
      // Create service for each selected client
      const promises = selectedClients.map(clientId => 
        api.post('/services', {
          ...serviceForm,
          features: featuresArr,
          clientId: clientId,
          source: 'admin'
        })
      );

      await Promise.all(promises);
      
      alert('Services created successfully for all selected clients!');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error creating services:', error);
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedClients.length} client(s) selected
                    </span>
                  </div>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {clients.map((client) => (
                    <div
                      key={client._id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedClients.includes(client._id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleClientToggle(client._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.email}</p>
                          <p className="text-sm text-gray-500">{client.phone}</p>
                        </div>
                        {selectedClients.includes(client._id) && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {clients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No clients found</p>
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