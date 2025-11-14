const jwt = require('jsonwebtoken');

const checkJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = { 
            id: payload.id, 
            role: payload.role 
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = {
    checkJwt
};