import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, CreditCard, FileText, Plus, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [supportRequests, setSupportRequests] = useState([]);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch client data and support requests
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        const [clientRes, supportRes] = await Promise.all([
          api.get(`/clients/${user.id}`).catch(err => {
            console.error(`Error fetching client data for ID ${user.id}:`, err);
            return { data: null }; // Return a default value or re-throw if critical
          }),
          api.get(`/support-requests?clientId=${user.id}`).catch(err => {
            console.error(`Error fetching support requests for client ID ${user.id}:`, err);
            return { data: [] }; // Return an empty array or re-throw if critical
          })
        ]);
        setClientData(clientRes.data);
        setSupportRequests(supportRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      console.log("Fetching data for user:", user.id);
      fetchClientData();
    }
  }, [user]);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('handleSubmitRequest: Entering try block');
      console.log('Attempting to create support request with form data:', supportForm);
      const newRequest = {
        clientId: user.id,
        clientName: user.name,
        subject: supportForm.subject,
        // Ensure description is correctly included
        description: supportForm.description,
        priority: supportForm.priority,
        status: 'open',
        date: new Date().toISOString().split('T')[0],
        assignedTo: 'Support Team'
      };

      console.log('Sending new support request data:', newRequest);
      const res = await api.post('/support-requests', newRequest);
      console.log('handleSubmitRequest: API call successful, received response:', res);
      console.log('Support request created successfully:', res.data);
      setSupportRequests([...supportRequests, res.data]);
      setShowSupportModal(false);
      fetchClientData(); // Re-fetch data to show the correct initial status
      setSupportForm({ subject: '', description: '', priority: 'medium' });
    } catch (err) {
      console.log('handleSubmitRequest: Entering catch block');
      console.error('Error creating support request:', err.response?.data || err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
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

  const renderOverview = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!clientData) return <div className="text-center py-12">No client data found</div>;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, {clientData.name}!</h2>
          
          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Services</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.services?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Account Status</p>
                  <p className="text-lg font-semibold text-green-600 capitalize">{clientData.status || 'active'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{supportRequests.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => setShowSupportModal(true)}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">New Support Request</span>
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">View Billing</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <FileText className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Download Reports</span>
              </button>
              {/* <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Schedule Meeting</span>
              </button> */}
            </div>
          </div>

          {/* Recent Support Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Support Requests</h3>
                <button 
                  onClick={() => setActiveTab('support')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {supportRequests.slice(-3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{request.subject}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.priority)}`}>
                          {getPriorityIcon(request.priority)}
                          <span>{request.priority}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{request.description.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="text-xs text-gray-500">{request.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {supportRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No support requests yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServices = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!clientData) return <div className="text-center py-12">No client data found</div>;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Services</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Upgrade Services
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientData.services?.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                  {service.status || 'Active'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {service.description || `Your ${service.name.toLowerCase()} service is running smoothly.`}
              </p>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Manage
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
          {(!clientData.services || clientData.services.length === 0) && (
            <div className="col-span-2 text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No services assigned</p>
              <p className="text-gray-500 mb-6">Contact your account manager to get started with our services.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSupport = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Support Requests</h2>
          <button 
            onClick={() => setShowSupportModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supportRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.subject}</div>
                        <div className="text-sm text-gray-500">{request.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(request.priority)}`}>
                        {getPriorityIcon(request.priority)}
                        <span>{request.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {supportRequests.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No support requests yet</p>
              <p className="text-gray-500 mb-6">Create your first support request to get help from our team.</p>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create Support Request
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBilling = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!clientData) return <div className="text-center py-12">No client data found</div>;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Plan */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Billing Cycle</span>
                <span className="font-semibold text-gray-900">{clientData.billing?.cycle || 'Monthly'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Billing Date</span>
                <span className="font-semibold text-gray-900">
                  {clientData.billing?.nextDate || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">
                  {clientData.billing?.paymentMethod || 'Not set up'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => alert('Redirect to payment settings')}
              className="w-full mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Update Payment Method
            </button>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h3>
            <div className="space-y-3">
              {clientData.invoices?.length > 0 ? (
                clientData.invoices.slice(0, 3).map((invoice, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-gray-900">${invoice.amount}</div>
                      <div className="text-sm text-gray-500">{invoice.date}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {invoice.status}
                      </span>
                      <button 
                        onClick={() => alert(`Download invoice ${invoice.id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No invoices available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No messages to display.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600">Manage your services and support requests</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: Settings },
              { key: 'services', label: 'My Services', icon: Settings },
              { key: 'support', label: 'Support', icon: MessageSquare },
              { key: 'billing', label: 'Billing', icon: CreditCard },
              { key: 'messages', label: 'Messages', icon: MessageSquare }
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

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'support' && renderSupport()}
          {activeTab === 'billing' && renderBilling()}
          {activeTab === 'messages' && renderMessages()}
        </div>

        {/* Support Request Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create Support Request</h3>
                  <button 
                    onClick={() => setShowSupportModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm({...supportForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={supportForm.description}
                      onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed description of the issue or request"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button 
                      type="button"
                      onClick={() => setShowSupportModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Submit Request
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

export default ClientDashboard;