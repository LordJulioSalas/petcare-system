const User = require('../models/User');

let users = [
  new User(1, 'admin', 'admin123', 'admin', 'Administrador', 'admin@petcare.com'),
  new User(2, 'vet1', 'vet123', 'veterinarian', 'Dr. Carlos Pérez', 'carlos@petcare.com'),
  new User(3, 'recep1', 'recep123', 'receptionist', 'María González', 'maria@petcare.com')
];

let sessions = {};

const login = (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
  
  const sessionToken = Math.random().toString(36).substring(7);
  sessions[sessionToken] = { userId: user.id, role: user.role };
  
  res.json({ 
    success: true, 
    token: sessionToken,
    user: { id: user.id, name: user.name, role: user.role, email: user.email }
  });
};

const logout = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    delete sessions[token];
  }
  res.json({ success: true, message: 'Sesión cerrada' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !sessions[token]) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
  
  req.user = sessions[token];
  next();
};

const getAllUsers = (req, res) => {
  const usersData = users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    role: u.role
  }));
  res.json({ success: true, data: usersData });
};

module.exports = {
  login,
  logout,
  verifyToken,
  getAllUsers
};
