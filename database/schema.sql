-- ============================================
-- SMARTROOM - ESQUEMA DE BASE DE DATOS
-- Sistema Inteligente de Monitoreo
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS smartroom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smartroom;

-- ========== TABLA DE USUARIOS ==========
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== TABLA DE HABITACIONES ==========
CREATE TABLE IF NOT EXISTS habitaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(100),
    temperatura_actual DECIMAL(5, 2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== TABLA DE SENSORES ==========
CREATE TABLE IF NOT EXISTS sensores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    habitacion_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    unidad VARCHAR(20),
    valor_actual DECIMAL(10, 2),
    valor_minimo DECIMAL(10, 2),
    valor_maximo DECIMAL(10, 2),
    estado ENUM('activo', 'inactivo', 'falla') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ultima_lectura TIMESTAMP,
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE CASCADE,
    INDEX idx_habitacion_id (habitacion_id),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== TABLA DE REGISTROS DE SENSORES ==========
CREATE TABLE IF NOT EXISTS registros_sensores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sensor_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE CASCADE,
    INDEX idx_sensor_id (sensor_id),
    INDEX idx_fecha_registro (fecha_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== TABLA DE ALERTAS ==========
CREATE TABLE IF NOT EXISTS alertas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    sensor_id INT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('info', 'warning', 'danger') DEFAULT 'info',
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE SET NULL,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_leida (leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== ÍNDICES ADICIONALES ==========
CREATE INDEX idx_sensores_habitacion_estado ON sensores(habitacion_id, estado);
CREATE INDEX idx_registros_sensor_fecha ON registros_sensores(sensor_id, fecha_registro);
CREATE INDEX idx_alertas_usuario_leida ON alertas(usuario_id, leida);

-- ========== VISTA: RESUMEN DE HABITACIONES ==========
CREATE OR REPLACE VIEW vista_resumen_habitaciones AS
SELECT 
    h.id,
    h.nombre,
    h.descripcion,
    h.ubicacion,
    h.temperatura_actual,
    COUNT(s.id) as total_sensores,
    SUM(CASE WHEN s.estado = 'activo' THEN 1 ELSE 0 END) as sensores_activos,
    h.fecha_creacion,
    u.email as usuario_email
FROM habitaciones h
LEFT JOIN sensores s ON h.id = s.habitacion_id
JOIN usuarios u ON h.usuario_id = u.id
GROUP BY h.id, h.nombre, h.descripcion, h.ubicacion, h.temperatura_actual, h.fecha_creacion, u.email;

-- ========== VISTA: RESUMEN DE SENSORES ACTIVOS ==========
CREATE OR REPLACE VIEW vista_sensores_activos AS
SELECT 
    s.id,
    s.nombre,
    s.tipo,
    s.valor_actual,
    s.unidad,
    s.estado,
    h.nombre as habitacion,
    h.id as habitacion_id,
    s.fecha_actualizacion
FROM sensores s
JOIN habitaciones h ON s.habitacion_id = h.id
WHERE s.estado = 'activo'
ORDER BY s.fecha_actualizacion DESC;

-- ========== VISTA: ALERTAS PENDIENTES ==========
CREATE OR REPLACE VIEW vista_alertas_pendientes AS
SELECT 
    a.id,
    a.titulo,
    a.descripcion,
    a.tipo,
    a.fecha_creacion,
    u.nombre as usuario,
    s.nombre as sensor
FROM alertas a
JOIN usuarios u ON a.usuario_id = u.id
LEFT JOIN sensores s ON a.sensor_id = s.id
WHERE a.leida = FALSE
ORDER BY a.fecha_creacion DESC;

-- ========== PROCEDIMIENTO: REGISTRAR LECTURA DE SENSOR ==========
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_registrar_lectura_sensor(
    IN p_sensor_id INT,
    IN p_valor DECIMAL(10, 2)
)
BEGIN
    -- Registrar la lectura
    INSERT INTO registros_sensores (sensor_id, valor, fecha_registro)
    VALUES (p_sensor_id, p_valor, NOW());
    
    -- Actualizar valor actual del sensor
    UPDATE sensores
    SET valor_actual = p_valor,
        fecha_actualizacion = NOW(),
        ultima_lectura = NOW()
    WHERE id = p_sensor_id;
    
    -- Crear alerta si el valor está fuera de rango
    IF EXISTS (
        SELECT 1 FROM sensores
        WHERE id = p_sensor_id
        AND ((valor_minimo IS NOT NULL AND p_valor < valor_minimo)
             OR (valor_maximo IS NOT NULL AND p_valor > valor_maximo))
    ) THEN
        INSERT INTO alertas (usuario_id, sensor_id, titulo, descripcion, tipo, leida)
        SELECT 
            h.usuario_id,
            p_sensor_id,
            CONCAT('Alerta: ', s.nombre),
            CONCAT('Valor fuera de rango: ', p_valor, ' ', s.unidad),
            'warning',
            FALSE
        FROM sensores s
        JOIN habitaciones h ON s.habitacion_id = h.id
        WHERE s.id = p_sensor_id;
    END IF;
END//

DELIMITER ;

-- ========== EVENTOS PROGRAMADOS ==========
-- Limpiar registros antiguos (más de 30 días)
CREATE EVENT IF NOT EXISTS evento_limpiar_registros
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
DELETE FROM registros_sensores
WHERE fecha_registro < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Marcar alertas antiguas como leídas (después de 7 días)
CREATE EVENT IF NOT EXISTS evento_limpiar_alertas
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
UPDATE alertas
SET leida = TRUE
WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL 7 DAY) AND leida = FALSE;

-- ========== DATOS DE EJEMPLO ==========
-- Insertar usuario de prueba
INSERT IGNORE INTO usuarios (id, nombre, email, contraseña) VALUES
(1, 'Usuario Demo', 'demo@smartroom.local', '$2a$10$1234567890123456789012');

-- Insertar habitaciones de ejemplo
INSERT IGNORE INTO habitaciones (id, usuario_id, nombre, descripcion, ubicacion) VALUES
(1, 1, 'Sala de Estar', 'Sala principal de la casa', 'Planta baja'),
(2, 1, 'Dormitorio', 'Dormitorio principal', 'Planta alta'),
(3, 1, 'Cocina', 'Cocina y comedor', 'Planta baja');

-- Insertar sensores de ejemplo
INSERT IGNORE INTO sensores (id, habitacion_id, nombre, tipo, unidad, valor_actual, valor_minimo, valor_maximo) VALUES
(1, 1, 'Temperatura Sala', 'temperature', '°C', 22.5, 15, 30),
(2, 1, 'Humedad Sala', 'humidity', '%', 58, 30, 70),
(3, 1, 'Luz Principal', 'light', '%', 85, 0, 100),
(4, 2, 'Temperatura Dormitorio', 'temperature', '°C', 19.3, 15, 28),
(5, 2, 'Luz Dormitorio', 'light', '%', 45, 0, 100),
(6, 3, 'Temperatura Cocina', 'temperature', '°C', 24.1, 15, 32);

-- ========== PRIVILEGIOS ==========
-- Crear usuario para la aplicación (opcional)
-- CREATE USER IF NOT EXISTS 'smartroom'@'localhost' IDENTIFIED BY 'smartroom-password';
-- GRANT ALL PRIVILEGES ON smartroom.* TO 'smartroom'@'localhost';
-- FLUSH PRIVILEGES;

-- ========== INFORMACIÓN FINAL ==========
-- Base de datos SmartRoom creada exitosamente
-- Total de tablas: 5
-- Total de vistas: 3
-- Total de procedimientos: 1
-- Total de eventos: 2
