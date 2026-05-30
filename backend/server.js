/**
 * ============================================
 * SMARTROOM - SERVIDOR EXPRESS
 * Punto de entrada del backend
 * ============================================
 */

const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

// Importar middleware y rutas
const { requestLogger, errorHandler } = require('./middleware/auth');
const { initializeDatabase } = require('./config/database');

// Importar rutas
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const sensorRoutes = require('./routes/sensors');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// ========== MIDDLEWARE GLOBAL ==========
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(requestLogger);

// ========== RUTAS API ==========
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sensors', sensorRoutes);

// ========== RUTAS ESPECIALES ==========
/**
 * Ruta de salud del servidor
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'SmartRoom Backend en línea',
        timestamp: new Date().toISOString()
    });
});

/**
 * Ruta raíz
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SmartRoom - Sistema Inteligente de Monitoreo',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            rooms: '/api/rooms',
            sensors: '/api/sensors',
            health: '/health'
        }
    });
});

/**
 * Dashboard general
 */
app.get('/api/dashboard', (req, res) => {
    res.json({
        success: true,
        data: {
            titulo: 'Dashboard SmartRoom',
            fecha_actualizacion: new Date().toISOString(),
            resumen: {
                habitaciones_totales: 0,
                sensores_activos: 0,
                alertas_pendientes: 0,
                consumo_energetico: 0
            }
        }
    });
});

/**
 * Estadísticas del sistema
 */
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        stats: {
            usuarios_activos: 0,
            total_sensores: 0,
            promedio_temperatura: 0,
            promedio_humedad: 0
        }
    });
});

// ========== MANEJO DE ERRORES ==========
/**
 * Ruta 404
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.path
    });
});

/**
 * Middleware de error global
 */
app.use(errorHandler);

// ========== INICIALIZACIÓN DEL SERVIDOR ==========
const startServer = async () => {
    try {
        console.log('╔════════════════════════════════════════╗');
        console.log('║     SmartRoom - Backend Server          ║');
        console.log('║   Sistema Inteligente de Monitoreo      ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('');

        // Inicializar base de datos
        console.log('[DATABASE] Inicializando base de datos...');
        const dbReady = await initializeDatabase();
        
        if (!dbReady) {
            console.error('[ERROR] No se pudo inicializar la base de datos');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, HOST, () => {
            console.log('');
            console.log(`[SERVER] ✓ Servidor iniciado exitosamente`);
            console.log(`[SERVER] Host: ${HOST}`);
            console.log(`[SERVER] Puerto: ${PORT}`);
            console.log(`[SERVER] URL: http://${HOST}:${PORT}`);
            console.log('');
            console.log('[ENDPOINTS]');
            console.log(`  - GET  http://${HOST}:${PORT}/`);
            console.log(`  - GET  http://${HOST}:${PORT}/health`);
            console.log(`  - POST http://${HOST}:${PORT}/api/users/register`);
            console.log(`  - POST http://${HOST}:${PORT}/api/users/login`);
            console.log(`  - GET  http://${HOST}:${PORT}/api/rooms`);
            console.log(`  - GET  http://${HOST}:${PORT}/api/sensors`);
            console.log('');
            console.log('[STATUS] Servidor listo para recibir solicitudes');
        });
    } catch (error) {
        console.error('[ERROR] Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

// Manejo de señales del sistema
process.on('SIGTERM', () => {
    console.log('[SERVER] SIGTERM recibido. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('[SERVER] SIGINT recibido. Cerrando servidor...');
    process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
