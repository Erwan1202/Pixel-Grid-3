const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    return bcrypt.hash(password, saltRounds);
};

const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};

const createAccessToken = (user) => {
    const payload = { 
        id: user.id, 
        role: user.role 
    };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { 
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME 
    });
};

const createRefreshToken = (user) => {
    const payload = { 
        id: user.id, 
        role: user.role, 
        type: 'refresh' 
    };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { 
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME 
    });
};

module.exports = {
    hashPassword,
    comparePassword,
    createAccessToken,
    createRefreshToken,
};