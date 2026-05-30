/**
 * ============================================
 * SMARTROOM - CONTROLADOR DE USUARIOS
 * Lógica de gestión de usuarios
 * ============================================
 */

const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { generateToken } = require('../middleware/auth');

/**
 * Registra un nuevo usuario
 */
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validar entrada
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Las contraseñas no coinciden'
            });
        }

        // Verificar si el usuario ya existe
        const existingUsers = await query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const result = await query(
            'INSERT INTO usuarios (nombre, email, contraseña, fecha_creacion) VALUES (?, ?, ?, NOW())',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario'
        });
    }
};

/**
 * Inicia sesión
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar entrada
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña requeridos'
            });
        }

        // Buscar usuario
        const users = await query(
            'SELECT id, nombre, email, contraseña FROM usuarios WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const user = users[0];

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.contraseña);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user.id, { email: user.email, name: user.nombre });

        res.json({
            success: true,
            message: 'Sesión iniciada',
            token,
            user: {
                id: user.id,
                name: user.nombre,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }
};

/**
 * Obtiene perfil del usuario
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const users = await query(
            'SELECT id, nombre, email, fecha_creacion FROM usuarios WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil'
        });
    }
};

/**
 * Actualiza perfil del usuario
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nombre, email } = req.body;

        // Validar entrada
        if (!nombre && !email) {
            return res.status(400).json({
                success: false,
                message: 'Proporcione al menos un campo a actualizar'
            });
        }

        // Construir consulta dinámicamente
        let updateQuery = 'UPDATE usuarios SET ';
        const updateValues = [];

        if (nombre) {
            updateQuery += 'nombre = ?, ';
            updateValues.push(nombre);
        }

        if (email) {
            // Verificar si el email ya existe
            const existingUsers = await query(
                'SELECT id FROM usuarios WHERE email = ? AND id != ?',
                [email, userId]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está en uso'
                });
            }

            updateQuery += 'email = ?, ';
            updateValues.push(email);
        }

        // Remover última coma
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ?';
        updateValues.push(userId);

        await query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil'
        });
    }
};

/**
 * Cierra sesión
 */
const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Sesión cerrada'
    });
};

/**
 * Obtiene todos los usuarios (solo admin)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await query(
            'SELECT id, nombre, email, fecha_creacion FROM usuarios'
        );

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    logout,
    getAllUsers
};
