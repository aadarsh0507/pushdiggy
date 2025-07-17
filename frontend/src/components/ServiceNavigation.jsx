import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceNavigation = ({ title, backTo = "/services" }) => {
  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={backTo}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Back to Services</span>
            </Link>
            <div className="text-gray-400">|</div>
            <Link
              to="/admin-dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Admin Dashboard</span>
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default ServiceNavigation; 