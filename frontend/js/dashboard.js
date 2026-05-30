/**
 * ============================================
 * SMARTROOM - DASHBOARD
 * Lógica del dashboard y gráficas
 * ============================================
 */

class DashboardManager {
    constructor() {
        this.charts = {};
        this.sensorsData = [];
        this.roomsData = [];
        this.alertsData = [];
        this.updateInterval = null;
        this.chartUpdateInterval = null;
        this.timeInterval = null;
        this.listenersBound = false;
        this.isInitialized = false;
    }

    /**
     * Inicializa el dashboard
     */
    async init() {
        if (this.isInitialized) {
            this.destroy();
        }

        this.setupEventListeners();
        await this.loadDashboardData();
        this.createCharts();
        this.startAutoUpdate();
        this.isInitialized = true;
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        if (this.listenersBound) {
            return;
        }

        // Navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Botón de menú móvil
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Búsqueda
        const searchBox = document.querySelector('.search-box input');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Botón de notificaciones
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Botón de logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        this.listenersBound = true;
    }

    /**
     * Maneja la navegación entre secciones
     */
    handleNavigation(e) {
        e.preventDefault();
        const navItem = e.currentTarget;
        const section = navItem.getAttribute('data-section');
        const sectionElement = document.getElementById(`${section}-section`);

        if (!sectionElement) {
            return;
        }

        // Actualizar menú activo
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        navItem.classList.add('active');

        // Cambiar sección
        const currentActive = document.querySelector('.section.active');

        if (currentActive && currentActive !== sectionElement) {
            animationManager.animateSectionChange(currentActive, sectionElement);
        } else {
            sectionElement.classList.add('active');
        }

        // Actualizar título
        const titles = {
            'dashboard': 'Dashboard',
            'rooms': 'Habitaciones',
            'sensors': 'Sensores',
            'alerts': 'Alertas',
            'settings': 'Configuración'
        };
        document.querySelector('.page-title').textContent = titles[section] || 'Dashboard';
    }

    /**
     * Carga datos del dashboard
     */
    async loadDashboardData() {
        try {
            // Simular carga de datos (en producción, usar API)
            this.generateMockData();
            this.renderSensors();
            this.renderSensorsList();
            this.renderRooms();
            this.renderAlerts();
            this.updateIndicators();
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    }

    /**
     * Genera datos mock para demostración
     */
    generateMockData() {
        // Datos de sensores
        this.sensorsData = [
            {
                id: 1,
                name: 'Temperatura Sala',
                type: 'temperature',
                room: 'Sala de Estar',
                value: 22.5,
                unit: '°C',
                icon: '🌡️',
                status: 'active',
                min: 15,
                max: 30
            },
            {
                id: 2,
                name: 'Humedad Sala',
                type: 'humidity',
                room: 'Sala de Estar',
                value: 58,
                unit: '%',
                icon: '💧',
                status: 'active',
                min: 30,
                max: 70
            },
            {
                id: 3,
                name: 'Luz Principal',
                type: 'light',
                room: 'Sala de Estar',
                value: 85,
                unit: '%',
                icon: '💡',
                status: 'active'
            },
            {
                id: 4,
                name: 'Temperatura Dormitorio',
                type: 'temperature',
                room: 'Dormitorio',
                value: 19.3,
                unit: '°C',
                icon: '🌡️',
                status: 'active',
                min: 15,
                max: 30
            },
            {
                id: 5,
                name: 'Puerta Principal',
                type: 'door',
                room: 'Entrada',
                value: 'Cerrada',
                icon: '🚪',
                status: 'active'
            },
            {
                id: 6,
                name: 'Consumo Energético',
                type: 'energy',
                room: 'General',
                value: 2.4,
                unit: 'kW',
                icon: '⚡',
                status: 'active'
            }
        ];

        // Datos de habitaciones
        this.roomsData = [
            { id: 1, name: 'Sala de Estar', temp: 22.5, devices: 3, sensors: ['Temperatura', 'Humedad', 'Luz'] },
            { id: 2, name: 'Dormitorio', temp: 19.3, devices: 2, sensors: ['Temperatura', 'Luz'] },
            { id: 3, name: 'Cocina', temp: 24.1, devices: 4, sensors: ['Temperatura', 'Luz', 'Gas'] }
        ];

        // Datos de alertas
        this.alertsData = [
            { id: 1, type: 'info', title: 'Sistema iniciado', message: 'SmartRoom en línea', time: 'Hace 2 min' },
            { id: 2, type: 'warning', title: 'Temperatura alta', message: 'Sala de estar: 28°C', time: 'Hace 15 min' },
            { id: 3, type: 'info', title: 'Luz apagada', message: 'Dormitorio: Luz desactivada', time: 'Hace 1 hora' }
        ];
    }

    /**
     * Renderiza las tarjetas de sensores
     */
    renderSensors() {
        const container = document.getElementById('sensorsContainer');
        if (!container) return;

        container.innerHTML = '';

        this.sensorsData.forEach((sensor, index) => {
            const card = document.createElement('div');
            card.className = 'sensor-card';
            card.innerHTML = `
                <div class="sensor-header">
                    <div>
                        <div class="sensor-status">● Activo</div>
                        <h3 class="sensor-title">${sensor.name}</h3>
                        <p class="sensor-location">${sensor.room}</p>
                    </div>
                    <span class="sensor-icon">${sensor.icon}</span>
                </div>
                <div class="sensor-value">
                    ${sensor.value}<span class="sensor-unit">${sensor.unit || ''}</span>
                </div>
                <div class="sensor-actions">
                    <button class="sensor-btn" onclick="dashboard.toggleSensor(${sensor.id})">Activar</button>
                    <button class="sensor-btn" onclick="dashboard.showSensorDetails(${sensor.id})">Detalles</button>
                </div>
            `;
            container.appendChild(card);
        });
        // Animar las tarjetas una vez después de añadirlas todas
        animationManager.animateSensorCards();
    }

    /**
     * Renderiza la lista detallada de sensores
     */
    renderSensorsList() {
        const container = document.getElementById('sensorsListContainer');
        if (!container) return;

        container.innerHTML = '';

        this.sensorsData.forEach((sensor) => {
            const item = document.createElement('div');
            item.className = 'sensor-card';
            item.innerHTML = `
                <div class="sensor-header">
                    <div>
                        <div class="sensor-status">● Activo</div>
                        <h3 class="sensor-title">${sensor.name}</h3>
                        <p class="sensor-location">${sensor.room}</p>
                    </div>
                    <span class="sensor-icon">${sensor.icon}</span>
                </div>
                <div class="sensor-value">
                    ${sensor.value}<span class="sensor-unit">${sensor.unit || ''}</span>
                </div>
                <div class="sensor-actions">
                    <button class="sensor-btn" onclick="dashboard.toggleSensor(${sensor.id})">Activar</button>
                    <button class="sensor-btn" onclick="dashboard.showSensorDetails(${sensor.id})">Detalles</button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    /**
     * Renderiza las habitaciones
     */
    renderRooms() {
        const container = document.getElementById('roomsContainer');
        if (!container) return;

        container.innerHTML = '';

        this.roomsData.forEach((room) => {
            const card = document.createElement('div');
            card.className = 'room-card';
            card.innerHTML = `
                <div class="room-header">
                    <h3 class="room-name">🏠 ${room.name}</h3>
                    <div class="room-temp">${room.temp}°C</div>
                </div>
                <div class="room-devices">
                    ${room.sensors.map(sensor => `<span class="device-chip">✓ ${sensor}</span>`).join('')}
                </div>
            `;
            container.appendChild(card);
        });
    }

    /**
     * Renderiza las alertas
     */
    renderAlerts() {
        const container = document.getElementById('alertsContainer');
        if (!container) return;

        container.innerHTML = '';

        this.alertsData.forEach((alert) => {
            const item = document.createElement('div');
            item.className = `alert-item ${alert.type}`;
            item.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-time">${alert.message} • ${alert.time}</div>
                </div>
                <button class="alert-close" onclick="this.parentElement.remove()">✕</button>
            `;
            container.appendChild(item);
            animationManager.animateAlert(item);
        });
    }

    /**
     * Actualiza los indicadores principales
     */
    updateIndicators() {
        const tempSensor = this.sensorsData.find(s => s.type === 'temperature');
        const humiditySensor = this.sensorsData.find(s => s.type === 'humidity');
        const energySensor = this.sensorsData.find(s => s.type === 'energy');

        if (tempSensor) {
            document.getElementById('tempValue').textContent = tempSensor.value + '°C';
            const tempPercent = ((tempSensor.value - tempSensor.min) / (tempSensor.max - tempSensor.min)) * 100;
            document.getElementById('tempBar').style.width = tempPercent + '%';
        }

        if (humiditySensor) {
            document.getElementById('humidityValue').textContent = humiditySensor.value + '%';
            document.getElementById('humidityBar').style.width = humiditySensor.value + '%';
        }

        if (energySensor) {
            document.getElementById('powerValue').textContent = energySensor.value + ' ' + energySensor.unit;
            document.getElementById('powerBar').style.width = (energySensor.value / 10) * 100 + '%';
        }
    }

    /**
     * Crea las gráficas con Chart.js
     */
    createCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};

        // Gráfica de temperatura
        const tempContext = document.getElementById('temperatureChart');
        if (tempContext) {
            this.charts.temperature = new Chart(tempContext, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
                    datasets: [{
                        label: 'Temperatura (°C)',
                        data: [18, 17.5, 19, 22.5, 24, 23, 20],
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#00d4ff',
                        pointBorderColor: '#0a0e27',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: { color: '#b0b8c9' },
                            grid: { color: 'rgba(0, 212, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#b0b8c9' },
                            grid: { color: 'rgba(0, 212, 255, 0.1)' }
                        }
                    }
                }
            });
        }

        // Gráfica de energía
        const energyContext = document.getElementById('energyChart');
        if (energyContext) {
            this.charts.energy = new Chart(energyContext, {
                type: 'bar',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Consumo (kW)',
                        data: [2.1, 2.3, 2.0, 2.4, 2.5, 1.8, 1.6],
                        backgroundColor: [
                            'rgba(0, 212, 255, 0.8)',
                            'rgba(162, 0, 247, 0.8)',
                            'rgba(0, 212, 255, 0.8)',
                            'rgba(162, 0, 247, 0.8)',
                            'rgba(0, 212, 255, 0.8)',
                            'rgba(162, 0, 247, 0.8)',
                            'rgba(0, 212, 255, 0.8)'
                        ],
                        borderColor: '#00d4ff',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#b0b8c9' },
                            grid: { color: 'rgba(0, 212, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#b0b8c9' },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }

    /**
     * Inicia la actualización automática de datos
     */
    startAutoUpdate() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        if (this.chartUpdateInterval) {
            clearInterval(this.chartUpdateInterval);
        }

        // Actualizar hora
        this.updateTime();
        this.timeInterval = setInterval(() => this.updateTime(), 1000);

        // Actualizar sensores cada 5 segundos
        this.updateInterval = setInterval(() => {
            this.simulateSensorUpdate();
        }, 5000);

        // Actualizar gráficas cada 10 segundos
        this.chartUpdateInterval = setInterval(() => {
            this.updateCharts();
        }, 10000);
    }

    /**
     * Actualiza la hora en tiempo real
     */
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES');
        document.getElementById('current-time').textContent = timeString;
    }

    /**
     * Simula actualización de sensores
     */
    simulateSensorUpdate() {
        // Variar valores ligeramente
        this.sensorsData.forEach(sensor => {
            if (sensor.type === 'temperature') {
                sensor.value += (Math.random() - 0.5) * 0.5;
                sensor.value = Math.round(sensor.value * 10) / 10;
            } else if (sensor.type === 'humidity') {
                sensor.value += (Math.random() - 0.5) * 2;
                sensor.value = Math.max(0, Math.min(100, Math.round(sensor.value)));
            }
        });

        this.updateIndicators();
        this.updateSensorCards();
    }

    /**
     * Actualiza las tarjetas visuales de sensores
     */
    updateSensorCards() {
        const cards = document.querySelectorAll('.sensor-card');
        cards.forEach((card, index) => {
            const sensor = this.sensorsData[index];
            if (sensor) {
                const valueEl = card.querySelector('.sensor-value');
                if (valueEl) {
                    const newText = `${sensor.value}<span class="sensor-unit">${sensor.unit || ''}</span>`;
                    if (valueEl.innerHTML !== newText) {
                        animationManager.animateValueUpdate(valueEl, newText);
                        valueEl.innerHTML = newText;
                    }
                }
            }
        });
    }

    /**
     * Actualiza las gráficas
     */
    updateCharts() {
        if (this.charts.temperature) {
            // Agregar nuevo dato
            const newValue = Math.round((Math.random() * 10 + 15) * 10) / 10;
            this.charts.temperature.data.datasets[0].data.shift();
            this.charts.temperature.data.datasets[0].data.push(newValue);
            this.charts.temperature.update('none');
        }
    }

    /**
     * Maneja la búsqueda
     */
    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.sensor-card');

        cards.forEach(card => {
            const title = card.querySelector('.sensor-title').textContent.toLowerCase();
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    }

    /**
     * Alterna el menú móvil
     */
    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
        animationManager.animateMenuToggle(sidebar, sidebar.classList.contains('open'));
    }

    /**
     * Muestra notificaciones
     */
    showNotifications() {
        const badge = document.getElementById('notificationBadge');
        animationManager.animateNotificationBadge(badge);
        console.log('Mostrando notificaciones...');
    }

    /**
     * Alterna sensor
     */
    toggleSensor(id) {
        const sensor = this.sensorsData.find(s => s.id === id);
        if (sensor) {
            sensor.status = sensor.status === 'active' ? 'inactive' : 'active';
            this.renderSensors();
            this.renderSensorsList();
        }
    }

    /**
     * Muestra detalles del sensor
     */
    showSensorDetails(id) {
        const sensor = this.sensorsData.find(s => s.id === id);
        if (sensor) {
            alert(`${sensor.name}\nUbicación: ${sensor.room}\nValor: ${sensor.value}${sensor.unit}\nEstado: ${sensor.status}`);
        }
    }

    /**
     * Maneja logout
     */
    async handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            console.log('Cerrando sesión...');
            // En producción, llamar a api.logout()
        }
    }

    /**
     * Limpia el dashboard
     */
    destroy() {
        this.isInitialized = false;

        if (this.timeInterval) clearInterval(this.timeInterval);
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.chartUpdateInterval) clearInterval(this.chartUpdateInterval);

        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};

        this.updateInterval = null;
        this.chartUpdateInterval = null;
        this.timeInterval = null;
    }
}

// Instancia global del dashboard
const dashboard = new DashboardManager();
window.dashboard = dashboard;
