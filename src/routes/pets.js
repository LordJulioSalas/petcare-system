const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { verifyToken } = require('../controllers/authController');

// Rutas públicas (sin autenticación)
router.post('/', petController.createPet);
router.get('/', petController.getAllPets);

// Rutas protegidas (requieren autenticación)
router.get('/:id', verifyToken, petController.getPetById);
router.put('/:id', verifyToken, petController.updatePet);
router.delete('/:id', verifyToken, petController.deletePet);

module.exports = router;
