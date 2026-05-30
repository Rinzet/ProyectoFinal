/**
 * ============================================
 * SMARTROOM - RUTAS DE USUARIOS
 * ============================================
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Rutas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/logout', verifyToken, userController.logout);

// Ruta admin
router.get('/', verifyToken, userController.getAllUsers);

module.exports = router;
