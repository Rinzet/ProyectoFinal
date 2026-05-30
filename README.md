# 🏠 SmartRoom - Sistema Inteligente de Monitoreo

> **SmartRoom** es una aplicación web futurista para monitoreo y control digital de habitaciones inteligentes con un diseño glassmorphism y estética cyberpunk.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Active%20Development-brightgreen.svg)

## 📋 Características

### 🎨 Diseño Visual
- **Glassmorphism** con transparencias y efectos blur
- **Tema Oscuro** con acentos neón (azul cian, púrpura, rosa)
- **Animaciones Suaves** con GSAP
- **Responsive Design** para desktop y móvil
- **Efectos Visuales Avanzados** (sombras neón, bordes luminosos)

### 📊 Dashboard
- Indicadores principales en tiempo real
- Gráficas interactivas (Chart.js)
- Tarjetas de sensores animadas
- Panel de alertas dinámico
- Información de habitaciones

### 🔧 Funcionalidades
- Monitoreo de temperatura y humedad
- Control de luces y dispositivos
- Registro histórico de sensores
- Sistema de alertas automáticas
- Gestión de habitaciones y sensores
- Notificaciones en tiempo real

### 🔐 Seguridad
- Autenticación con JWT
- Contraseñas encriptadas (bcryptjs)
- Validación de datos
- Middleware de autenticación

## 🛠️ Tecnologías

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño avanzado y responsive
- **JavaScript Vanilla** - Lógica interactiva
- **Chart.js** - Gráficas y visualizaciones
- **GSAP** - Animaciones suaves

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## 📁 Estructura del Proyecto

```
SmartRoom/
├── frontend/
│   ├── index.html              # Página principal
│   ├── css/
│   │   ├── styles.css          # Estilos principales
│   │   └── responsive.css      # Estilos responsive
│   └── js/
│       ├── app.js              # Aplicación principal
│       ├── api.js              # Cliente API
│       ├── dashboard.js        # Lógica del dashboard
│       └── animations.js       # Gestor de animaciones
├── backend/
│   ├── server.js               # Servidor Express
│   ├── package.json            # Dependencias
│   ├── .env                    # Configuración
│   ├── config/
│   │   └── database.js         # Conexión a BD
│   ├── routes/
│   │   ├── users.js            # Rutas de usuarios
│   │   ├── rooms.js            # Rutas de habitaciones
│   │   └── sensors.js          # Rutas de sensores
│   ├── controllers/
│   │   ├── userController.js   # Control de usuarios
│   │   ├── roomController.js   # Control de habitaciones
│   │   └── sensorController.js # Control de sensores
│   └── middleware/
│       └── auth.js             # Autenticación y logs
├── database/
│   └── schema.sql              # Esquema de BD
└── README.md                   # Este archivo
```

## 🚀 Instalación

### Requisitos Previos
- Node.js (v14+)
- MySQL (v5.7+)
- npm o yarn

### Paso 1: Clonar el Repositorio
```bash
cd SmartRoom
```

### Paso 2: Configurar Base de Datos
1. Crear base de datos MySQL
2. Ejecutar script SQL:
```bash
mysql -u root -p < database/schema.sql
```

3. Configurar credenciales en `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=smartroom
```

### Paso 3: Instalar Dependencias Backend
```bash
cd backend
npm install
```

### Paso 4: Iniciar Backend
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Paso 5: Servir Frontend
Opción A - Con servidor local:
```bash
npm install -g http-server
cd frontend
http-server -p 8080
```

Opción B - Abrir directamente en el navegador:
```bash
# Abrir frontend/index.html en el navegador
```

## 📖 Documentación API

### Autenticación

#### Registro
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Usuario",
  "email": "usuario@example.com",
  "password": "contraseña",
  "confirmPassword": "contraseña"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

### Habitaciones

#### Listar Habitaciones
```http
GET /api/rooms
Authorization: Bearer {token}
```

#### Crear Habitación
```http
POST /api/rooms
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Sala de Estar",
  "descripcion": "Sala principal",
  "ubicacion": "Planta baja"
}
```

### Sensores

#### Listar Sensores
```http
GET /api/sensors
Authorization: Bearer {token}
```

#### Crear Sensor
```http
POST /api/sensors
Authorization: Bearer {token}
Content-Type: application/json

{
  "habitacion_id": 1,
  "nombre": "Temperatura Sala",
  "tipo": "temperature",
  "unidad": "°C",
  "valor_minimo": 15,
  "valor_maximo": 30
}
```

#### Obtener Historial
```http
GET /api/sensors/{sensorId}/history?range=24h
Authorization: Bearer {token}
```

## 🎨 Guía de Estilos

### Colores
```css
--primary-color: #00d4ff        /* Azul cian */
--secondary-color: #ff006e      /* Rosa */
--accent-color: #a200f7         /* Púrpura */
--success-color: #00ff88        /* Verde neón */
--warning-color: #ffa500        /* Naranja */
--danger-color: #ff0055         /* Rojo */
```

### Componentes
- **Tarjetas**: Glassmorphism con border izquierdo animado
- **Botones**: Con efecto hover y transiciones suaves
- **Gráficas**: Colores neón con fondo oscuro
- **Animaciones**: GSAP con easing suave

## 📊 Base de Datos

### Tablas Principales
1. **usuarios** - Usuarios del sistema
2. **habitaciones** - Salas y espacios
3. **sensores** - Dispositivos de monitoreo
4. **registros_sensores** - Histórico de lecturas
5. **alertas** - Notificaciones del sistema

### Vistas
- `vista_resumen_habitaciones`
- `vista_sensores_activos`
- `vista_alertas_pendientes`

### Procedimientos
- `sp_registrar_lectura_sensor` - Registra lecturas y crea alertas

## 🔄 Flujo de Datos

```
Frontend (JS) 
    ↓
API REST (Express)
    ↓
Controladores
    ↓
Base de Datos (MySQL)
    ↓
Respuesta JSON
    ↓
Actualización DOM & Gráficas
```

## 🎯 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información general |
| GET | `/health` | Estado del servidor |
| POST | `/api/users/register` | Registro |
| POST | `/api/users/login` | Login |
| GET | `/api/users/profile` | Perfil |
| GET | `/api/rooms` | Listar habitaciones |
| POST | `/api/rooms` | Crear habitación |
| GET | `/api/sensors` | Listar sensores |
| POST | `/api/sensors` | Crear sensor |
| GET | `/api/sensors/live` | Datos en vivo |

## 🧪 Testing

### Frontend
```bash
# Abrir consola del navegador (F12)
# Ver logs en la consola
```

### Backend
```bash
npm test
```

## 📝 Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# Servidor
PORT=3000
HOST=localhost
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smartroom

# JWT
JWT_SECRET=smartroom-secret-key-2026

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Despliegue

### Producción
1. Cambiar `NODE_ENV=production`
2. Usar base de datos remota
3. Configurar HTTPS
4. Usar variables de entorno seguras

### Docker (Opcional)
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Móvil**: < 768px
- **Móvil pequeño**: < 480px

## 🎓 Buenas Prácticas Implementadas

✅ Código limpio y comentado
✅ Arquitectura MVC
✅ Manejo de errores
✅ Validación de datos
✅ Middleware de autenticación
✅ CSS modular y escalable
✅ Animaciones optimizadas
✅ Responsive design
✅ Accesibilidad (WCAG)
✅ Performance optimizado

## 🐛 Troubleshooting

### Error de conexión a BD
```bash
# Verificar que MySQL está corriendo
# Revisar credenciales en .env
# Ejecutar schema.sql
```

### Errores de CORS
```bash
# Verificar CORS_ORIGIN en .env
# Asegurar que frontend y backend están en puertos correctos
```

### Animaciones lentas
```bash
# Desactivar animaciones en navegador antiguo
# Usar GPU acceleration
```

## 📚 Recursos Adicionales

- [Express.js Docs](https://expressjs.com/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Chart.js Docs](https://www.chartjs.org/)
- [GSAP Docs](https://greensock.com/gsap/)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear rama feature
3. Commit cambios
4. Push a la rama
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE`.

## 👨‍💻 Autor

**SmartRoom Development Team**
- Versión: 1.0.0
- Fecha: 2026-05-29
- Estado: En desarrollo activo

## 📞 Soporte

Para reportar bugs o sugerencias:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

**🎉 ¡Gracias por usar SmartRoom!**

> "Controla tu hogar inteligentemente con SmartRoom"
