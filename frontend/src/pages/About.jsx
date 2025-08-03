import React, { useEffect, useState } from 'react';
import { CheckCircle, Users, Award, TrendingUp, Target, Eye, Heart, User, Edit, Save, X } from 'lucide-react';
import pushDiggyLogo from '../assets/push_diggy_logo.png';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      id: '1',
      name: 'Mr. Surendar',
      role: 'Founder & CEO',
      bio: 'Visionary leader with 8+ years of experience in IT services and business development. Passionate about transforming businesses through technology.',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Mr. Shanmugamani',
      role: 'Technical Director',
      bio: 'Expert in web development, mobile apps, and digital marketing. Leads our technical team with innovative solutions and client-focused approach.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Mr. Muruganantham',
      role: 'Senior Developer',
      bio: 'Full-stack developer specializing in modern web technologies, camera systems, and printer solutions. Delivers scalable and robust applications.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      name: 'Mr. Aadarsh',
      role: 'Blockchain Developer',
      bio: 'Specializing in modern web technologies, camera systems, and printer solutions. Delivers scalable and robust applications.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      name: 'Mr. Shakthi Selvam',
      role: 'Digital Marketing Specialist',
      bio: 'Creative digital marketing expert with expertise in SEO, social media, and content strategy. Drives online growth for our clients.',
      image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      name: 'Mr. Ajith Poongavanam',
      role: 'Service Team Head',
      bio: 'Creative digital marketing expert with expertise in SEO, social media, and content strategy. Drives online growth for our clients.',
      image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const [totalClientCount, setTotalClientCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [aboutStats, setAboutStats] = useState({
    yearsOfExcellence: '1+',
    projectsDelivered: '5+',
    uptimeGuarantee: '99.9%'
  });
  const [isEditingAboutStats, setIsEditingAboutStats] = useState(false);
  const [editingAboutStats, setEditingAboutStats] = useState({
    yearsOfExcellence: '',
    projectsDelivered: '',
    uptimeGuarantee: ''
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total client count
        console.log('Fetching total client count...');
        const clientRes = await api.get('/clients/count');
        console.log('Total client count response:', clientRes.data);
        setTotalClientCount(clientRes.data.count);

        // Fetch about stats
        console.log('Fetching about stats...');
        const statsRes = await api.get('/about-stats');
        console.log('About stats response:', statsRes.data);
        setAboutStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setTotalClientCount(0);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle about stats editing
  const handleEditAboutStats = () => {
    console.log('Current about stats:', aboutStats);
    setEditingAboutStats({
      yearsOfExcellence: aboutStats.yearsOfExcellence || '',
      projectsDelivered: aboutStats.projectsDelivered || '',
      uptimeGuarantee: aboutStats.uptimeGuarantee || ''
    });
    setIsEditingAboutStats(true);
  };

  const handleCancelEditAboutStats = () => {
    setIsEditingAboutStats(false);
    setEditingAboutStats({
      yearsOfExcellence: '',
      projectsDelivered: '',
      uptimeGuarantee: ''
    });
  };

  const handleSaveAboutStats = async () => {
    try {
      console.log('Sending about stats update:', editingAboutStats);
      console.log('Authorization header:', api.defaults.headers.common['Authorization']);
      
      // Check if user is logged in and is admin
      if (!isAdmin) {
        alert('You must be logged in as an admin to update stats.');
        return;
      }
      
      // Validate that all fields have values
      if (!editingAboutStats.yearsOfExcellence || !editingAboutStats.projectsDelivered || !editingAboutStats.uptimeGuarantee) {
        alert('All fields are required. Please fill in all the stats values.');
        return;
      }
      
      const res = await api.put('/about-stats', editingAboutStats);
      console.log('About stats update response:', res.data);
      setAboutStats(res.data.stats);
      setIsEditingAboutStats(false);
      alert('About stats updated successfully!');
    } catch (err) {
      console.error('Error updating about stats:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 401) {
        alert('Authentication failed. Please log in as an admin.');
      } else if (err.response?.status === 403) {
        alert('Access denied. Admin privileges required.');
      } else if (err.response?.status === 400) {
        alert(`Validation error: ${err.response?.data?.error || 'Invalid data'}`);
      } else {
        alert('Error updating about stats. Please try again.');
      }
    }
  };

  const handleAboutStatsChange = (field, value) => {
    setEditingAboutStats(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About PUSH DIGGY</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Pioneering the future of technology with innovative solutions and exceptional service since 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2025, PUSH DIGGY began as a small team of passionate technologists with a vision to help businesses harness the power of technology for growth and innovation.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Over the years, we've evolved into a comprehensive IT services provider, serving over 500 clients across various industries. Our commitment to excellence and customer satisfaction has been the driving force behind our success.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to push the boundaries of what's possible, helping businesses transform their operations through cutting-edge technology solutions and strategic consulting.
              </p>
            </div>
            <div className="relative">
              {/* Push Diggy Company Image */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <img
                    src={pushDiggyLogo}
                    alt="Push Diggy - IT Services Company"
                    className="w-64 h-64 object-contain mx-auto mb-6"
                  />
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">
                    PUSH DIGGY
                  </h3>
                  <p className="text-blue-600 font-semibold">
                    Transforming Businesses Through Technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission, Vision & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide us in delivering exceptional IT solutions and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower businesses through innovative technology solutions that drive growth, efficiency, and competitive advantage in the digital age.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading technology partner that businesses trust for their digital transformation journey, setting new standards in innovation and service excellence.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600">
                Integrity, Innovation, Excellence, and Customer-centricity form the cornerstone of everything we do, ensuring lasting partnerships and mutual success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to driving innovation and delivering exceptional results for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Placeholder for team member image - replace with actual images when available */}
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    {/* <p className="text-gray-600 font-semibold">Photo</p> */}
                    {/* <p className="text-gray-500 text-sm">Coming Soon</p> */}
                  </div>
                </div>
                {/* Uncomment and replace with actual image when available */}
                {/* <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                /> */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isAdmin && (
            <div className="flex justify-end mb-6">
              {!isEditingAboutStats ? (
                <button
                  onClick={handleEditAboutStats}
                  className="flex items-center gap-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Stats
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAboutStats}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEditAboutStats}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              PUSH DIGGY by the Numbers
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Our achievements and milestones reflect our commitment to excellence and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-2">
                {statsLoading ? (
                  <div className="animate-pulse bg-white bg-opacity-30 h-8 w-16 rounded mx-auto"></div>
                ) : (
                  `${totalClientCount}+`
                )}
              </h3>
              <p className="text-blue-100">Satisfied Clients</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              {isEditingAboutStats ? (
                <input
                  type="text"
                  value={editingAboutStats.yearsOfExcellence}
                  onChange={(e) => handleAboutStatsChange('yearsOfExcellence', e.target.value)}
                  className="text-4xl font-bold text-white text-center bg-transparent border-b-2 border-white focus:outline-none w-full"
                />
              ) : (
                <h3 className="text-4xl font-bold mb-2">{aboutStats.yearsOfExcellence}</h3>
              )}
              <p className="text-blue-100">Years of Excellence</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              {isEditingAboutStats ? (
                <input
                  type="text"
                  value={editingAboutStats.projectsDelivered}
                  onChange={(e) => handleAboutStatsChange('projectsDelivered', e.target.value)}
                  className="text-4xl font-bold text-white text-center bg-transparent border-b-2 border-white focus:outline-none w-full"
                />
              ) : (
                <h3 className="text-4xl font-bold mb-2">{aboutStats.projectsDelivered}</h3>
              )}
              <p className="text-blue-100">Projects Delivered</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              {isEditingAboutStats ? (
                <input
                  type="text"
                  value={editingAboutStats.uptimeGuarantee}
                  onChange={(e) => handleAboutStatsChange('uptimeGuarantee', e.target.value)}
                  className="text-4xl font-bold text-white text-center bg-transparent border-b-2 border-white focus:outline-none w-full"
                />
              ) : (
                <h3 className="text-4xl font-bold mb-2">{aboutStats.uptimeGuarantee}</h3>
              )}
              <p className="text-blue-100">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Businesses Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our unique combination of expertise, innovation, and commitment sets us apart in the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Expertise</h3>
                  <p className="text-gray-600">
                    Our team of certified professionals brings deep technical knowledge and industry best practices to every project.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer-Centric Approach</h3>
                  <p className="text-gray-600">
                    We prioritize understanding your unique business needs and tailoring solutions that deliver real value.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cutting-Edge Technology</h3>
                  <p className="text-gray-600">
                    We stay at the forefront of technology trends to provide innovative solutions that give you a competitive edge.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Support</h3>
                  <p className="text-gray-600">
                    From initial consultation to ongoing maintenance, we provide end-to-end support for all your IT needs.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Scalable Solutions</h3>
                  <p className="text-gray-600">
                    Our solutions grow with your business, ensuring long-term value and adaptability to changing requirements.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Partnership</h3>
                  <p className="text-gray-600">
                    We believe in open communication, clear pricing, and building lasting relationships based on trust and results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;