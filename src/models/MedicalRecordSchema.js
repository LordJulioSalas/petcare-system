const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  veterinarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    default: ''
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

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
