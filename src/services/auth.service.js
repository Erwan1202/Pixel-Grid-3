const { execute } = require('../models/db.postgres');
const { 
    hashPassword, 
    comparePassword, 
    createAccessToken, 
    createRefreshToken 
} = require('./auth.utils');
const jwt = require('jsonwebtoken');

const registerUser = async (username, email, password) => {
    const existingUser = await execute('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw { statusCode: 409, message: 'Email already in use' };
    }

    const password_hash = await hashPassword(password);
    const result = await execute(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, role', 
        [username, email, password_hash]
    );

    const user = result.rows[0];
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await execute(
        'UPDATE users SET refresh_token = $1 WHERE id = $2', 
        [refreshToken, user.id]
    );

    return { accessToken, refreshToken, user };
};

const loginUser = async (email, password) => {
    const result = await execute('SELECT id, password_hash, role, refresh_token FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await comparePassword(password, user.password_hash))) {
        throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    await execute(
        'UPDATE users SET refresh_token = $1 WHERE id = $2', 
        [newRefreshToken, user.id]
    );
    
    return { accessToken, refreshToken: newRefreshToken, user: { id: user.id, role: user.role } };
};

const refreshTokens = async (refreshToken) => {
    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (payload.type !== 'refresh') {
            throw new Error('Token is not a refresh token');
        }

        const result = await execute('SELECT id, role FROM users WHERE id = $1 AND refresh_token = $2', [payload.id, refreshToken]);
        const user = result.rows[0];

        if (!user) {
            throw new Error('Invalid or expired refresh token stored');
        }

        const accessToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);

        await execute(
            'UPDATE users SET refresh_token = $1 WHERE id = $2', 
            [newRefreshToken, user.id]
        );

        return { accessToken, refreshToken: newRefreshToken };

    } catch (error) {
        throw { statusCode: 403, message: 'Invalid or expired refresh token' };
    }
};

const logoutUser = async (userId) => {
    await execute('UPDATE users SET refresh_token = NULL WHERE id = $1', [userId]);
};

module.exports = {
    registerUser,
    loginUser,
    refreshTokens,
    logoutUser,
};