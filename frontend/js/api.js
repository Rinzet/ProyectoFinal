/**
 * ============================================
 * SMARTROOM - API CLIENT
 * Módulo para comunicación con backend
 * ============================================
 */

class SmartRoomAPI {
    constructor() {
        // URL base del API (cambiar según necesidad)
        this.baseURL = 'http://localhost:3000/api';
        this.timeout = 5000;
    }

    /**
     * Realiza una petición HTTP genérica
     * @param {string} endpoint - Ruta del endpoint
     * @param {object} options - Opciones de la petición
     * @returns {Promise} Respuesta del servidor
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ========== USUARIOS ==========
    /**
     * Inicia sesión de usuario
     */
    async login(email, password) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    /**
     * Registra un nuevo usuario
     */
    async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Obtiene perfil del usuario actual
     */
    async getProfile() {
        return this.request('/users/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Actualiza perfil del usuario
     */
    async updateProfile(userData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Cierra sesión del usuario
     */
    async logout() {
        return this.request('/users/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    // ========== HABITACIONES ==========
    /**
     * Obtiene todas las habitaciones del usuario
     */
    async getRooms() {
        return this.request('/rooms', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Obtiene una habitación específica
     */
    async getRoom(roomId) {
        return this.request(`/rooms/${roomId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Crea una nueva habitación
     */
    async createRoom(roomData) {
        return this.request('/rooms', {
            method: 'POST',
            body: JSON.stringify(roomData),
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Actualiza una habitación
     */
    async updateRoom(roomId, roomData) {
        return this.request(`/rooms/${roomId}`, {
            method: 'PUT',
            body: JSON.stringify(roomData),
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Elimina una habitación
     */
    async deleteRoom(roomId) {
        return this.request(`/rooms/${roomId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    // ========== SENSORES ==========
    /**
     * Obtiene todos los sensores
     */
    async getSensors() {
        return this.request('/sensors', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Obtiene sensores de una habitación específica
     */
    async getRoomSensors(roomId) {
        return this.request(`/sensors?room=${roomId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Obtiene un sensor específico
     */
    async getSensor(sensorId) {
        return this.request(`/sensors/${sensorId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Crea un nuevo sensor
     */
    async createSensor(sensorData) {
        return this.request('/sensors', {
            method: 'POST',
            body: JSON.stringify(sensorData),
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Actualiza un sensor
     */
    async updateSensor(sensorId, sensorData) {
        return this.request(`/sensors/${sensorId}`, {
            method: 'PUT',
            body: JSON.stringify(sensorData),
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Elimina un sensor
     */
    async deleteSensor(sensorId) {
        return this.request(`/sensors/${sensorId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Obtiene datos históricos de un sensor
     */
    async getSensorHistory(sensorId, timeRange = '24h') {
        return this.request(`/sensors/${sensorId}/history?range=${timeRange}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Actualiza el estado de un sensor (ON/OFF)
     */
    async toggleSensor(sensorId) {
        return this.request(`/sensors/${sensorId}/toggle`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    // ========== ALERTAS ==========
    /**
     * Obtiene todas las alertas
     */
    async getAlerts() {
        return this.request('/alerts', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Obtiene alertas no leídas
     */
    async getUnreadAlerts() {
        return this.request('/alerts?unread=true', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Marca una alerta como leída
     */
    async markAlertAsRead(alertId) {
        return this.request(`/alerts/${alertId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Elimina una alerta
     */
    async deleteAlert(alertId) {
        return this.request(`/alerts/${alertId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    // ========== DATOS EN TIEMPO REAL ==========
    /**
     * Obtiene los valores actuales de todos los sensores
     */
    async getLiveData() {
        return this.request('/sensors/live', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Obtiene estadísticas generales del sistema
     */
    async getSystemStats() {
        return this.request('/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    /**
     * Obtiene datos para el dashboard
     */
    async getDashboardData() {
        return this.request('/dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}

// Instancia global del API
const api = new SmartRoomAPI();
