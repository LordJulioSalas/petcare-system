const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { verifyToken } = require('../controllers/authController');

router.get('/', verifyToken, medicalRecordController.getAllRecords);
router.get('/pet/:petId', verifyToken, medicalRecordController.getRecordsByPet);
router.get('/:id', verifyToken, medicalRecordController.getRecordById);
router.post('/', verifyToken, medicalRecordController.createRecord);
router.put('/:id', verifyToken, medicalRecordController.updateRecord);

module.exports = router;
