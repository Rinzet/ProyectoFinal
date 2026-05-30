/**
 * ============================================
 * SMARTROOM - RUTAS DE SENSORES
 * ============================================
 */

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { verifyToken } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// CRUD de sensores
router.get('/', sensorController.getSensors);
router.get('/live', sensorController.getLiveData);
router.get('/:sensorId', sensorController.getSensor);
router.post('/', sensorController.createSensor);
router.put('/:sensorId', sensorController.updateSensor);
router.delete('/:sensorId', sensorController.deleteSensor);

// Historial y acciones
router.get('/:sensorId/history', sensorController.getSensorHistory);
router.post('/:sensorId/toggle', sensorController.toggleSensor);

module.exports = router;
