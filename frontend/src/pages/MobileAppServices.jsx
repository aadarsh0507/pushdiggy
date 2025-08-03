import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const MobileAppServices = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newImage, setNewImage] = useState({
    name: '',
    image: null,
    description: ''
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileAppImages, setMobileAppImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch mobile app services from backend
  useEffect(() => {
    const fetchMobileAppServices = async () => {
      try {
        const res = await api.get('/services');
        const mobileAppServices = res.data.filter(service => service.category === 'mobile-app');
        setMobileAppImages(mobileAppServices);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mobile app services:', err);
        setLoading(false);
      }
    };
    fetchMobileAppServices();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowDescription(false);
  };

  const handleImageDescriptionClick = () => {
    setShowDescription(!showDescription);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setShowDescription(false);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowEditModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        // Refresh the services data
        const res = await api.get('/services');
        const mobileAppServices = res.data.filter(service => service.category === 'mobile-app');
        setMobileAppImages(mobileAppServices);
        setSelectedImage(null);
        alert('Service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service. Please try again.');
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/services/${editingService._id}`, editingService);
      // Refresh the services data
      const res = await api.get('/services');
      const mobileAppServices = res.data.filter(service => service.category === 'mobile-app');
      setMobileAppImages(mobileAppServices);
      setShowEditModal(false);
      setEditingService(null);
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Error updating service. Please try again.');
    }
  };

  const handleAddImageToService = async () => {
    if (!editingService.newImageFile) {
      alert('Please select an image file first.');
      return;
    }

    try {
      // First, upload the image file to get the actual URL
      const formData = new FormData();
      formData.append('name', 'New Image');
      formData.append('description', '');
      formData.append('price', 'Contact for pricing');
      formData.append('features', 'Mobile App Services');
      formData.append('category', 'mobile-app');
      formData.append('image', editingService.newImageFile);

      const uploadResponse = await api.post('/services/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get the uploaded service with the actual image URL
      const uploadedService = uploadResponse.data;
      const newImageUrl = uploadedService.images[0].url;

      // Create a new image object with the actual URL
      const newImage = {
        url: newImageUrl,
        title: 'New Image',
        description: '',
        tags: ['mobile-app', 'service']
      };

      // Add the new image to the existing service
      const updatedImages = [...(editingService.images || []), newImage];
      
      // Update the service with the new image
      await api.put(`/services/${editingService._id}`, {
        ...editingService,
        images: updatedImages
      });

      // Update the local state
      setEditingService({
        ...editingService,
        images: updatedImages,
        newImageFile: null,
        showAddImageForm: false
      });

      // Refresh the services data
      const res = await api.get('/services');
      const mobileAppServices = res.data.filter(service => service.category === 'mobile-app');
      setMobileAppImages(mobileAppServices);

      alert('Image added successfully!');
    } catch (error) {
      console.error('Error adding image:', error);
      let errorMessage = 'Error adding image. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', newImage.name);
      formData.append('description', newImage.description);
      formData.append('price', 'Contact for pricing');
      formData.append('features', 'Mobile App Services');
      formData.append('category', 'mobile-app');
      formData.append('image', newImage.image);

      await api.post('/services/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset form and close modal
      setNewImage({ name: '', image: null, description: '' });
      setShowAddImageModal(false);
      
      // Refresh the services data
      const res = await api.get('/services');
      const mobileAppServices = res.data.filter(service => service.category === 'mobile-app');
      setMobileAppImages(mobileAppServices);
      
      // Show success message
      alert('Image added successfully!');
    } catch (error) {
      console.error('Error adding image:', error);
      let errorMessage = 'Error adding image. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/services')}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Mobile App Services</h1>
                <p className="text-indigo-100">Professional mobile application development solutions</p>
              </div>
            </div>
            {/* Admin Plus Icon - Only visible to admins */}
            {user && user.role === 'admin' && (
              <button
                onClick={() => setShowAddImageModal(true)}
                className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-6 w-6" />
                <span className="text-sm font-medium">Add Image</span>
              </button>
            )}
          </div>
        </div>
        </div>

      {/* Add Image Modal */}
      {showAddImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Mobile App Image</h3>
              <button
                onClick={() => setShowAddImageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Name</label>
                <input
                  type="text"
                  value={newImage.name}
                  onChange={(e) => setNewImage({ ...newImage, name: e.target.value })}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., iOS App Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Attachment</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage({ ...newImage, image: e.target.files[0] })}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, GIF (Max 5MB)</p>
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  required
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Detailed description of the mobile app service..."
                />
          </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddImageModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Add Image
                </button>
          </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Display Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <button
              onClick={handleCloseImage}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-2/3 p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.name}</h3>
          </div>
                <div className="relative">
                  {selectedImage.images && selectedImage.images.length > 0 ? (
                    <img
                      src={selectedImage.images[0].url}
                      alt={selectedImage.name}
                      className="w-full h-64 lg:h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={handleImageDescriptionClick}
                    />
                  ) : (
                    <div className="w-full h-64 lg:h-96 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                    Click image for details
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {showDescription && (
                <div className="lg:w-1/3 p-6 bg-gray-50 border-l border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">{selectedImage.description}</p>
                  <p className="text-blue-600 font-semibold mb-4">{selectedImage.price}</p>
                  {selectedImage.features && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Features:</h5>
                      <p className="text-gray-700 text-sm">{selectedImage.features}</p>
                    </div>
                  )}
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
                    </div>
                  )}

      {/* Mobile App Images Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Mobile App Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Click on any app type to view detailed specifications and features.
          </p>
        </div>

                {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading mobile app services...</p>
          </div>
        ) : mobileAppImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mobileAppImages.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group relative"
              >
                <div 
                  className="relative cursor-pointer"
                  onClick={() => handleImageClick(app)}
                >
                  {app.images && app.images.length > 0 ? (
                    <img
                      src={app.images[0].url}
                      alt={app.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-lg font-bold">{app.name}</h3>
                  </div>
                </div>
                
                {/* Admin Edit/Delete Buttons */}
                {user && user.role === 'admin' && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditService(app);
                      }}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteService(app._id);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 transition-colors shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No mobile app services available at the moment.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Mobile App?
                  </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our experts can design and develop a custom mobile application tailored to your specific business requirements.
            </p>
            <div className="flex justify-center space-x-4">
                  <button
                onClick={() => navigate('/contact')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Free Consultation
                    </button>
                    <button
                onClick={() => navigate('/services')}
                className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                    >
                View All Services
                    </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Service Modal */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-gray-900">Edit Service</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Service Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
                  <textarea
                    value={editingService.description}
                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                    rows="6"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter service description..."
                  />
                </div>

                {/* Images Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Images</label>
                  
                  {/* Add New Image Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => setEditingService({
                        ...editingService,
                        showAddImageForm: true
                      })}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                      + Add New Image
                    </button>
                  </div>

                  {/* Add New Image Form */}
                  {editingService.showAddImageForm && (
                    <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Add New Image</h4>
                        <button
                          onClick={() => setEditingService({
                            ...editingService,
                            showAddImageForm: false,
                            newImageFile: null
                          })}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setEditingService({
                                ...editingService,
                                newImageFile: e.target.files[0]
                              });
                            }
                          }}
                          className="w-full border border-gray-300 rounded p-2"
                        />
                        <button
                          onClick={handleAddImageToService}
                          disabled={!editingService.newImageFile}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add Image
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Images */}
                  <div className="space-y-4">
                    {editingService.images && editingService.images.map((image, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start gap-4">
                          <img src={image.url} alt={image.title} className="w-20 h-20 object-cover rounded" />
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              placeholder="Image Title"
                              value={image.title || ''}
                              onChange={(e) => {
                                const newImages = [...editingService.images];
                                newImages[index] = {...newImages[index], title: e.target.value};
                                setEditingService({...editingService, images: newImages});
                              }}
                              className="w-full border border-gray-300 rounded p-2"
                            />
                            <textarea
                              placeholder="Image Description"
                              value={image.description || ''}
                              onChange={(e) => {
                                const newImages = [...editingService.images];
                                newImages[index] = {...newImages[index], description: e.target.value};
                                setEditingService({...editingService, images: newImages});
                              }}
                              rows="3"
                              className="w-full border border-gray-300 rounded p-2"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newImages = editingService.images.filter((_, i) => i !== index);
                              setEditingService({...editingService, images: newImages});
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAppServices; 