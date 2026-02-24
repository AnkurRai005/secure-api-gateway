const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginRateLimiter = require('../middleware/loginRateLimiter');

router.post('/login', loginRateLimiter, authController.login);

router.post('/refresh', authController.refreshToken);

module.exports = router;