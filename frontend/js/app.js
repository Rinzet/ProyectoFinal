/**
 * ============================================
 * SMARTROOM - APLICACIÓN PRINCIPAL
 * Inicialización y punto de entrada
 * ============================================
 */

class SmartRoomApp {
    constructor() {
        this.isInitialized = false;
        this.user = null;
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        console.log('🚀 SmartRoom - Sistema Inteligente de Monitoreo');
        console.log('Inicializando aplicación...');

        try {
            // Inicializar componentes
            await this.setupApplication();
            this.isInitialized = true;
            console.log('✓ Aplicación inicializada correctamente');
        } catch (error) {
            console.error('✗ Error al inicializar la aplicación:', error);
            this.showErrorMessage('Error al inicializar la aplicación');
        }
    }

    /**
     * Configura la aplicación
     */
    async setupApplication() {
        // Verificar autenticación
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     this.redirectToLogin();
        //     return;
        // }

        // Inicializar manager del dashboard
        await dashboard.init();

        // Inicializar animaciones
        animationManager.init();

        // Configurar event listeners globales
        this.setupGlobalEvents();

        // Cargar preferencias de usuario
        this.loadUserPreferences();

        console.log('✓ Componentes inicializados');
    }

    /**
     * Configura event listeners globales
     */
    setupGlobalEvents() {
        // Manejar cambios de visibilidad de la pestaña
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Aplicación minimizada');
                dashboard.destroy();
            } else {
                console.log('Aplicación activada');
                dashboard.init();
            }
        });

        // Manejar cambios de orientación en móviles
        window.addEventListener('orientationchange', () => {
            console.log('Orientación cambiada:', window.innerWidth, 'x', window.innerHeight);
        });

        // Manejar cambios de tamaño de ventana
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Manejar errores no capturados
        window.addEventListener('error', (event) => {
            console.error('Error global:', event.error);
        });

        // Manejar rechazos de promesas no gestionadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promesa rechazada no gestionada:', event.reason);
        });

        // Prevenir zoom en móvil
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Maneja el cambio de tamaño de la ventana
     */
    handleWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Ajustar sidebar en móvil
        if (width <= 768) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }

        // Redimensionar gráficas si es necesario
        Object.values(dashboard.charts).forEach(chart => {
            if (chart) {
                setTimeout(() => {
                    chart.resize();
                }, 100);
            }
        });
    }

    /**
     * Carga preferencias del usuario
     */
    loadUserPreferences() {
        const preferences = localStorage.getItem('userPreferences');
        if (preferences) {
            try {
                const prefs = JSON.parse(preferences);
                
                // Aplicar tema
                if (prefs.theme === 'light') {
                    document.body.classList.add('light-theme');
                }

                // Aplicar preferencia de animaciones
                if (prefs.reduceMotion) {
                    document.body.classList.add('reduce-motion');
                }
            } catch (error) {
                console.error('Error al cargar preferencias:', error);
            }
        }
    }

    /**
     * Redirige a página de login
     */
    redirectToLogin() {
        window.location.href = '/login.html';
    }

    /**
     * Muestra un mensaje de error
     */
    showErrorMessage(message) {
        const container = document.querySelector('.content-wrapper');
        if (container) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert-item danger';
            errorDiv.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">Error</div>
                    <div class="alert-time">${message}</div>
                </div>
                <button class="alert-close" onclick="this.parentElement.remove()">✕</button>
            `;
            container.insertBefore(errorDiv, container.firstChild);
        }
    }

    /**
     * Muestra un mensaje de éxito
     */
    showSuccessMessage(message) {
        const container = document.querySelector('.content-wrapper');
        if (container) {
            const successDiv = document.createElement('div');
            successDiv.className = 'alert-item success';
            successDiv.style.borderLeftColor = '#00ff88';
            successDiv.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">Éxito</div>
                    <div class="alert-time">${message}</div>
                </div>
                <button class="alert-close" onclick="this.parentElement.remove()">✕</button>
            `;
            container.insertBefore(successDiv, container.firstChild);

            // Eliminar automáticamente después de 3 segundos
            setTimeout(() => {
                if (successDiv.parentElement) {
                    animationManager.animateRemove(successDiv);
                }
            }, 3000);
        }
    }

    /**
     * Muestra un mensaje informativo
     */
    showInfoMessage(message) {
        const container = document.querySelector('.content-wrapper');
        if (container) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'alert-item info';
            infoDiv.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">Información</div>
                    <div class="alert-time">${message}</div>
                </div>
                <button class="alert-close" onclick="this.parentElement.remove()">✕</button>
            `;
            container.insertBefore(infoDiv, container.firstChild);
        }
    }

    /**
     * Obtiene el estado del sistema
     */
    async getSystemStatus() {
        try {
            // En producción, obtener del API
            return {
                online: true,
                sensorsActive: dashboard.sensorsData.length,
                lastUpdate: new Date().toLocaleTimeString('es-ES')
            };
        } catch (error) {
            console.error('Error al obtener estado:', error);
            return null;
        }
    }

    /**
     * Actualiza la información de estado en el footer
     */
    async updateStatusBar() {
        const status = await this.getSystemStatus();
        if (status) {
            document.getElementById('systemStatus').textContent = 
                status.online ? 'Online' : 'Offline';
            document.getElementById('lastUpdate').textContent = 
                status.lastUpdate;
        }
    }

    /**
     * Exporta datos a CSV
     */
    exportToCSV() {
        const data = dashboard.sensorsData;
        let csv = 'Nombre,Tipo,Ubicación,Valor,Unidad,Estado\n';
        
        data.forEach(sensor => {
            csv += `"${sensor.name}","${sensor.type}","${sensor.room}","${sensor.value}","${sensor.unit}","${sensor.status}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartroom-data-${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Imprime el dashboard
     */
    printDashboard() {
        window.print();
    }

    /**
     * Obtiene información de versión
     */
    getVersionInfo() {
        return {
            name: 'SmartRoom',
            version: '1.0.0',
            buildDate: '2026-05-29',
            author: 'SmartRoom Development Team',
            repository: 'https://github.com/smartroom/smartroom'
        };
    }

    /**
     * Muestra información de versión
     */
    showAbout() {
        const info = this.getVersionInfo();
        const message = `
${info.name} v${info.version}
Fecha de compilación: ${info.buildDate}
Autor: ${info.author}

Sistema inteligente de monitoreo y control domótico.
        `;
        alert(message);
    }
}

// ========== INICIALIZACIÓN ==========
// Crear instancia global de la aplicación
const app = new SmartRoomApp();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// Logs de desarrollo
console.log('%c🏠 SmartRoom - Sistema Inteligente', 
    'font-size: 16px; font-weight: bold; color: #00d4ff;');
console.log('%cMonitoreo y Control Digital', 
    'font-size: 12px; color: #b0b8c9;');
console.log('Presiona F12 para abrir las herramientas de desarrollador');
