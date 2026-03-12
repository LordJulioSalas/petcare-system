const MedicalRecordModel = require('../models/MedicalRecordSchema');

const getAllRecords = async (req, res) => {
  try {
    const records = await MedicalRecordModel.find()
      .populate('petId')
      .populate('veterinarianId', 'name email')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecordModel.findById(req.params.id)
      .populate('petId')
      .populate('veterinarianId', 'name email');
    
    if (!record) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecordsByPet = async (req, res) => {
  try {
    const records = await MedicalRecordModel.find({ petId: req.params.petId })
      .populate('veterinarianId', 'name email')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRecord = async (req, res) => {
  try {
    const { petId, appointmentId, veterinarianId, diagnosis, treatment, notes } = req.body;
    
    if (!petId || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    const newRecord = new MedicalRecordModel({
      petId,
      appointmentId,
      veterinarianId,
      diagnosis,
      treatment,
      notes
    });
    
    await newRecord.save();
    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecordModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!record) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
  getRecordsByPet,
  createRecord,
  updateRecord
};
