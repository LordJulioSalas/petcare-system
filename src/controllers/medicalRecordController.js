const MedicalRecord = require('../models/MedicalRecord');

let medicalRecords = [];
let nextId = 1;

const getAllRecords = (req, res) => {
  res.json({ success: true, data: medicalRecords });
};

const getRecordsByPet = (req, res) => {
  const records = medicalRecords.filter(r => r.petId === parseInt(req.params.petId));
  res.json({ success: true, data: records });
};

const createRecord = (req, res) => {
  const { petId, appointmentId, veterinarianId, diagnosis, treatment, notes } = req.body;
  
  if (!petId || !diagnosis) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
  }

  const newRecord = new MedicalRecord(
    nextId++,
    petId,
    appointmentId,
    veterinarianId,
    diagnosis,
    treatment,
    notes,
    new Date().toISOString()
  );
  
  medicalRecords.push(newRecord);
  res.status(201).json({ success: true, data: newRecord });
};

const updateRecord = (req, res) => {
  const recordIndex = medicalRecords.findIndex(r => r.id === parseInt(req.params.id));
  if (recordIndex === -1) {
    return res.status(404).json({ success: false, message: 'Registro no encontrado' });
  }

  medicalRecords[recordIndex] = { ...medicalRecords[recordIndex], ...req.body, id: medicalRecords[recordIndex].id };
  res.json({ success: true, data: medicalRecords[recordIndex] });
};

module.exports = {
  getAllRecords,
  getRecordsByPet,
  createRecord,
  updateRecord
};
