import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
  },
  sequenceNumber: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', CounterSchema);

export default Counter;