import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [assignedTo, setAssignedTo] = useState({}); // State to manage assigned person per ticket

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/support-requests/all'); // Corrected endpoint
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };
    fetchTickets();
  }, []); // Empty dependency array means this effect runs once on mount

  // Initialize assignedTo state when tickets are fetched
  useEffect(() => {
    const initialAssignedTo = {};
    tickets.forEach(ticket => {
      initialAssignedTo[ticket._id] = ticket.assignedTo || ''; // Initialize with existing assigned person or empty string
    });
    setAssignedTo(initialAssignedTo);
  }, [tickets]);

  const handleUpdateTicket = async (ticketId, newStatus, assignedPerson) => {
    try {
      const res = await api.put(`/support-requests/${ticketId}`, { status: newStatus, assignedTo: assignedPerson });
      // Update local state with the updated ticket
      setTickets(tickets.map(ticket => ticket._id === ticketId ? res.data : ticket));
    } catch (err) {
      console.error(`Error updating ticket status for ${ticketId}:`, err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
 case 'assigned': return 'text-blue-600 bg-blue-100 !important'; // Added !important as a diagnostic step
      case 'in-progress': return 'text-yellow-600 bg-yellow-100 !important'; // Added !important
      case 'resolved': return 'text-green-600 bg-green-100 !important'; // Added !important
      default: return 'text-gray-600 bg-gray-100 !important'; // Added !important
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map(ticket => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{ticket.description}</td> {/* Display full description */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(ticket.priority)}`}>
                      {getPriorityIcon(ticket.priority)}
                      <span>{ticket.priority}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={ticket.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        handleUpdateTicket(ticket._id, newStatus, assignedTo[ticket._id]); // Pass assignedTo as well
                      }}
                      className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${getStatusColor(ticket.status)}`}
                    >
                      <option value="open">Open</option>
 <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="text"
                      value={assignedTo[ticket._id] || ''}
                      onChange={(e) => setAssignedTo({ ...assignedTo, [ticket._id]: e.target.value })}
                      onBlur={(e) => handleUpdateTicket(ticket._id, ticket.status, e.target.value)} // Update on blur
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Add action buttons here if needed, e.g., View Details */}
                  </td>
                </tr>
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