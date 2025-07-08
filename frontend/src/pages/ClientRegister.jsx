// src/pages/ClientRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail, Lock, User, Building2, Phone, KeyRound } from 'lucide-react';
import api from '../api/api';

const ClientRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    otp: '',
 
 password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    try {
      const { name, company, phone, email, address } = formData;
      if (!name || !company || !phone || !email || !address) {
        return setMessage({ type: 'error', text: 'Please fill in all fields.' });
      }
      await api.post('/auth/send-otp', { email, name, company, phone, address });
      setMessage({ type: 'success', text: 'OTP sent to email.' });
      setStep(2);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send OTP' });
    }
  };

  const verifyAndRegister = async e => {
    e.preventDefault();
    const { otp, password, confirmPassword, email, name, company, phone, address } = formData;

    if (!otp || !password || !confirmPassword) {
      return setMessage({ type: 'error', text: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }

    try {
      await api.post('/auth/verify-otp-register', {
        email,
        otp,
        password,
        name,
        company,
        phone,
 address,
        role: 'client' // optional if backend already defaults it
      });
      setMessage({ type: 'success', text: 'Registration successful! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
          {step === 1 ? 'Register Client Details' : 'Verify OTP & Set Password'}
        </h2>

        {message.text && (
          <div
            className={`flex items-center text-sm p-3 rounded mb-4 ${
              message.type === 'error'
                ? 'text-red-700 bg-red-50 border border-red-200'
                : 'text-green-700 bg-green-50 border border-green-200'
            }`}
          >
            {message.type === 'error' ? <AlertCircle className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
            <Input icon={User} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            <Input icon={Building2} name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
            <Input icon={Phone} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            <Input icon={Mail} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <Input icon={Building2} name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyAndRegister} className="space-y-4">
            <Input icon={KeyRound} name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} />
            <Input icon={Lock} type="password" name="password" placeholder="New Password" value={formData.password} onChange={handleChange} />
            <Input icon={Lock} type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
              Verify & Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 text-gray-400" />
    <input {...props} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
  </div>
);

export default ClientRegister;
