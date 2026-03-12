const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI no está configurado');
      return;
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB conectado exitosamente');
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
  }
};

module.exports = connectDB;
