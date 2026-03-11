const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken } = require('../controllers/authController');

// Rutas públicas (sin autenticación)
router.post('/', appointmentController.createAppointment);

// Rutas protegidas (requieren autenticación)
router.get('/', verifyToken, appointmentController.getAllAppointments);
router.get('/:id', verifyToken, appointmentController.getAppointmentById);
router.put('/:id', verifyToken, appointmentController.updateAppointment);
router.delete('/:id', verifyToken, appointmentController.deleteAppointment);

module.exports = router;
