# PushDiggy - IT Services Management System

A comprehensive web application for managing IT services, client relationships, billing, and support tickets. Built with React.js, Node.js, and MongoDB.

## 🚀 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Navigation & Routing](#navigation--routing)
- [Authentication System](#authentication-system)
- [Database Schema](#database-schema)
- [Code Structure](#code-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 📋 Overview

PushDiggy is a full-stack web application designed for IT service companies to manage:
- Client relationships and services
- Support ticket management
- Billing and invoicing
- Admin and client dashboards
- Service catalog management

## ✨ Features

### 🔐 Authentication & Authorization
- **Dual Role System**: Admin and Client accounts
- **Secure Login**: JWT-based authentication
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent login state

### 👥 User Management
- **Admin Dashboard**: Complete business management
- **Client Dashboard**: Service access and support
- **User Registration**: Separate flows for admin and clients
- **Profile Management**: User data and preferences

### 🎯 Service Management
- **Service Categories**: Camera, Printer, Website, Digital Marketing, Mobile Apps, IT Consultation
- **Service Catalog**: Detailed service listings with pricing
- **Service Assignment**: Link services to clients
- **Service Status**: Active/Inactive service management

### 🎫 Support System
- **Ticket Creation**: Client support request submission
- **Ticket Management**: Admin ticket assignment and resolution
- **Priority Levels**: High, Medium, Low priority classification
- **Status Tracking**: Open, In Progress, Resolved status
- **Billing Integration**: Ready for billing status

### 💰 Billing & Invoicing
- **Invoice Generation**: Professional invoice creation
- **Bill Management**: Complete billing lifecycle
- **Payment Tracking**: Payment status management
- **Invoice Templates**: Professional PDF invoice generation
- **Performa Invoices**: Quote generation system

### 📊 Dashboard Analytics
- **Overview Statistics**: Client count, services, tickets, revenue
- **Real-time Updates**: Live data synchronization
- **Filtering & Search**: Advanced data filtering
- **Pagination**: 10 items per page with navigation

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Modern UI**: Clean, professional interface
- **Interactive Elements**: Hover effects and animations
- **Accessibility**: WCAG compliant design

## 🛠 Tech Stack

### Frontend
- **React.js 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API calls
- **jsPDF**: PDF generation for invoices

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing
- **Nodemailer**: Email functionality

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **Postman**: API testing

## 📁 Project Structure

```
pushdiggy/
├── backend/                 # Backend Node.js application
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── server.js
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── data/          # Static data
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS styles
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Environment Variables section)

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pushdiggy
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📡 API Documentation

### Authentication Endpoints

#### Admin Registration
```http
POST /admin/register
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Client Registration
```http
POST /client/register
Content-Type: application/json

{
  "name": "Client Name",
  "email": "client@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "company": "Company Name"
}
```

#### Client Login
```http
POST /clients/login
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "password123"
}
```

### Client Management

#### Get All Clients
```http
GET /clients
Authorization: Bearer <token>
```

#### Create Client
```http
POST /clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+1234567890",
  "company": "Company Name",
  "services": ["service1", "service2"]
}
```

#### Update Client
```http
PUT /clients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "active"
}
```

### Support Tickets

#### Create Support Ticket
```http
POST /support-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientId": "client_id",
  "subject": "Technical Issue",
  "description": "Detailed description",
  "priority": "high"
}
```

#### Get All Tickets (Admin)
```http
GET /support-requests/all
Authorization: Bearer <token>
```

#### Get Client Tickets
```http
GET /support-requests/client/:clientId
Authorization: Bearer <token>
```

#### Update Ticket
```http
PUT /support-requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved",
  "assignedTo": "admin_id",
  "resolutionDetails": "Issue resolved"
}
```

### Billing

#### Create Bill
```http
POST /billing/bills
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientId": "client_id",
  "subject": "Service Invoice",
  "items": [
    {
      "description": "Web Development",
      "quantity": 1,
      "rate": 1000,
      "amount": 1000
    }
  ],
  "invoiceType": "invoice"
}
```

#### Get All Bills
```http
GET /billing/bills
Authorization: Bearer <token>
```

#### Get Client Bills
```http
GET /billing/bills/client/:clientId
Authorization: Bearer <token>
```

## 🧭 Navigation & Routing

### Public Routes
- `/` - Splash screen
- `/home` - Home page
- `/about` - About page
- `/services` - Services overview
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Client registration
- `/register/admin` - Admin registration

### Service Category Routes
- `/camera-services` - Camera services page
- `/printer-services` - Printer services page
- `/website-services` - Website services page
- `/digital-marketing-services` - Digital marketing services page
- `/mobile-app-services` - Mobile app services page
- `/it-consultation-services` - IT consultation services page

### Protected Routes

#### Admin Routes
- `/admin-dashboard` - Admin dashboard
- `/admin/camera-services` - Admin camera services
- `/admin/printer-services` - Admin printer services
- `/admin/website-services` - Admin website services
- `/admin/digital-marketing-services` - Admin digital marketing services
- `/admin/mobile-app-services` - Admin mobile app services
- `/admin/it-consultation-services` - Admin IT consultation services

#### Client Routes
- `/client-dashboard` - Client dashboard

### Special Routes
- `/print-invoice/:invoiceId` - Invoice print page

## 🔐 Authentication System

### User Roles
1. **Admin**: Full system access
   - Manage clients and services
   - Handle support tickets
   - Create and manage bills
   - View analytics and reports

2. **Client**: Limited access
   - View assigned services
   - Create support tickets
   - View bills and invoices
   - Access client dashboard

### Authentication Flow
1. **Registration**: User creates account with role
2. **Login**: User authenticates with email/password
3. **Token Generation**: JWT token created and stored
4. **Route Protection**: Protected routes check token and role
5. **Session Management**: Token stored in localStorage

### Protected Route Implementation
```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

## 🗄 Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (admin/client),
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Client Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  company: String,
  services: [String],
  status: String (active/inactive),
  amc: Boolean,
  joinDate: Date,
  inactiveDate: Date
}
```

### Support Request Schema
```javascript
{
  _id: ObjectId,
  ticketNumber: String,
  clientId: ObjectId (ref: Client),
  subject: String,
  description: String,
  priority: String (high/medium/low),
  status: String (open/in-progress/resolved),
  assignedTo: ObjectId (ref: Admin),
  date: Date,
  resolvedDate: Date,
  resolvedBy: ObjectId (ref: Admin),
  resolutionDetails: String,
  readyForBilling: Boolean
}
```

### Bill Schema
```javascript
{
  _id: ObjectId,
  invoiceNumber: String,
  clientId: ObjectId (ref: Client),
  subject: String,
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  subtotal: Number,
  tax: Number,
  grandTotal: Number,
  invoiceType: String (invoice/performa),
  date: Date,
  isCompleted: Boolean,
  completedBy: ObjectId (ref: Admin)
}
```

## 📝 Code Structure

### Frontend Components

#### Layout Components
- `Layout.jsx` - Main layout wrapper
- `Navbar.jsx` - Navigation bar
- `Footer.jsx` - Footer component
- `ProtectedRoute.jsx` - Route protection

#### Dashboard Components
- `AdminDashboard.jsx` - Admin dashboard
- `ClientDashboard.jsx` - Client dashboard
- `AdminBilling.jsx` - Admin billing management
- `AdminBills.jsx` - Bills listing component
- `AdminSupportTickets.jsx` - Support tickets management

#### Form Components
- `EditBillModal.jsx` - Bill editing modal
- `InvoiceTemplate.jsx` - Invoice PDF template

#### Utility Components
- `ConfettiRain.jsx` - Celebration animation
- `ServiceNavigation.jsx` - Service navigation

### Backend Structure

#### Controllers
- `adminController.js` - Admin operations
- `clientController.js` - Client operations
- `serviceController.js` - Service management
- `supportController.js` - Support ticket operations
- `billingController.js` - Billing operations
- `contactController.js` - Contact form handling
- `otpController.js` - OTP functionality

#### Models
- `admin.js` - Admin user model
- `client.js` - Client model
- `Service.js` - Service model
- `SupportRequest.js` - Support ticket model
- `Bill.js` - Bill model
- `Contact.js` - Contact message model

#### Middleware
- `auth.js` - Authentication middleware

#### Utils
- `hash.js` - Password hashing
- `sendOtp.js` - OTP sending functionality

### Code Standards

#### JavaScript/React
- **Functional Components**: Use React hooks
- **ES6+ Features**: Arrow functions, destructuring, spread operator
- **Component Naming**: PascalCase for components
- **File Naming**: PascalCase for components, camelCase for utilities

#### CSS/Styling
- **Tailwind CSS**: Utility-first approach
- **Responsive Design**: Mobile-first methodology
- **Component Styling**: Inline Tailwind classes
- **Custom CSS**: Minimal custom CSS, prefer Tailwind utilities

#### State Management
- **React Context**: For global state (authentication)
- **Local State**: useState for component-specific state
- **Props**: For parent-child communication

## 🚀 Deployment

### Backend Deployment (Heroku)
1. **Create Heroku app**
2. **Set environment variables**
3. **Deploy using Git**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Netlify)
1. **Build the project**
   ```bash
   npm run build
   ```
2. **Deploy to Netlify**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Environment Variables for Production
```env
# Backend
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password

# Frontend
VITE_API_URL=your_production_backend_url
```

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create pull request**

### Code Review Guidelines
- **Follow existing code style**
- **Add comments for complex logic**
- **Test thoroughly before submitting**
- **Update documentation if needed**

### Testing
- **Manual Testing**: Test all features thoroughly
- **Cross-browser Testing**: Test on Chrome, Firefox, Safari
- **Mobile Testing**: Test on various screen sizes
- **API Testing**: Use Postman for API testing

## 📞 Support

For support and questions:
- **Email**: pushdiggy@gmail.com
- **Phone**: +91 86087-06864
- **Office**: Acharapakkam, Chengalpattu, Tamilnadu 603301

## 📄 License

This project is proprietary software. All rights reserved.

---

**PushDiggy** - Transforming IT Services Management 