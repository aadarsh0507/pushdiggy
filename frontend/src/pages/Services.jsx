import React, { useState, useEffect } from 'react';
import { CheckCircle, Star, Camera, Printer, Globe, TrendingUp, Smartphone, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import api from '../api/api';



const Services = () => {
  const [services, setServices] = useState([]);
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

  // Service categories with icons and descriptions
  const serviceCategories = [
    {
      name: 'Camera Services',
      icon: Camera,
      description: 'Professional camera installation and surveillance solutions',
      color: 'from-purple-600 to-blue-600',
      hoverColor: 'hover:border-purple-500 hover:bg-purple-50',
      category: 'camera'
    },
    {
      name: 'Printer Services',
      icon: Printer,
      description: 'Printer setup, maintenance, and support services',
      color: 'from-orange-600 to-red-600',
      hoverColor: 'hover:border-orange-500 hover:bg-orange-50',
      category: 'printer'
    },
    {
      name: 'Website Services',
      icon: Globe,
      description: 'Custom website development and web solutions',
      color: 'from-green-600 to-teal-600',
      hoverColor: 'hover:border-green-500 hover:bg-green-50',
      category: 'website'
    },
    {
      name: 'Digital Marketing',
      icon: TrendingUp,
      description: 'Digital marketing and online promotion services',
      color: 'from-pink-600 to-purple-600',
      hoverColor: 'hover:border-pink-500 hover:bg-pink-50',
      category: 'digital-marketing'
    },
    {
      name: 'Mobile Apps',
      icon: Smartphone,
      description: 'Mobile application development services',
      color: 'from-indigo-600 to-blue-600',
      hoverColor: 'hover:border-indigo-500 hover:bg-indigo-50',
      category: 'mobile-app'
    },
    {
      name: 'IT Consultation',
      icon: Briefcase,
      description: 'IT consulting and strategic technology solutions',
      color: 'from-amber-600 to-orange-600',
      hoverColor: 'hover:border-amber-500 hover:bg-amber-50',
      category: 'it-consultation'
    }
  ];

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

    
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of IT services tailored to meet your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate('/' + category.category + '-services')}
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