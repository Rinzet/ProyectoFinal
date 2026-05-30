/**
 * ============================================
 * SMARTROOM - RUTAS DE HABITACIONES
 * ============================================
 */

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { verifyToken } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// CRUD de habitaciones
router.get('/', roomController.getRooms);
router.get('/:roomId', roomController.getRoom);
router.post('/', roomController.createRoom);
router.put('/:roomId', roomController.updateRoom);
router.delete('/:roomId', roomController.deleteRoom);

// Estadísticas
router.get('/:roomId/stats', roomController.getRoomStats);

module.exports = router;
