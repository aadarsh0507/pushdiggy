import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true, trim: true },
  designation: { type: String, trim: true }, // optional
  phone: { type: String, required: true, trim: true },
  role: { type: String, default: 'admin', enum: ['admin'] }, // always admin
  status: { type: String, default: 'active', enum: ['active', 'inactive'] } // ✅ include this
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
