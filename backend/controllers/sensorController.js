/**
 * ============================================
 * SMARTROOM - CONTROLADOR DE SENSORES
 * Lógica de gestión de sensores
 * ============================================
 */

const { query } = require('../config/database');

/**
 * Obtiene todos los sensores del usuario
 */
const getSensors = async (req, res) => {
    try {
        const userId = req.user.id;
        const { roomId } = req.query;

        let sql = `
            SELECT s.* FROM sensores s
            JOIN habitaciones h ON s.habitacion_id = h.id
            WHERE h.usuario_id = ?
        `;
        const params = [userId];

        if (roomId) {
            sql += ' AND s.habitacion_id = ?';
            params.push(roomId);
        }

        sql += ' ORDER BY s.fecha_creacion DESC';

        const sensors = await query(sql, params);

        res.json({
            success: true,
            sensors,
            count: sensors.length
        });
    } catch (error) {
        console.error('Error al obtener sensores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener sensores'
        });
    }
};

/**
 * Obtiene un sensor específico
 */
const getSensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const userId = req.user.id;

        const sensors = await query(`
            SELECT s.* FROM sensores s
            JOIN habitaciones h ON s.habitacion_id = h.id
            WHERE s.id = ? AND h.usuario_id = ?
        `, [sensorId, userId]);

        if (sensors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sensor no encontrado'
            });
        }

        res.json({
            success: true,
            sensor: sensors[0]
        });
    } catch (error) {
        console.error('Error al obtener sensor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener sensor'
        });
    }
};

/**
 * Crea un nuevo sensor
 */
const createSensor = async (req, res) => {
    try {
        const userId = req.user.id;
        const { habitacion_id, nombre, tipo, unidad, valor_minimo, valor_maximo } = req.body;

        // Validar entrada
        if (!habitacion_id || !nombre || !tipo) {
            return res.status(400).json({
                success: false,
                message: 'Campos requeridos: habitacion_id, nombre, tipo'
            });
        }

        // Verificar que la habitación pertenece al usuario
        const rooms = await query(
            'SELECT id FROM habitaciones WHERE id = ? AND usuario_id = ?',
            [habitacion_id, userId]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Habitación no encontrada'
            });
        }

        // Crear sensor
        const result = await query(
            `INSERT INTO sensores (habitacion_id, nombre, tipo, unidad, valor_minimo, valor_maximo, valor_actual, estado, fecha_creacion)
             VALUES (?, ?, ?, ?, ?, ?, 0, 'activo', NOW())`,
            [habitacion_id, nombre, tipo, unidad || null, valor_minimo || null, valor_maximo || null]
        );

        res.status(201).json({
            success: true,
            message: 'Sensor creado exitosamente',
            sensorId: result.insertId
        });
    } catch (error) {
        console.error('Error al crear sensor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear sensor'
        });
    }
};

/**
 * Actualiza un sensor
 */
const updateSensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const userId = req.user.id;
        const { nombre, tipo, valor_actual, estado, unidad } = req.body;

        // Verificar que el sensor pertenece al usuario
        const sensors = await query(`
            SELECT s.id FROM sensores s
            JOIN habitaciones h ON s.habitacion_id = h.id
            WHERE s.id = ? AND h.usuario_id = ?
        `, [sensorId, userId]);

        if (sensors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sensor no encontrado'
            });
        }

        // Actualizar sensor
        let updateQuery = 'UPDATE sensores SET ';
        const updateValues = [];

        if (nombre !== undefined) {
            updateQuery += 'nombre = ?, ';
            updateValues.push(nombre);
        }

        if (tipo !== undefined) {
            updateQuery += 'tipo = ?, ';
            updateValues.push(tipo);
        }

        if (valor_actual !== undefined) {
            updateQuery += 'valor_actual = ?, ';
            updateValues.push(valor_actual);
        }

        if (estado !== undefined) {
            updateQuery += 'estado = ?, ';
            updateValues.push(estado);
        }

        if (unidad !== undefined) {
            updateQuery += 'unidad = ?, ';
            updateValues.push(unidad);
        }

        // Remover última coma
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ?';
        updateValues.push(sensorId);

        await query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Sensor actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar sensor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar sensor'
        });
    }
};

/**
 * Elimina un sensor
 */
const deleteSensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const userId = req.user.id;

        // Verificar que el sensor pertenece al usuario
        const sensors = await query(`
            SELECT s.id FROM sensores s
            JOIN habitaciones h ON s.habitacion_id = h.id
            WHERE s.id = ? AND h.usuario_id = ?
        `, [sensorId, userId]);

        if (sensors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sensor no encontrado'
            });
        }

        // Eliminar registros asociados
        await query('DELETE FROM registros_sensores WHERE sensor_id = ?', [sensorId]);

        // Eliminar sensor
        await query('DELETE FROM sensores WHERE id = ?', [sensorId]);

        res.json({
            success: true,
            message: 'Sensor eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar sensor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar sensor'
        });
    }
};

/**
 * Obtiene historial de un sensor
 */
const getSensorHistory = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { range } = req.query;
        const userId = req.user.id;

        // Verificar que el sensor pertenece al usuario
        const sensors = await query(`
            SELECT s.id FROM sensores s
            JOIN habitaciones h ON s.habitacion_id = h.id
            WHERE s.id = ? AND h.usuario_id = ?
        `, [sensorId, userId]);

        if (sensors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sensor no encontrado'
            });
        }

        // Determinar rango de tiempo
        let timeFilter = 'DATE_SUB(NOW(), INTERVAL 24 HOUR)'; // Por defecto 24h
        if (range === '7d') {
            timeFilter = 'DATE_SUB(NOW(), INTERVAL 7 DAY)';
        } else if (range === '30d') {
            timeFilter = 'DATE_SUB(NOW(), INTERVAL 30 DAY)';
        } else if (range === '1h') {
            timeFilter = 'DATE_SUB(NOW(), INTERVAL 1 HOUR)';
        }

        const history = await query(`
            SELECT valor, fecha_registro FROM registros_sensores
            WHERE sensor_id = ? AND fecha_registro > ${timeFilter}
            ORDER BY fecha_registro ASC
        `, [sensorId]);

        res.json({
            success: true,
            history,
            count: history.length
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial'
        });
    }
};

/**
 * Alterna estado del sensor (ON/OFF)
 */
const toggleSensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const userId = req.user.id;

        // Verificar que el sensor pertenece al usuario
        const sensors = await query(`
            SELECT s.estado FROM sensores s
            JOIN habitaciones h ON s.habitacion_id = h.id
            WHERE s.id = ? AND h.usuario_id = ?
        `, [sensorId, userId]);

        if (sensors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sensor no encontrado'
            });
        }

        const newState = sensors[0].estado === 'activo' ? 'inactivo' : 'activo';

        await query(
            'UPDATE sensores SET estado = ? WHERE id = ?',
            [newState, sensorId]
        );

        res.json({
            success: true,
            message: `Sensor ${newState}`,
            newState
        });
    } catch (error) {
        console.error('Error al alternar sensor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al alternar sensor'
        });
    }
};

/**
 * Obtiene datos en vivo de todos los sensores
 */
const getLiveData = async (req, res) => {
    try {
        const userId = req.user.id;

        const sensors = await query(`
            SELECT s.id, s.nombre, s.tipo, s.valor_actual, s.unidad, s.estado, h.nombre as habitacion
            FROM sensores s
            JOIN habitaciones h ON s.habitacion_id = h.id
            WHERE h.usuario_id = ?
        `, [userId]);

        res.json({
            success: true,
            sensors,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al obtener datos en vivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener datos en vivo'
        });
    }
};

module.exports = {
    getSensors,
    getSensor,
    createSensor,
    updateSensor,
    deleteSensor,
    getSensorHistory,
    toggleSensor,
    getLiveData
};
