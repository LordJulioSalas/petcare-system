require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

const authRoutes = require('./routes/auth');
const petsRoutes = require('./routes/pets');
const appointmentsRoutes = require('./routes/appointments');
const medicalRecordsRoutes = require('./routes/medicalRecords');
const chatbotRoutes = require('./routes/chatbot');
const vitalSignsRoutes = require('./routes/vitalSigns');

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
app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/vital-signs', vitalSignsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
