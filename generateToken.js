const jwt = require('jsonwebtoken');

// Remplace par l'ID d'un utilisateur réel dans ta base MongoDB
const token = jwt.sign(
  { id: '6903a1b0288d60b1586667e7', role: 'responsable' }, // ou 'stagiaire', 'responsable'
  '123456789', // le même secret que dans ton middleware
  { expiresIn: '1h' }
);

console.log("Token JWT :", token);
