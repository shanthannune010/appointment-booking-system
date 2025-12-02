const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  reason: {
    type: String,
    maxlength: 200,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent double-booking
appointmentSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);


