import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true, trim: true },
  role: { type: String, default: 'admin' }, // always 'admin'
  designation: { type: String, trim: true }, // new field for user-typed value
  phone: { type: String, required: true, trim: true }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;