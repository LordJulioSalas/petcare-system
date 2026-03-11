const Appointment = require('../models/Appointment');

let appointments = [];
let nextId = 1;

const getAllAppointments = (req, res) => {
  res.json({ success: true, data: appointments });
};

const getAppointmentById = (req, res) => {
  const appointment = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  res.json({ success: true, data: appointment });
};

const createAppointment = (req, res) => {
  const { petId, date, time, reason } = req.body;
  
  if (!petId || !date || !time || !reason) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
  }

  const newAppointment = new Appointment(nextId++, petId, date, time, reason);
  appointments.push(newAppointment);
  res.status(201).json({ success: true, data: newAppointment });
};

const updateAppointment = (req, res) => {
  const appointmentIndex = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (appointmentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }

  appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...req.body, id: appointments[appointmentIndex].id };
  res.json({ success: true, data: appointments[appointmentIndex] });
};

const deleteAppointment = (req, res) => {
  const appointmentIndex = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (appointmentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }

  appointments.splice(appointmentIndex, 1);
  res.json({ success: true, message: 'Cita eliminada' });
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
