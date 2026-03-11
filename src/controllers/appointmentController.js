const AppointmentModel = require('../models/AppointmentSchema');

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate('petId')
      .sort({ date: 1, time: 1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findById(req.params.id).populate('petId');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { petId, date, time, reason } = req.body;
    
    if (!petId || !date || !time || !reason) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    const newAppointment = new AppointmentModel({ petId, date, time, reason });
    await newAppointment.save();
    
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }
    
    res.json({ success: true, message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
