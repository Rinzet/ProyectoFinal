/**
 * ============================================
 * SMARTROOM - CONFIGURACIÓN DE BASE DE DATOS
 * Conexión a MySQL
 * ============================================
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Pool de conexiones a la base de datos
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartroom',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Obtiene una conexión de la pool
 */
async function getConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✓ Conexión a BD establecida');
        return connection;
    } catch (error) {
        console.error('✗ Error al conectar a la BD:', error.message);
        throw error;
    }
}

/**
 * Ejecuta una consulta
 */
async function query(sql, values) {
    const connection = await getConnection();
    try {
        const [results] = await connection.execute(sql, values);
        return results;
    } catch (error) {
        console.error('Error en consulta SQL:', error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Inicializa la base de datos
 */
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Verificar si la BD existe
        const [databases] = await connection.execute(
            'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
            [process.env.DB_NAME || 'smartroom']
        );

        if (databases.length === 0) {
            console.log('Creando base de datos SmartRoom...');
            await connection.execute(
                `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'smartroom'}`
            );
        }

        connection.release();
        console.log('✓ Base de datos lista');
        return true;
    } catch (error) {
        console.error('Error al inicializar BD:', error);
        return false;
    }
}

module.exports = {
    pool,
    getConnection,
    query,
    initializeDatabase
};
