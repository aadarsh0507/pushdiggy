import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import api from '../api/api';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    console.log(e); // Log the event object
    e.preventDefault();
    // e.stopImmediatePropagation(); // Temporarily removed to avoid the TypeError
    console.log('handleSubmit called');
    setIsSubmitting(true);

    try {
      const response = await api.post("/contact", formData);

      if (!response.ok) {
 console.error('Response not OK:', response);
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset message after 3 sec
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Ready to transform your business? Get in touch with our experts
              today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're here to help you with all your IT needs. Reach out to us
                through any of the following channels, and we'll respond
                promptly.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Phone
                    </h3>
                    <p className="text-gray-600">+91 86087-06864</p>
                    <p className="text-sm text-gray-500">
                      Mon-Fri 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Email
                    </h3>
                    <p className="text-gray-600">pushdiggy@gmail.com</p>
                    <p className="text-sm text-gray-500">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Office
                    </h3>
                    <p className="text-gray-600">Acharapakkam</p>
                    <p className="text-gray-600">
                      Chengalpattu, Tamilnadu 603301
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Emergency Support */}
              <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  24/7 Emergency Support
                </h3>
                <p className="text-red-700 mb-2">
                  For critical system failures and urgent technical issues:
                </p>
                <p className="text-red-800 font-semibold">
                  Emergency Hotline: +91 86087-06864
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="your phone number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Software Development">
                        Software Development
                      </option>
                      <option value="Digital Marketing">
                        Digital Marketing
                      </option>
                      <option value="Sales and Services">
                        Sales and Services
                      </option>
                      <option value="Networking">Networking</option>
                      <option value="Request Quote">Request Quote</option>
                      <option value="Partnership Opportunities">
                        Partnership Opportunities
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                    placeholder="Please describe your requirements or questions in detail..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our Privacy Policy and
                  Terms of Service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600">
              Located in the heart of Silicon Valley, we're easily accessible
              for in-person meetings and consultations.
            </p>
          </div>

          <div className="bg-gray-300 h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15586.920838872034!2d79.81774013273736!3d12.400985660569335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a531739f7000001%3A0x99ffde6f6b507fac!2sSri%20Aatcheeswarar%20temple!5e0!3m2!1sen!2sin!4v1751439572358!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;