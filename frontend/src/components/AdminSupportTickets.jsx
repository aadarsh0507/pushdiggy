import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { CheckCircle, Clock, AlertTriangle, Eye, Edit, Save, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [assignedTo, setAssignedTo] = useState({});
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [editingTicketId, setEditingTicketId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [viewingTicketId, setViewingTicketId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState({ startDate: '', endDate: '' });
  const [filterClient, setFilterClient] = useState('All');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Fetch tickets
    const fetchTickets = async () => {
      try {
        const res = await api.get('/support-requests/all');
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };

    // Fetch admins
    const fetchAdmins = async () => {
      try {
        const res = await api.get('admin/admins'); // Changed endpoint to match backend routing
        setAdmins(res.data);
      } catch (err) {
        console.error('Error fetching admins:', err);
      }
    };

    // Fetch clients
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };

    fetchTickets();
    fetchAdmins();
    fetchClients();
  }, []);

  useEffect(() => {
    const initialAssignedTo = {};
    tickets.forEach(ticket => {
      initialAssignedTo[ticket._id] = ticket.assignedTo || '';
    });
    setAssignedTo(initialAssignedTo);
  }, [tickets]);

  // Effect to update filtered tickets when filters change
  const filteredTickets = tickets.filter(ticket => {
    // Apply status, priority, date range, and client filters
    const statusMatch = filterStatus === 'All' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || ticket.priority === filterPriority;
    const clientMatch = filterClient === 'All' || (ticket.clientId && ticket.clientId._id === filterClient);
    const dateMatch = (!filterDateRange.startDate || new Date(ticket.date) >= new Date(filterDateRange.startDate)) && (!filterDateRange.endDate || new Date(ticket.date) <= new Date(filterDateRange.endDate));
    return statusMatch && priorityMatch && clientMatch && dateMatch;
  });

  const handleUpdateTicket = async (ticketId, updatedFields) => {
    try {
      const res = await api.put(`/support-requests/${ticketId}`, updatedFields);
      const updatedTicket = res.data;
  
      console.log("Backend response data structure:", updatedTicket);
      console.log("Value of res.data.assignedTo after update:", updatedTicket.assignedTo);
  
      // ✅ Update tickets with the new fully populated ticket
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket._id === ticketId ? updatedTicket : ticket
        )
      );
  
      // ✅ Optional: update assignedTo state map for controlled dropdown
      setAssignedTo(prev => ({
        ...prev,
        [ticketId]: updatedTicket.assignedTo?._id || '',
      }));
  
      // ✅ Optional: trigger any listeners
      window.dispatchEvent(new Event('ticketUpdatedEvent'));
  
      return updatedTicket; // Return in case caller wants to use it
    } catch (err) {
      console.error(`Error updating ticket for ${ticketId}:`, err);
      throw err;
    }
  };
  
  

  const handleViewDetails = (ticketId) => {
    setViewingTicketId(viewingTicketId === ticketId ? null : ticketId);
  };

  const handleEditTicket = (ticketId) => {
    setEditingTicketId(ticketId);
    const ticketToEdit = tickets.find(ticket => ticket._id === ticketId);
    setEditFormData({
      resolvedBy: ticketToEdit.resolvedBy || '',
      resolutionDetails: ticketToEdit.resolutionDetails || '',
 resolutionDetailsRequired: ticketToEdit.status === 'resolved' && ticketToEdit.readyForBilling,
      status: ticketToEdit.status,
 readyForBilling: ticketToEdit.readyForBilling || false,
    });
  };

  const handleSaveEdit = async (ticketId) => {
    try {
      await handleUpdateTicket(ticketId, editFormData);
      setEditingTicketId(null);
      setEditFormData({});
    } catch (err) {
      console.error(`Error saving ticket ${ticketId}:`, err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTicketId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <span className="text-red-600"><AlertTriangle className="h-4 w-4" /></span>;
      case 'medium': return <span className="text-yellow-600"><Clock className="h-4 w-4" /></span>;
      case 'low': return <span className="text-green-600"><CheckCircle className="h-4 w-4" /></span>;
      // Adding icons for other potential priorities if needed
      case 'critical': return <span className="text-purple-600"><AlertTriangle className="h-4 w-4" /></span>; // Example for a critical priority
      case 'urgent': return <span className="text-orange-600"><AlertTriangle className="h-4 w-4" /></span>; // Example for an urgent priority
      default: return null;
    }
  };

 const handleBillingReadyChange = async (ticketId, isChecked) => {
 // Check if user exists and has an id
 if (!user || !user.id) {
   console.error('User not found or missing id:', user);
   alert('User authentication error. Please log in again.');
   return;
 }

 const ticketToUpdate = tickets.find(ticket => ticket._id === ticketId);

 if (isChecked && ticketToUpdate.status === 'resolved') {
 if (!ticketToUpdate.resolvedBy || !ticketToUpdate.resolutionDetails) {
      alert('Please fill in "Resolved By" and "Resolution Details" before marking as Ready for Billing.');
      // Prevent the checkbox from being checked visually
      return;
    }
  }

 try {
   console.log('Sending request with:', { ticketId, adminId: user.id });
   const response = await api.put(`/support-requests/${ticketId}/toggle-billing-ready`, {
     adminId: user.id
   });

   console.log('Response received:', response.data);

   // Update the ticket in state with the new data
   setTickets(prevTickets =>
     prevTickets.map(ticket =>
       ticket._id === ticketId ? response.data : ticket
     )
   );
 } catch (error) {
   console.error('Error toggling billing ready status:', error);
   console.error('Error response:', error.response?.data);
   console.error('Error status:', error.response?.status);
   alert(`Failed to update billing ready status: ${error.response?.data?.message || error.message}`);
 }
 };

 // Helper function to check if current admin has marked this ticket as billing ready
 const isBillingReadyByCurrentAdmin = (ticket) => {
   return ticket.billingReadyBy && ticket.billingReadyBy._id === user.id;
 };

 // Helper function to check if any admin has marked this ticket as billing ready
 const isBillingReadyByAnyAdmin = (ticket) => {
   return ticket.readyForBilling && ticket.billingReadyBy;
 };

  // Pagination functions
  const getCurrentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = (items) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = (totalItems) => {
    const totalPages = getTotalPages(totalItems);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems.length)} of {totalItems.length} results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === number
                  ? 'text-white bg-blue-600 border border-blue-600'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };


 return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h1>

      {/* Wrap filter section, table section, and no tickets message in a single parent div */}
      <div>
      {editingTicketId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Ticket</h3>
            <div className="mb-4">
              <label htmlFor="resolvedBy" className="block text-sm font-medium text-gray-700">Resolved By</label>
              <select
                id="resolvedBy"
                name="resolvedBy"
                value={editFormData.resolvedBy}
                onChange={(e) => setEditFormData({ ...editFormData, resolvedBy: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select Admin</option>
                {admins.map(admin => (
                  <option key={admin._id} value={admin._id}>{admin.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="resolutionDetails" className="block text-sm font-medium text-gray-700">Resolution Details</label>
              <textarea
                id="resolutionDetails"
                name="resolutionDetails"
                rows="3"
                value={editFormData.resolutionDetails}
                onChange={(e) => setEditFormData({ ...editFormData, resolutionDetails: e.target.value })}
 required={editFormData.resolutionDetailsRequired}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={() => handleSaveEdit(editingTicketId)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center">
        {/* Filter by Status */}
        <div className="flex flex-col">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by Status:</label>
          <div className="mt-1">

            <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="All">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>

          </select>
</div>
        </div>

        {/* Filter by Priority */}
        <div className="flex flex-col">
          <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700">Filter by Priority:</label>
          <div className="mt-1">
            <select
              id="priorityFilter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="All">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Filter by Date Range */}
        <div className="flex flex-col">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
          <div className="mt-1">
            <input type="date" id="startDate" value={filterDateRange.startDate} onChange={(e) => setFilterDateRange({ ...filterDateRange, startDate: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
          <div className="mt-1">
            <input type="date" id="endDate" value={filterDateRange.endDate} onChange={(e) => setFilterDateRange({ ...filterDateRange, endDate: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
        </div>

        {/* Filter by Client */}
        <div className="flex flex-col">
          <label htmlFor="clientFilter" className="block text-sm font-medium text-gray-700">Filter by Client:</label>
          <div className="mt-1">


          <select
            id="clientFilter"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="All">All Clients</option>
            {clients.map(client => (<option key={client._id} value={client._id}>{client.name}</option>))}
          </select>
        </div>
      </div></div>



 <div className="bg-white rounded-lg shadow">
          
 <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket #</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentItems(filteredTickets).map((ticket, index) => (
                <React.Fragment key={ticket._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={ticket.subject}>{ticket.subject}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.ticketNumber}</td>
                    <td className="px-3 py-4 text-sm text-gray-900 max-w-32 truncate" title={ticket.clientId?.name || 'N/A'}>
                      {ticket.clientId?.name || 'N/A'}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit`}>
                        {getPriorityIcon(ticket.priority)}
                        <span className="hidden sm:inline">{ticket.priority}</span>
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <select
                        value={ticket.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          handleUpdateTicket(ticket._id, { status: newStatus, assignedTo: assignedTo[ticket._id] });
                        }}
                        className={`mt-1 block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${getStatusColor(ticket.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={ticket.assignedTo?._id || ''}
                        onChange={async (e) => {
                          const newAssignedToId = e.target.value;
                          const fallbackAdmin = admins.find(admin => admin._id === newAssignedToId) || null;
                          setTickets(prev =>
                            prev.map(t => {
                              if (t._id === ticket._id) {
                                return { ...t, assignedTo: fallbackAdmin };
                              }
                              return t;
                            })
                          );
                          try {
                            const updatedTicket = await handleUpdateTicket(ticket._id, {
                              assignedTo: newAssignedToId || null,
                            });
                            setTickets(prev =>
                              prev.map(t =>
                                t._id === ticket._id ? { ...t, assignedTo: fallbackAdmin } : t
                              ))
                          } catch (error) {
                            console.error('Failed to update assignment:', error);
                          }
                        }}
                        className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Unassigned</option>
                        {admins.map(admin => (
                          <option key={admin._id} value={admin._id}>
                            {admin.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewDetails(ticket._id)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="View Details"
                          disabled={editingTicketId !== null}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditTicket(ticket._id)}
                          className="text-green-600 hover:text-green-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Ticket"
                          disabled={isBillingReadyByCurrentAdmin(ticket)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={ticket.readyForBilling || false}
                        onChange={(e) => handleBillingReadyChange(ticket._id, e.target.checked)}
                        disabled={ticket.status !== 'resolved' || isBillingReadyByCurrentAdmin(ticket)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title={ticket.status !== 'resolved' ? 'Ticket must be resolved first' : 'Mark as ready for billing'}
                      />
                    </td>
                  </tr>
                  {viewingTicketId === ticket._id && (
                    <tr className="bg-gray-100">
                      <td colSpan="10" className="px-6 py-4 text-sm text-gray-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Full Description:</p>
                            <p className="whitespace-pre-wrap">{ticket.description}</p>
                          </div>
                          {(ticket.resolvedBy || ticket.resolutionDetails) && (
                            <div>
                               <p className="text-sm font-medium text-gray-500 mb-1">Resolved By:</p>
 <p>{ticket.resolvedBy && admins && admins.length > 0 ? (admins.find(admin => admin._id === ticket.resolvedBy)?.name || 'Unknown Admin') : 'N/A'} (Raw: {JSON.stringify(ticket.resolvedBy)})</p>
 <p className="text-sm font-medium text-gray-500 mt-4 mb-1">Resolution Details:</p>
                              <p className="whitespace-pre-wrap">{ticket.resolutionDetails || 'N/A'}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No support tickets found.</p>
          </div>
        )}
        
        {renderPagination(filteredTickets)}
      </div>
    </div>
  );
};

export default AdminSupportTickets;