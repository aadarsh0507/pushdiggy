import React, { useState, useEffect } from 'react';
import { Users, Search, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import api from '../api/api';

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch admin users from backend
  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/admins');
        setAdminUsers(res.data);
      } catch (err) {
        console.error('Error fetching admin users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminUsers();
  }, []);

  // Filter admin users based on search term
  const filteredAdminUsers = adminUsers.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Admin Users</h2>
        </div>
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Admin Users</h2>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 rounded-lg shadow mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, employee ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Admin Users Table - Takes remaining space */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            <table className="w-full h-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentItems(filteredAdminUsers).length > 0 ? (
                  getCurrentItems(filteredAdminUsers).map((admin, index) => (
                    <tr key={admin._id} className="hover:bg-gray-50">
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-500">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-3 w-3 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                            <div className="text-xs text-gray-500">{admin.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-900">{admin.email}</td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-500">{admin.employeeId || 'N/A'}</td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-500">{admin.department || 'N/A'}</td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-500">{admin.phone || 'N/A'}</td>
                      <td className="px-4 py-1 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                          {admin.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                            title="Edit Admin"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Delete Admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                                      <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                    {searchTerm ? 'No admin users found matching your search.' : 'No admin users found.'}
                  </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Fixed at bottom */}
        <div className="mt-4">
          {renderPagination(filteredAdminUsers)}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 