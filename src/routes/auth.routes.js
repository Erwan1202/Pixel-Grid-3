const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { authRateLimiter } = require('../middlewares/rateLimiter.middleware');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const AuthController = require('../controllers/auth.controller');
const { checkJwt } = require('../middlewares/checkJwt.middleware'); 

router.post('/register', authRateLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', checkJwt, AuthController.logout); 

module.exports = router;