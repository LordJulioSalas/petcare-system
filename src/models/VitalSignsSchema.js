const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  assistantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  weight: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  heartRate: {
    type: Number
  },
  respiratoryRate: {
    type: Number
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VitalSigns', vitalSignsSchema);
