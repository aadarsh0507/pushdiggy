import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { CheckCircle, Clock, AlertTriangle, Eye, Edit, Save, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [assignedTo, setAssignedTo] = useState({});
  const navigate = useNavigate();

  const [editingTicketId, setEditingTicketId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [viewingTicketId, setViewingTicketId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState({ startDate: '', endDate: '' });

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
        const res = await api.get('/admin/admins'); // Changed endpoint to match backend routing
        setAdmins(res.data);
      } catch (err) {
        console.error('Error fetching admins:', err);
      }
    };

    fetchTickets();
    fetchAdmins();
  }, []);

  useEffect(() => {
    const initialAssignedTo = {};
    tickets.forEach(ticket => {
      initialAssignedTo[ticket._id] = ticket.assignedTo || '';
    });
    setAssignedTo(initialAssignedTo);
  }, [tickets]);

  const handleUpdateTicket = async (ticketId, updatedFields) => {
    try {
      const res = await api.put(`/support-requests/${ticketId}`, updatedFields);
      console.log("Updated ticket data from backend:", res.data); // Log updated data
      window.dispatchEvent(new Event('ticketUpdatedEvent')); // Dispatch custom event
      setTickets(tickets.map(ticket => (ticket._id === ticketId ? res.data : ticket)));
    } catch (err) {
      console.error(`Error updating ticket for ${ticketId}:`, err);
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
      status: ticketToEdit.status,
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
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h1>

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

      <div className="mb-6 flex space-x-4 items-center">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by Status:</label>
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
        <div>

          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
          <input type="date" id="startDate" value={filterDateRange.startDate} onChange={(e) => setFilterDateRange({ ...filterDateRange, startDate: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
          <input type="date" id="endDate" value={filterDateRange.endDate} onChange={(e) => setFilterDateRange({ ...filterDateRange, endDate: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
      </div>



      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ready for Billing</th>
                 </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets
                .filter(ticket => {
                  // Status Filter
                  if (filterStatus === 'All') {
                    if (ticket.status === 'resolved') return false; // Exclude resolved for 'All'
                  } else if (ticket.status !== filterStatus) {
                    return false; // Filter by specific status
                  }
                  // Date Range Filter (based on creation date)
                  const ticketDate = new Date(ticket.date);
                  if (filterDateRange.startDate && ticketDate < new Date(filterDateRange.startDate)) return false;
                  if (filterDateRange.endDate && ticketDate > new Date(filterDateRange.endDate)) return false;
                  return true;
                }).map(ticket => (
                <React.Fragment key={ticket._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">{ticket.subject}</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{ticket.clientName}</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{ticket.clientId?.company}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="max-h-12 overflow-hidden text-ellipsis">{ticket.description}</div> {/* Apply max-height and ellipsis */}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(ticket.priority)}`}>
                        {getPriorityIcon(ticket.priority)}
                        <span>{ticket.priority}</span>
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <select
                        value={ticket.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          handleUpdateTicket(ticket._id, { status: newStatus, assignedTo: assignedTo[ticket._id] });
                        }}
                        className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${getStatusColor(ticket.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.date).toLocaleDateString()}
                    </td>
 <td className="px-6 py-4 text-sm text-gray-500">
                      {ticket.status === 'resolved' && ticket.resolvedDate
                        ? new Date(ticket.resolvedDate).toLocaleDateString() : '-'}
                    </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
 value={ticket.assignedTo?._id || ''}
                        onChange={async (e) => {
                          const newAssignedToId = e.target.value;
                          // Update local state immediately for responsiveness
                          setTickets(prevTickets => prevTickets.map(prevTicket =>
                            prevTicket._id === ticket._id
                              ? { ...prevTicket, assignedTo: newAssignedToId ? { _id: newAssignedToId, name: admins.find(admin => admin._id === newAssignedToId)?.name || 'Unknown Admin' } : null }
                              : prevTicket
                          ));
                          await handleUpdateTicket(ticket._id, { assignedTo: newAssignedTo });
 }}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
 <option value="">Unassigned</option>
 {admins.map(admin => (<option key={admin._id} value={admin._id}>{admin.name}</option>))}
 </select>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(ticket._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                          disabled={editingTicketId !== null}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditTicket(ticket._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Ticket"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>

                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={ticket.readyForBilling || false}
                        onChange={async (e) => { // Mark the handler as async
                          await handleUpdateTicket(ticket._id, { readyForBilling: e.target.checked }); // Ensure update completes
                          console.log('Ready for Billing checkbox toggled. New value:', e.target.checked);
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
 <p>{ticket.resolvedBy ? (admins.find(admin => admin._id === ticket.resolvedBy)?.name || 'Unknown Admin') : 'N/A'}</p>
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
        {tickets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No support tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportTickets;