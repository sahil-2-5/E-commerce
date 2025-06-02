const jwt = require('jsonwebtoken');

const generateClientToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_CLIENT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateClientToken;