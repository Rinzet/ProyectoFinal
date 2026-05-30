/**
 * ============================================
 * SMARTROOM - CONTROLADOR DE HABITACIONES
 * Lógica de gestión de habitaciones
 * ============================================
 */

const { query } = require('../config/database');

/**
 * Obtiene todas las habitaciones del usuario
 */
const getRooms = async (req, res) => {
    try {
        const userId = req.user.id;

        const rooms = await query(
            'SELECT id, nombre, descripcion, ubicacion, temperatura_actual, fecha_creacion FROM habitaciones WHERE usuario_id = ? ORDER BY fecha_creacion DESC',
            [userId]
        );

        res.json({
            success: true,
            rooms,
            count: rooms.length
        });
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener habitaciones'
        });
    }
};

/**
 * Obtiene una habitación específica
 */
const getRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const rooms = await query(
            'SELECT * FROM habitaciones WHERE id = ? AND usuario_id = ?',
            [roomId, userId]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Habitación no encontrada'
            });
        }

        // Obtener sensores asociados
        const sensors = await query(
            'SELECT id, nombre, tipo, valor_actual, unidad FROM sensores WHERE habitacion_id = ?',
            [roomId]
        );

        const room = rooms[0];
        room.sensores = sensors;

        res.json({
            success: true,
            room
        });
    } catch (error) {
        console.error('Error al obtener habitación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener habitación'
        });
    }
};

/**
 * Crea una nueva habitación
 */
const createRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nombre, descripcion, ubicacion } = req.body;

        // Validar entrada
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la habitación es requerido'
            });
        }

        // Crear habitación
        const result = await query(
            'INSERT INTO habitaciones (usuario_id, nombre, descripcion, ubicacion, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
            [userId, nombre, descripcion || null, ubicacion || null]
        );

        res.status(201).json({
            success: true,
            message: 'Habitación creada exitosamente',
            roomId: result.insertId
        });
    } catch (error) {
        console.error('Error al crear habitación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear habitación'
        });
    }
};

/**
 * Actualiza una habitación
 */
const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;
        const { nombre, descripcion, ubicacion, temperatura_actual } = req.body;

        // Verificar que la habitación pertenece al usuario
        const rooms = await query(
            'SELECT id FROM habitaciones WHERE id = ? AND usuario_id = ?',
            [roomId, userId]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Habitación no encontrada'
            });
        }

        // Actualizar habitación
        let updateQuery = 'UPDATE habitaciones SET ';
        const updateValues = [];

        if (nombre !== undefined) {
            updateQuery += 'nombre = ?, ';
            updateValues.push(nombre);
        }

        if (descripcion !== undefined) {
            updateQuery += 'descripcion = ?, ';
            updateValues.push(descripcion);
        }

        if (ubicacion !== undefined) {
            updateQuery += 'ubicacion = ?, ';
            updateValues.push(ubicacion);
        }

        if (temperatura_actual !== undefined) {
            updateQuery += 'temperatura_actual = ?, ';
            updateValues.push(temperatura_actual);
        }

        // Remover última coma
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ?';
        updateValues.push(roomId);

        await query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Habitación actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar habitación'
        });
    }
};

/**
 * Elimina una habitación
 */
const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        // Verificar que la habitación pertenece al usuario
        const rooms = await query(
            'SELECT id FROM habitaciones WHERE id = ? AND usuario_id = ?',
            [roomId, userId]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Habitación no encontrada'
            });
        }

        // Eliminar sensores asociados
        await query('DELETE FROM sensores WHERE habitacion_id = ?', [roomId]);

        // Eliminar habitación
        await query('DELETE FROM habitaciones WHERE id = ?', [roomId]);

        res.json({
            success: true,
            message: 'Habitación eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar habitación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar habitación'
        });
    }
};

/**
 * Obtiene estadísticas de una habitación
 */
const getRoomStats = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        // Verificar que la habitación pertenece al usuario
        const rooms = await query(
            'SELECT id FROM habitaciones WHERE id = ? AND usuario_id = ?',
            [roomId, userId]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Habitación no encontrada'
            });
        }

        // Obtener estadísticas de sensores
        const stats = await query(
            'SELECT COUNT(*) as total_sensores FROM sensores WHERE habitacion_id = ?',
            [roomId]
        );

        res.json({
            success: true,
            stats: stats[0]
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas'
        });
    }
};

module.exports = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomStats
};
