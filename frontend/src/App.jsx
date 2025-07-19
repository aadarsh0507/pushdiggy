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
import Splash from './pages/Splash';
import CameraServices from './pages/CameraServices';
import PrinterServices from './pages/PrinterServices';
import WebsiteServices from './pages/WebsiteServices';
import DigitalMarketingServices from './pages/DigitalMarketingServices';
import MobileAppServices from './pages/MobileAppServices';
import ITConsultationServices from './pages/ITConsultationServices';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {" "}
            {/* ✅ wrap all Route inside Routes */}
            <Route path="/" element={<Splash />} />
            <Route
              path="/home"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
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
            
            {/* Service Category Routes - User Access */}
            <Route
              path="/camera-services"
              element={
                <Layout>
                  <CameraServices />
                </Layout>
              }
            />
            <Route
              path="/printer-services"
              element={
                <Layout><PrinterServices /></Layout>
              }
            />
            <Route
              path="/website-services"
              element={
                <Layout><WebsiteServices /></Layout>
              }
            />
            <Route
              path="/digital-marketing-services"
              element={
                <Layout><DigitalMarketingServices /></Layout>
              }
            />
            <Route
              path="/mobile-app-services"
              element={
                <Layout><MobileAppServices /></Layout>
              }
            />
            <Route
              path="/it-consultation-services"
              element={
                <Layout><ITConsultationServices/></Layout>
              }
            />

            {/* Admin Service Category Routes - With Admin Navigation */}
            <Route
              path="/admin/camera-services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <CameraServices showAdminNav={true} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/printer-services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><PrinterServices showAdminNav={true} /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/website-services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><WebsiteServices showAdminNav={true} /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/digital-marketing-services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><DigitalMarketingServices showAdminNav={true} /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mobile-app-services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><MobileAppServices showAdminNav={true} /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/it-consultation-services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><ITConsultationServices showAdminNav={true} /></Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;