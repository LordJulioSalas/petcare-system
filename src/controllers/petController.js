const PetModel = require('../models/PetSchema');

const getAllPets = async (req, res) => {
  try {
    const pets = await PetModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPetById = async (req, res) => {
  try {
    const pet = await PetModel.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }
    res.json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, species, breed, owner } = req.body;
    
    if (!name || !species || !owner) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    const newPet = new PetModel({ name, species, breed, owner });
    await newPet.save();
    
    res.status(201).json({ success: true, data: newPet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const pet = await PetModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }
    
    res.json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePet = async (req, res) => {
  try {
    const pet = await PetModel.findByIdAndDelete(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }
    
    res.json({ success: true, message: 'Mascota eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};
