const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { authRateLimiter } = require('../middlewares/rateLimiter.middleware');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const AuthController = require('../controllers/auth.controller');
const { checkJwt } = require('../middlewares/checkJwt.middleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - validation error
 *       429:
 *         description: Too many requests
 */
router.post('/register', authRateLimiter, validate(registerSchema), AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many requests
 */
router.post('/login', authRateLimiter, validate(loginSchema), AuthController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: New token generated successfully
 *       401:
 *         description: Invalid or expired token
 */
router.post('/refresh', AuthController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', checkJwt, AuthController.logout); 

module.exports = router;