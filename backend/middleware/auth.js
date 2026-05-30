/**
 * ============================================
 * SMARTROOM - MIDDLEWARE DE AUTENTICACIÓN
 * Verificación de JWT y permisos
 * ============================================
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para verificar token JWT
 */
const verifyToken = (req, res, next) => {
    try {
        // Obtener token del header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartroom-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

/**
 * Middleware para logging de requests
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });

    next();
};

/**
 * Middleware para manejo de errores
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    // Error de validación
    if (err.statusCode === 400) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Error no autorizado
    if (err.statusCode === 401) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado'
        });
    }

    // Error no encontrado
    if (err.statusCode === 404) {
        return res.status(404).json({
            success: false,
            message: 'Recurso no encontrado'
        });
    }

    // Error interno del servidor
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
};

/**
 * Genera token JWT
 */
const generateToken = (userId, userData) => {
    return jwt.sign(
        {
            id: userId,
            email: userData.email,
            name: userData.name
        },
        process.env.JWT_SECRET || 'smartroom-secret-key',
        { expiresIn: '7d' }
    );
};

module.exports = {
    verifyToken,
    requestLogger,
    errorHandler,
    generateToken
};
