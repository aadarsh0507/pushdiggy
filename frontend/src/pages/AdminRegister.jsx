// src/pages/AdminRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/api';              // <-- centralised Axios instance

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    role: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requiredFields = [
    'name', 'email', 'password',
    'employeeId', 'department', 'role', 'phone'
  ];

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // simple front-end validation
    const missing = requiredFields.find(f => !formData[f].trim());
    if (missing) return setError(`Please fill in the ${missing} field.`);

    try {
      setLoading(true);
      await api.post('/admin/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        employeeId: formData.employeeId,
        department: formData.department,
        role: 'admin', // always send 'admin'
        phone: formData.phone,
        designation: formData.designation // send user-typed value
      });
      setSuccess('Admin registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Registration failed, please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Admin Registration</h2>

        {/* Alerts */}
        {error && (
          <Alert text={error} variant="error" Icon={AlertCircle} />
        )}
        {success && (
          <Alert text={success} variant="success" Icon={CheckCircle2} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name"        placeholder="Full Name"         value={formData.name}        onChange={handleChange} />
          <Input type="email" name="email" placeholder="Email"     value={formData.email}       onChange={handleChange} />
          <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <Input name="employeeId"  placeholder="Employee ID"       value={formData.employeeId}  onChange={handleChange} />
          <Input name="department"  placeholder="Department"        value={formData.department}  onChange={handleChange} />
          <Input name="role"        placeholder="Role/Designation"  value={formData.role}        onChange={handleChange} />
          <Input name="designation" placeholder="Role/Designation"  value={formData.designation} onChange={handleChange} />
          <Input type="tel"  name="phone" placeholder="Contact Number" value={formData.phone}   onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded 
              ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Registering…' : 'Register as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Re-usable small components                                         */
const Input = ({ name, placeholder, value, onChange, type = 'text' }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    required
    value={value}
    onChange={onChange}
    className="w-full px-4 py-2 border border-gray-300 rounded"
  />
);

const Alert = ({ text, variant, Icon }) => (
  <div
    className={`p-3 rounded mb-4 flex items-center text-sm
      ${variant === 'error'
        ? 'bg-red-50 text-red-700 border border-red-200'
        : 'bg-green-50 text-green-700 border border-green-200'}`}
  >
    <Icon className="h-4 w-4 mr-2" />
    {text}
  </div>
);

export default AdminRegister;
