const express = require('express');
const router = express.Router();
const { login, register, getProfile } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/register - Register new user
router.post('/register', register);

// GET /api/auth/profile - Get current user profile (protected route)
router.get('/profile', authenticateToken, getProfile);

module.exports = router; 