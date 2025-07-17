import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ClientRegister from './pages/ClientRegister';
import AdminRegister from './pages/AdminRegister';
import AdminBilling from './components/AdminBilling';
import PrintInvoicePage from './pages/PrintInvoicePage';
import Splash from './components/Splash';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><ClientRegister /></Layout>} />
            <Route path="/register/admin" element={<Layout><AdminRegister /></Layout>} />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  {/* Render AdminDashboard component */}
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute requiredRole="client">
                  <Layout><ClientDashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="/print-invoice/:invoiceId" element={<PrintInvoicePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;