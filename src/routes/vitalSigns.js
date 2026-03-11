const express = require('express');
const router = express.Router();
const vitalSignsController = require('../controllers/vitalSignsController');
const { verifyToken } = require('../controllers/authController');

router.get('/', verifyToken, vitalSignsController.getAllVitalSigns);
router.get('/pet/:petId', verifyToken, vitalSignsController.getVitalSignsByPet);
router.post('/', verifyToken, vitalSignsController.createVitalSigns);

module.exports = router;
