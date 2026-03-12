require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Conexión a MongoDB con caché
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    throw new Error('MONGODB_URI no está configurado');
  }

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  cachedDb = mongoose.connection;
  console.log('✅ MongoDB conectado');
  
  return cachedDb;
}

// Importar rutas
const authRoutes = require('../src/routes/auth');
const petsRoutes = require('../src/routes/pets');
const appointmentsRoutes = require('../src/routes/appointments');
const medicalRecordsRoutes = require('../src/routes/medicalRecords');
const chatbotRoutes = require('../src/routes/chatbot');
const vitalSignsRoutes = require('../src/routes/vitalSigns');

// Middleware para conectar a DB antes de cada request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    res.status(500).json({ success: false, message: 'Error de conexión a base de datos' });
  }
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/vital-signs', vitalSignsRoutes);

// Ruta raíz
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});

module.exports = app;
