class User {
  constructor(id, username, password, role, name, email) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role; // 'admin', 'veterinarian', 'receptionist'
    this.name = name;
    this.email = email;
  }
}

module.exports = User;
