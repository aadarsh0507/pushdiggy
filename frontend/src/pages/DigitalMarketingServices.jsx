import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, BarChart3, Plus, Edit, Trash2, CheckCircle, Users, Share2 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext'; // Corrected import path
import ServiceNavigation from '../components/ServiceNavigation';

const DigitalMarketingServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    marketingType: '',
    platform: '',
    duration: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMarketingServices();
  }, []);

  const fetchMarketingServices = async () => {
    try {
      const res = await api.get('/services?category=digital-marketing');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching marketing services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featuresArr = formData.features.split(',').map(f => f.trim()).filter(Boolean);
    
    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, {
          ...formData,
          category: 'digital-marketing',
          features: featuresArr
        });
      } else {
        await api.post('/services', {
          ...formData,
          category: 'digital-marketing',
          features: featuresArr
        });
      }
      fetchMarketingServices();
      setShowModal(false);
      setEditingService(null);
      setFormData({
        name: '', description: '', price: '', features: '',
        marketingType: '', platform: '', duration: ''
      });
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const deleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchMarketingServices();
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <ServiceNavigation title="Digital Marketing Services" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full mb-6">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Digital Marketing Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Strategic digital marketing solutions to boost your online presence and drive business growth
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="h-8 w-8 text-pink-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{services.length}</h3>
            <p className="text-gray-600">Active Services</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Targeted</h3>
            <p className="text-gray-600">Audience</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Analytics</h3>
            <p className="text-gray-600">Driven</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Share2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Social</h3>
            <p className="text-gray-600">Media</p>
          </div>
        </div>

        {/* Add Service Button */}
        {user && user.role === 'admin' && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Marketing Service
            </button>
          </div>
        )}

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <TrendingUp className="h-8 w-8" />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setFormData({
                            name: service.name,
                            description: service.description,
                            price: service.price,
                            features: service.features?.join(', ') || '',
                            marketingType: service.marketingType || '',
                            platform: service.platform || '',
                            duration: service.duration || ''
                          });
                          setShowModal(true);
                        }}
                        className="text-white hover:text-pink-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteService(service._id)}
                        className="text-white hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mt-4">{service.name}</h3>
                  <p className="text-pink-100 mt-2">{service.description}</p>
                </div>
                <div className="p-6">
                  <div className="text-2xl font-bold text-pink-600 mb-4">{service.price}</div>
                  {service.marketingType && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <span className="ml-2 text-sm text-gray-900">{service.marketingType}</span>
                    </div>
                  )}
                  {service.platform && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600">Platform:</span>
                      <span className="ml-2 text-sm text-gray-900">{service.platform}</span>
                    </div>
                  )}
                  {service.duration && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-600">Duration:</span>
                      <span className="ml-2 text-sm text-gray-900">{service.duration}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {service.features?.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingService ? 'Edit Marketing Service' : 'Add Marketing Service'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingService(null);
                      setFormData({
                        name: '', description: '', price: '', features: '',
                        marketingType: '', platform: '', duration: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marketing Type</label>
                      <input
                        type="text"
                        value={formData.marketingType}
                        onChange={(e) => setFormData({...formData, marketingType: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Platform</label>
                      <input
                        type="text"
                        value={formData.platform}
                        onChange={(e) => setFormData({...formData, platform: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                    <input
                      type="text"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingService(null);
                        setFormData({
                          name: '', description: '', price: '', features: '',
                          marketingType: '', platform: '', duration: ''
                        });
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-md hover:from-pink-700 hover:to-purple-700"
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
    </div>
  );
};

export default DigitalMarketingServices; 