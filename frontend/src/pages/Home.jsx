import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Award, TrendingUp, Camera, Printer, Globe, Smartphone, Briefcase } from 'lucide-react';
import ConfettiSpray from "../components/ConfettiRain";
import api from '../api/api';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalClientCount, setTotalClientCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from splash screen
  useEffect(() => {
    const fromSplash = sessionStorage.getItem('fromSplash');
    if (fromSplash === 'true') {
      setShowConfetti(true);
      sessionStorage.removeItem('fromSplash'); // Clear the flag
    }
  }, []);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch total client count
  useEffect(() => {
    const fetchTotalClientCount = async () => {
      try {
        console.log('Fetching total client count...');
        const res = await api.get('/clients/count');
        console.log('Total client count response:', res.data);
        setTotalClientCount(res.data.count);
      } catch (err) {
        console.error('Error fetching total client count:', err);
        setTotalClientCount(0);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchTotalClientCount();
  }, []);

  const featuredServices = services.slice(0, 3);

  // Service categories with icons and descriptions (showing only 3 on home page)
  const serviceCategories = [
    {
      name: 'Camera Services',
      icon: Camera,
      description: 'Professional camera installation and surveillance solutions',
      color: 'from-purple-600 to-blue-600',
      category: 'camera'
    },
    {
      name: 'Website Services',
      icon: Globe,
      description: 'Custom website development and web solutions',
      color: 'from-green-600 to-teal-600',
      category: 'website'
    },
    {
      name: 'Digital Marketing',
      icon: TrendingUp,
      description: 'Digital marketing and online promotion services',
      color: 'from-pink-600 to-purple-600',
      category: 'digital-marketing'
    }
  ];

  // Function to get icon based on service category
  const getServiceIcon = (service) => {
    const categoryMap = {
      'camera': Camera,
      'printer': Printer,
      'website': Globe,
      'digital-marketing': TrendingUp,
      'mobile-app': Smartphone,
      'it-consultation': Briefcase
    };
    
    const IconComponent = categoryMap[service.category] || TrendingUp;
    return <IconComponent className="h-8 w-8 text-white" />;
  };

  // Function to get gradient color based on service category
  const getServiceColor = (service) => {
    const colorMap = {
      'camera': 'from-purple-600 to-blue-600',
      'printer': 'from-orange-600 to-red-600',
      'website': 'from-green-600 to-teal-600',
      'digital-marketing': 'from-pink-600 to-purple-600',
      'mobile-app': 'from-indigo-600 to-blue-600',
      'it-consultation': 'from-amber-600 to-orange-600'
    };
    
    return colorMap[service.category] || 'from-blue-600 to-purple-600';
  };

  const testimonials = [
    {
      id: 1,
      content: "PUSH DIGGY transformed our online presence. Highly recommend!",
      name: "Divya",
      role: "Lab Quality Manager",
      company: "APH",
      rating: 5,
      image: "/images/testimonial2.jpg",
    },
    {
      id: 2,
      content:
        "Professional, dedicated, and skilled. Our project was in good hands.",
      name: "Soundarya",
      role: "Ophthal Camp Incharge",
      company: "APH",
      rating: 5,
      image: '/images/testimonial3.jpg',
    },
    {
      id: 3,
      content:
        "Excellent support and expertise. Our go-to partner for IT solutions.",
      name: "Aadarsh",
      role: "ICU Co-Ordinator",
      company: "APH",
      rating: 5,
      image: '/images/testimonial4.jpg',
    },
  ];

  return (
    <div className="min-h-screen">
      {showConfetti && <ConfettiSpray />}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Business with
              <span className="block text-blue-200">Next-Gen IT Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Empowering businesses through innovative technology solutions,
              expert consulting, and reliable support services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
              >
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive IT solutions designed to accelerate your business growth and digital transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category) => (
              <button
                key={category.name}
                onClick={() =>
                  navigate(`/${category.category}-services`)
                }
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                ) : (
                  `${totalClientCount}+`
                )}
              </h3>
              <p className="text-gray-600">Total Clients</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">6+</h3>
              <p className="text-gray-600">Months Experience</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">99.9%</h3>
              <p className="text-gray-600">Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">5+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive IT solutions designed to accelerate your business
              growth and digital transformation.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-xl text-gray-600">
              Loading services...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getServiceColor(service)} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      {getServiceIcon(service)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <div className="text-2xl font-bold text-blue-600 mb-6">
                      {service.price}
                    </div>
                    <ul className="space-y-2 mb-8">
                      {service.features &&
                        service.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-600"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                    </ul>
                    <Link
                      to="/services"
                      className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PUSH DIGGY?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine technical expertise with business insight to deliver
              solutions that drive real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Expert Team
              </h3>
              <p className="text-gray-600">
                Our certified professionals bring years of experience and
                cutting-edge expertise to every project.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Proven Results
              </h3>
              <p className="text-gray-600">
                Track record of successful implementations and satisfied clients
                across various industries.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Round-the-clock support ensures your systems are always running
                smoothly and efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients
              have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Get in touch with our experts today and discover how we can help you
            achieve your technology goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Start Your Project
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;