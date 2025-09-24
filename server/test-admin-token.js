const jwt = require('jsonwebtoken');

// Créer un token d'admin pour les tests
const token = jwt.sign(
  { 
    id: '68c800bb9c68b2911131424b',
    email: 'admin@ubb.com',
    role: 'admin'
  }, 
  'your-secret-key',
  { expiresIn: '24h' }
);

console.log('Token admin:', token);
