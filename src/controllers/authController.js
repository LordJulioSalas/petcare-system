const UserModel = require('../models/UserSchema');
const SessionModel = require('../models/SessionSchema');

// Inicializar usuarios por defecto
const initializeUsers = async () => {
  try {
    const count = await UserModel.countDocuments();
    if (count === 0) {
      await UserModel.insertMany([
        { username: 'admin', password: 'admin123', role: 'admin', name: 'Dr. Carlos Administrador', email: 'admin@petcare.com' },
        { username: 'recepcion1', password: 'recep123', role: 'receptionist', name: 'María Recepcionista', email: 'recepcion@petcare.com' },
        { username: 'asistente1', password: 'asist123', role: 'assistant', name: 'Ana Asistente Veterinaria', email: 'asistente@petcare.com' },
        { username: 'vet1', password: 'vet123', role: 'veterinarian', name: 'Dr. Carlos Pérez', email: 'carlos@petcare.com' },
        { username: 'vet2', password: 'vet123', role: 'veterinarian', name: 'Dra. Laura Martínez', email: 'laura@petcare.com' }
      ]);
      console.log('✅ Usuarios iniciales creados');
    }
  } catch (error) {
    console.error('Error inicializando usuarios:', error.message);
  }
};

initializeUsers();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await UserModel.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    
    const sessionToken = Math.random().toString(36).substring(7) + Date.now().toString(36);
    
    await SessionModel.create({
      token: sessionToken,
      userId: user._id,
      role: user.role
    });
    
    res.json({ 
      success: true, 
      token: sessionToken,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await SessionModel.deleteOne({ token });
    }
    res.json({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }
    
    const session = await SessionModel.findOne({ token });
    
    if (!session) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }
    
    req.user = { userId: session.userId, role: session.role };
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  logout,
  verifyToken,
  getAllUsers
};
