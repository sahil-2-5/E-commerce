const jwt = require('jsonwebtoken');

const generateAdminToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: '30d',
    });
}

module.exports = generateAdminToken;