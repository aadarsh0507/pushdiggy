import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    trim: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false, // Changed to false to allow bills for non-clients
  },

  billTo: {
    name: {
      type: String,
      required: true,
    },
    address: { type: String }, // Address is not strictly required based on the frontend form, but can be added
    gstin: { type: String },
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  items: [{
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
   quantity : {
      type: Number,
      required: true,
    },
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  sgst: {
    type: Number,
    required: true,
  },
  cgst: {
    type: Number,
    required: true,
  },
  sgstPercent: {
    type: Number,
    required: true,
  },
  cgstPercent: {
    type: Number,
    required: true,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  bankDetails: {
    accountName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    ifscCode: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid'],
    default: 'sent',
  },
}, { timestamps: true });

console.log('Bill model loaded. Schema:', billSchema.obj);

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
