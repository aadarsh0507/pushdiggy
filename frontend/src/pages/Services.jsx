import React, { useState, useEffect } from 'react';
import { CheckCircle, Star, Camera, Printer, Globe, TrendingUp, Smartphone, Briefcase, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import api from '../api/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth(); // Use the useAuth hook
  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (err) {
        // handle error
      }
    };
    fetchServices();
  }, []);

  // Service categories with icons, descriptions, images, and device descriptions
  const serviceCategories = [
    {
      name: 'Camera Services',
      icon: Camera,
      description: 'Professional camera installation and surveillance solutions',
      color: 'from-purple-600 to-blue-600',
      hoverColor: 'hover:border-purple-500 hover:bg-purple-50',
      category: 'camera',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      deviceDescription: 'High-definition security cameras with night vision capabilities, motion detection, and remote monitoring. Perfect for both residential and commercial security needs. Features include 4K resolution, weather-resistant housing, and cloud storage integration.'
    },
    {
      name: 'Printer Services',
      icon: Printer,
      description: 'Printer setup, maintenance, and support services',
      color: 'from-orange-600 to-red-600',
      hoverColor: 'hover:border-orange-500 hover:bg-orange-50',
      category: 'printer',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      deviceDescription: 'Professional-grade printers and multifunction devices for office environments. Includes laser printers, inkjet printers, and all-in-one devices with scanning, copying, and faxing capabilities. Network-ready with wireless connectivity options.'
    },
    {
      name: 'Website Services',
      icon: Globe,
      description: 'Custom website development and web solutions',
      color: 'from-green-600 to-teal-600',
      hoverColor: 'hover:border-green-500 hover:bg-green-50',
      category: 'website',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      deviceDescription: 'Modern web development services including responsive design, e-commerce solutions, and content management systems. Built with the latest technologies like React, Node.js, and cloud hosting. SEO-optimized with fast loading times.'
    },
    {
      name: 'Digital Marketing',
      icon: TrendingUp,
      description: 'Digital marketing and online promotion services',
      color: 'from-pink-600 to-purple-600',
      hoverColor: 'hover:border-pink-500 hover:bg-pink-50',
      category: 'digital-marketing',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      deviceDescription: 'Comprehensive digital marketing solutions including SEO, social media management, PPC campaigns, and content marketing. Data-driven strategies with analytics and reporting. Helps businesses increase online visibility and drive conversions.'
    },
    {
      name: 'Mobile Apps',
      icon: Smartphone,
      description: 'Mobile application development services',
      color: 'from-indigo-600 to-blue-600',
      hoverColor: 'hover:border-indigo-500 hover:bg-indigo-50',
      category: 'mobile-app',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      deviceDescription: 'Native and cross-platform mobile app development for iOS and Android. Features include push notifications, offline functionality, and integration with backend services. User experience focused design with intuitive interfaces.'
    },
    {
      name: 'IT Consultation',
      icon: Briefcase,
      description: 'IT consulting and strategic technology solutions',
      color: 'from-amber-600 to-orange-600',
      hoverColor: 'hover:border-amber-500 hover:bg-amber-50',
      category: 'it-consultation',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      deviceDescription: 'Strategic IT consulting services to help businesses optimize their technology infrastructure. Includes technology assessment, digital transformation planning, and implementation guidance. Expert advice on software selection and system integration.'
    }
  ];

  const handleIconClick = (category) => {
    // Navigate to specific service pages for each category
    const serviceRoutes = {
      'camera': '/camera-services',
      'printer': '/printer-services',
      'website': '/website-services',
      'digital-marketing': '/digital-marketing-services',
      'mobile-app': '/mobile-app-services',
      'it-consultation': '/it-consultation-services'
    };
    
    const route = serviceRoutes[category.category];
    if (route) {
      navigate(route);
    } else {
      setSelectedImage(category);
      setShowDescription(false);
    }
  };

  const handleImageClick = () => {
    setShowDescription(!showDescription);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setShowDescription(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive IT solutions designed to accelerate your business growth and digital transformation.
            </p>
          </div>
        </div>
      </section>

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
                  <p className="text-gray-600">{selectedImage.description}</p>
                </div>
                <div className="relative">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.name}
                    className="w-full h-64 lg:h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleImageClick}
                  />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                    Click image for details
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {showDescription && (
                <div className="lg:w-1/3 p-6 bg-gray-50 border-l border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Device Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedImage.deviceDescription}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/' + selectedImage.category + '-services')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on any service icon to explore our detailed service pages with images and descriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleIconClick(category)}
                className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group bg-white shadow-lg hover:shadow-xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{category.name}</h3>
                <p className="text-gray-600 text-center text-sm">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We deliver exceptional value through our comprehensive approach to IT services and solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Expert Team</h3>
              <p className="text-gray-600">
                Certified professionals with years of experience in their respective domains.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Proven Results</h3>
              <p className="text-gray-600">
                Track record of successful implementations and measurable business outcomes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">24/7</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Round-the-Clock Support</h3>
              <p className="text-gray-600">
                Continuous monitoring and support to ensure your systems are always operational.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">$</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cost-Effective</h3>
              <p className="text-gray-600">
                Transparent pricing with flexible packages that deliver maximum ROI for your investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Contact our experts today to discuss your requirements and find the perfect solution for your business.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 