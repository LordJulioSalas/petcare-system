const Pet = require('../models/Pet');

let pets = [];
let nextId = 1;

const getAllPets = (req, res) => {
  res.json({ success: true, data: pets });
};

const getPetById = (req, res) => {
  const pet = pets.find(p => p.id === parseInt(req.params.id));
  if (!pet) {
    return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
  }
  res.json({ success: true, data: pet });
};

const createPet = (req, res) => {
  const { name, species, breed, owner } = req.body;
  
  if (!name || !species || !owner) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
  }

  const newPet = new Pet(nextId++, name, species, breed, owner);
  pets.push(newPet);
  res.status(201).json({ success: true, data: newPet });
};

const updatePet = (req, res) => {
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id));
  if (petIndex === -1) {
    return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
  }

  pets[petIndex] = { ...pets[petIndex], ...req.body, id: pets[petIndex].id };
  res.json({ success: true, data: pets[petIndex] });
};

const deletePet = (req, res) => {
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id));
  if (petIndex === -1) {
    return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
  }

  pets.splice(petIndex, 1);
  res.json({ success: true, message: 'Mascota eliminada' });
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};
