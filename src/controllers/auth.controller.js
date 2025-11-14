const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const data = await authService.registerUser(username, email, password);
        res.status(201).json({ 
            message: 'User registered successfully', 
            accessToken: data.accessToken, 
            refreshToken: data.refreshToken 
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await authService.loginUser(email, password);
        res.status(200).json({ 
            message: 'Login successful', 
            accessToken: data.accessToken, 
            refreshToken: data.refreshToken 
        });
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const data = await authService.refreshTokens(refreshToken);
        res.status(200).json({ 
            message: 'Tokens refreshed successfully', 
            accessToken: data.accessToken, 
            refreshToken: data.refreshToken 
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        // userId est attaché à req par le middleware JWT qui sera créé plus tard
        await authService.logoutUser(req.user.id);
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
};