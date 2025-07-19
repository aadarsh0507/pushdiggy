import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ServiceNavigation = ({ title, backTo = "/services" }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              // Admin navigation - back to admin dashboard services tab
              <Link
                to="/admin-dashboard?tab=services"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back to Admin Services</span>
              </Link>
            ) : (
              // Regular user navigation - back to services
              <Link
                to={backTo}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back to Services</span>
              </Link>
            )}
            
            {isAdmin && (
              <>
                <div className="text-gray-400">|</div>
                <Link
                  to="/admin-dashboard"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <Home className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Admin Dashboard</span>
                </Link>
              </>
            )}
          </div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default ServiceNavigation; 