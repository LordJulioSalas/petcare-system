const VitalSigns = require('../models/VitalSigns');

let vitalSigns = [];
let nextId = 1;

const getAllVitalSigns = (req, res) => {
  res.json({ success: true, data: vitalSigns });
};

const getVitalSignsByPet = (req, res) => {
  const signs = vitalSigns.filter(v => v.petId === parseInt(req.params.petId));
  res.json({ success: true, data: signs });
};

const createVitalSigns = (req, res) => {
  const { petId, appointmentId, weight, temperature, heartRate, respiratoryRate, notes } = req.body;
  
  if (!petId || !weight || !temperature) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
  }

  const newVitalSigns = new VitalSigns(
    nextId++,
    petId,
    appointmentId,
    req.user.userId,
    weight,
    temperature,
    heartRate,
    respiratoryRate,
    notes,
    new Date().toISOString()
  );
  
  vitalSigns.push(newVitalSigns);
  res.status(201).json({ success: true, data: newVitalSigns });
};

module.exports = {
  getAllVitalSigns,
  getVitalSignsByPet,
  createVitalSigns
};
