// test-bcrypt.js
const bcrypt = require('bcrypt');

const hash = "$2b$12$YkNPQ1NjvwD9zmW3kjbB7O8Q2KRukeNNpKNts/22Y.jRgL.X2mFZC";

bcrypt.compare("123456", hash).then(result => {
  console.log("¿Coincide la contraseña?", result);
});