const VitalSignsModel = require('../models/VitalSignsSchema');

const getAllVitalSigns = async (req, res) => {
  try {
    const signs = await VitalSignsModel.find()
      .populate('petId')
      .populate('assistantId', 'name')
      .sort({ date: -1 });
    res.json({ success: true, data: signs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVitalSignsByPet = async (req, res) => {
  try {
    const signs = await VitalSignsModel.find({ petId: req.params.petId })
      .populate('assistantId', 'name')
      .sort({ date: -1 });
    res.json({ success: true, data: signs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVitalSigns = async (req, res) => {
  try {
    const { petId, appointmentId, weight, temperature, heartRate, respiratoryRate, notes } = req.body;
    
    if (!petId || !weight || !temperature) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    const newVitalSigns = new VitalSignsModel({
      petId,
      appointmentId,
      assistantId: req.user?.userId,
      weight,
      temperature,
      heartRate,
      respiratoryRate,
      notes
    });
    
    await newVitalSigns.save();
    res.status(201).json({ success: true, data: newVitalSigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllVitalSigns,
  getVitalSignsByPet,
  createVitalSigns
};
