const bcrypt = require('bcrypt');

let users = [];

module.exports = {
  findByEmail: (email) => users.find((u) => u.email === email),
  findById: (id) => users.find((u) => u.id === id),
  create: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = { id: users.length + 1, ...userData, password: hashedPassword, profilePic: null };
    users.push(newUser);
    return newUser;
  },
  update: (id, updates) => {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;
    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  },
  comparePassword: async (password, hashedPassword) => bcrypt.compare(password, hashedPassword),
};