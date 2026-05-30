# 🏗️ ARQUITECTURA DEL PROYECTO SmartRoom

## DIAGRAMA DE CAPAS

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUARIO / NAVEGADOR                          │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (HTTP)                            │
├─────────────────────────────────────────────────────────────────┤
│  index.html (Dashboard SPA)                                      │
│  ├─ Sidebar Navigation                                           │
│  ├─ Header Superior                                              │
│  ├─ Indicadores (Temperatura, Humedad, Energía)                 │
│  ├─ Gráficas (Chart.js)                                         │
│  ├─ Sensores (Tarjetas animadas)                                │
│  ├─ Habitaciones                                                │
│  ├─ Alertas                                                     │
│  └─ Footer                                                       │
├─────────────────────────────────────────────────────────────────┤
│  CSS3 (Glassmorphism, Responsive)                               │
│  ├─ styles.css (Diseño principal)                               │
│  └─ responsive.css (Mobile/Tablet)                              │
├─────────────────────────────────────────────────────────────────┤
│  JavaScript (Lógica interactiva)                                │
│  ├─ app.js (Inicialización)                                    │
│  ├─ api.js (Cliente REST)                                      │
│  ├─ dashboard.js (Lógica del dashboard)                        │
│  └─ animations.js (Animaciones GSAP)                           │
│                                                                 │
│  Librerías externas:                                            │
│  ├─ Chart.js (Gráficas)                                        │
│  └─ GSAP (Animaciones)                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
              (HTTP/REST API con JSON)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js Express)                      │
├─────────────────────────────────────────────────────────────────┤
│  server.js (Servidor principal)                                 │
│                                                                 │
│  Middleware:                                                    │
│  ├─ CORS                                                        │
│  ├─ Body Parser                                                │
│  ├─ Morgan (Logger)                                            │
│  ├─ verifyToken (Autenticación)                               │
│  └─ errorHandler                                              │
├─────────────────────────────────────────────────────────────────┤
│  Routes (Enrutamiento)                                          │
│  ├─ routes/users.js                                            │
│  │  ├─ POST /register                                          │
│  │  ├─ POST /login                                             │
│  │  ├─ GET /profile                                            │
│  │  └─ PUT /profile                                            │
│  ├─ routes/rooms.js                                            │
│  │  ├─ GET /                                                   │
│  │  ├─ POST /                                                  │
│  │  ├─ GET /:id                                                │
│  │  ├─ PUT /:id                                                │
│  │  └─ DELETE /:id                                             │
│  └─ routes/sensors.js                                          │
│     ├─ GET /                                                   │
│     ├─ POST /                                                  │
│     ├─ GET /live                                               │
│     ├─ GET /:id/history                                        │
│     └─ POST /:id/toggle                                        │
├─────────────────────────────────────────────────────────────────┤
│  Controllers (Lógica de negocio)                                │
│  ├─ userController.js                                          │
│  │  ├─ register()                                              │
│  │  ├─ login()                                                 │
│  │  ├─ getProfile()                                            │
│  │  └─ updateProfile()                                         │
│  ├─ roomController.js                                          │
│  │  ├─ getRooms()                                              │
│  │  ├─ createRoom()                                            │
│  │  ├─ updateRoom()                                            │
│  │  └─ deleteRoom()                                            │
│  └─ sensorController.js                                        │
│     ├─ getSensors()                                            │
│     ├─ createSensor()                                          │
│     ├─ toggleSensor()                                          │
│     ├─ getSensorHistory()                                      │
│     └─ getLiveData()                                           │
├─────────────────────────────────────────────────────────────────┤
│  Middleware (Autenticación)                                     │
│  ├─ auth.js                                                    │
│  │  ├─ verifyToken() - Valida JWT                            │
│  │  ├─ generateToken() - Genera JWT                          │
│  │  └─ requestLogger() - Registra requests                   │
├─────────────────────────────────────────────────────────────────┤
│  Config (Configuración)                                         │
│  └─ database.js                                                │
│     ├─ Pool de conexiones                                      │
│     ├─ getConnection()                                         │
│     ├─ query()                                                 │
│     └─ initializeDatabase()                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    (MySQL Protocol)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS (MySQL)                         │
├─────────────────────────────────────────────────────────────────┤
│  Tablas:                                                        │
│  ├─ usuarios                                                    │
│  │  └─ id, nombre, email, contraseña, fecha_creacion          │
│  ├─ habitaciones                                               │
│  │  ├─ id, usuario_id (FK), nombre, descripcion              │
│  │  └─ ubicacion, temperatura_actual                          │
│  ├─ sensores                                                   │
│  │  ├─ id, habitacion_id (FK), nombre, tipo                  │
│  │  └─ valor_actual, estado, fecha_actualizacion             │
│  ├─ registros_sensores                                         │
│  │  └─ id, sensor_id (FK), valor, fecha_registro             │
│  └─ alertas                                                    │
│     ├─ id, usuario_id (FK), sensor_id (FK)                   │
│     └─ titulo, descripcion, tipo, leida                       │
│                                                                 │
│  Vistas:                                                        │
│  ├─ vista_resumen_habitaciones                                │
│  ├─ vista_sensores_activos                                    │
│  └─ vista_alertas_pendientes                                  │
│                                                                 │
│  Procedimientos:                                               │
│  └─ sp_registrar_lectura_sensor()                             │
│                                                                 │
│  Eventos:                                                       │
│  ├─ evento_limpiar_registros (Diario)                         │
│  └─ evento_limpiar_alertas (Diario)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLUJO DE AUTENTICACIÓN

```
┌──────────────────┐
│ Usuario          │
│ Ingresa datos    │
└────────┬─────────┘
         │
         ↓
   ┌──────────────┐
   │ Frontend     │
   │ POST /login  │
   └────┬─────────┘
        │
        ↓
   ┌─────────────────────┐
   │ Backend             │
   │ /api/users/login    │
   └────┬────────────────┘
        │
        ↓
   ┌──────────────────────────┐
   │ Buscar usuario en BD     │
   │ SELECT FROM usuarios     │
   └────┬─────────────────────┘
        │
        ↓
   ┌──────────────────────────┐
   │ Comparar contraseña      │
   │ bcryptjs.compare()       │
   └────┬─────────────────────┘
        │
        ↓
   ┌──────────────────────────┐
   │ Generar JWT Token        │
   │ jwt.sign()               │
   └────┬─────────────────────┘
        │
        ↓
   ┌──────────────────────────┐
   │ Enviar Token al Cliente  │
   │ {token, user}            │
   └────┬─────────────────────┘
        │
        ↓
   ┌──────────────────────────┐
   │ Frontend                 │
   │ localStorage.setItem()   │
   └────┬─────────────────────┘
        │
        ↓
   ┌──────────────────────────┐
   │ Cargar Dashboard         │
   │ Token en header          │
   └──────────────────────────┘
```

---

## FLUJO DE DATOS - OBTENER SENSORES

```
Frontend                    Backend                     Database
   │                           │                            │
   │──GET /api/sensors────────>│                            │
   │                           │                            │
   │                           │──verifyToken()─────────────│
   │                           │   (Validar JWT)            │
   │                           │<──────Token válido─────────│
   │                           │                            │
   │                           │──SELECT FROM sensores──────│
   │                           │                            │
   │                           │<──Datos de sensores────────│
   │                           │                            │
   │<──JSON Response───────────│                            │
   │   {sensors: [...]}        │                            │
   │                           │                            │
   │──Renderizar tarjetas──────│                            │
   │──Animar cards (GSAP)──────│                            │
   │──Actualizar DOM───────────│                            │
   │                           │                            │
```

---

## ESTRUCTURA DE DIRECTORIOS DETALLADA

```
SmartRoom/
│
├── frontend/                      # 🎨 Interfaz de usuario
│   ├── index.html                # Página principal (SPA)
│   │   ├── <aside class="sidebar">
│   │   │   ├── Logo y menú
│   │   │   └── Navegación
│   │   ├── <main class="main-content">
│   │   │   ├── Header
│   │   │   ├── Secciones dinámicas
│   │   │   │   ├── Dashboard
│   │   │   │   ├── Habitaciones
│   │   │   │   ├── Sensores
│   │   │   │   ├── Alertas
│   │   │   │   └── Configuración
│   │   │   └── Footer
│   │   └── Scripts
│   │       ├── Chart.js
│   │       ├── GSAP
│   │       └── Scripts propios
│   │
│   ├── css/
│   │   ├── styles.css            # Estilos principales (1500+ líneas)
│   │   │   ├── Variables CSS
│   │   │   ├── Reset
│   │   │   ├── Fondo animado
│   │   │   ├── Sidebar
│   │   │   ├── Header
│   │   │   ├── Indicadores
│   │   │   ├── Gráficas
│   │   │   ├── Tarjetas de sensores
│   │   │   ├── Alertas
│   │   │   └── Footer
│   │   │
│   │   └── responsive.css        # Estilos responsivos
│   │       ├── Tablet
│   │       ├── Móvil
│   │       ├── Móvil pequeño
│   │       └── Media queries
│   │
│   └── js/
│       ├── app.js                # Punto de entrada (200+ líneas)
│       │   ├── SmartRoomApp class
│       │   ├── init()
│       │   ├── setupApplication()
│       │   └── Mensajes de usuario
│       │
│       ├── api.js                # Cliente REST (300+ líneas)
│       │   ├── SmartRoomAPI class
│       │   ├── request()
│       │   ├── Métodos por recurso
│       │   └─ Manejo de errores
│       │
│       ├── dashboard.js          # Lógica del dashboard (500+ líneas)
│       │   ├── DashboardManager class
│       │   ├── init()
│       │   ├── Renderización
│       │   ├── Gráficas
│       │   ├── Eventos
│       │   └─ Actualizaciones en vivo
│       │
│       └── animations.js         # Animaciones GSAP (400+ líneas)
│           ├── AnimationManager class
│           ├── init()
│           ├─ animateSectionChange()
│           ├── animateValueUpdate()
│           └─ Todas las animaciones
│
├── backend/                       # ⚙️ Servidor Express
│   ├── server.js                 # Servidor principal (200+ líneas)
│   │   ├── Configuración Express
│   │   ├── Middleware global
│   │   ├── Rutas principales
│   │   ├── Manejo de errores
│   │   └─ Inicialización
│   │
│   ├── package.json              # Dependencias
│   │   ├── express
│   │   ├── mysql2
│   │   ├── jsonwebtoken
│   │   ├── bcryptjs
│   │   └─ Otras librerías
│   │
│   ├── .env                      # Variables de entorno
│   │   ├── DB_HOST
│   │   ├── DB_USER
│   │   ├── DB_PASSWORD
│   │   ├── JWT_SECRET
│   │   └─ PORT, NODE_ENV
│   │
│   ├── config/
│   │   └── database.js           # Configuración MySQL (80+ líneas)
│   │       ├── Pool de conexiones
│   │       ├── getConnection()
│   │       ├── query()
│   │       └─ initializeDatabase()
│   │
│   ├── routes/
│   │   ├── users.js              # Rutas de usuarios (30+ líneas)
│   │   │   ├─ POST /register
│   │   │   ├─ POST /login
│   │   │   ├─ GET /profile
│   │   │   └─ PUT /profile
│   │   │
│   │   ├── rooms.js              # Rutas de habitaciones
│   │   │   ├─ GET /
│   │   │   ├─ POST /
│   │   │   ├─ GET /:id
│   │   │   ├─ PUT /:id
│   │   │   └─ DELETE /:id
│   │   │
│   │   └── sensors.js            # Rutas de sensores
│   │       ├─ GET /
│   │       ├─ GET /live
│   │       ├─ POST /
│   │       ├─ GET /:id/history
│   │       └─ POST /:id/toggle
│   │
│   ├── controllers/
│   │   ├── userController.js     # Lógica de usuarios (150+ líneas)
│   │   │   ├── register()
│   │   │   ├── login()
│   │   │   ├── getProfile()
│   │   │   └─ updateProfile()
│   │   │
│   │   ├── roomController.js     # Lógica de habitaciones (200+ líneas)
│   │   │   ├── getRooms()
│   │   │   ├── createRoom()
│   │   │   ├── updateRoom()
│   │   │   ├── deleteRoom()
│   │   │   └─ getRoomStats()
│   │   │
│   │   └── sensorController.js   # Lógica de sensores (300+ líneas)
│   │       ├── getSensors()
│   │       ├── createSensor()
│   │       ├── updateSensor()
│   │       ├── deleteSensor()
│   │       ├── getSensorHistory()
│   │       ├── toggleSensor()
│   │       └─ getLiveData()
│   │
│   └── middleware/
│       └── auth.js               # Autenticación (100+ líneas)
│           ├── verifyToken()
│           ├── requestLogger()
│           ├── errorHandler()
│           └─ generateToken()
│
├── database/
│   └── schema.sql                # Esquema completo (400+ líneas)
│       ├── CREATE DATABASE
│       ├── Creación de tablas
│       ├─ Índices
│       ├─ Vistas SQL
│       ├─ Procedimientos almacenados
│       ├─ Eventos programados
│       └─ Datos de ejemplo
│
└── Documentación
    ├── README.md                 # Documentación completa
    ├── INSTALACION_RAPIDA.md     # Guía de instalación
    ├── API_EJEMPLOS.md           # Ejemplos de uso
    ├── RESUMEN_PROYECTO.md       # Resumen del proyecto
    ├── DESPLIEGUE.md             # Guía de despliegue
    ├── .gitignore                # Configuración Git
    └── LICENSE                   # Licencia MIT
```

---

## TECNOLOGÍAS Y VERSIONES

```
┌─────────────────────────────────┐
│ Frontend                        │
├─────────────────────────────────┤
│ HTML5                           │
│ CSS3                            │
│ JavaScript ES6+                 │
│ Chart.js 3.9.1                  │
│ GSAP 3.12.2                     │
│ Navegadores modernos            │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Backend                         │
├─────────────────────────────────┤
│ Node.js v14+                    │
│ Express.js 4.18.2               │
│ MySQL2 3.4.0                    │
│ JWT 9.0.0                       │
│ bcryptjs 2.4.3                  │
│ Validator 13.9.0                │
│ Morgan 1.10.0                   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Base de Datos                   │
├─────────────────────────────────┤
│ MySQL 5.7+                      │
│ InnoDB Engine                   │
│ UTF8MB4 Charset                 │
│ Views, Procedures, Events       │
└─────────────────────────────────┘
```

---

## FLUJO DE ACTUALIZACIÓN EN TIEMPO REAL

```
Dashboard cargado
    │
    ├─ Iniciar interval: 5 segundos
    │
    ├─ dashboard.simulateSensorUpdate()
    │   ├─ Variar valores de sensores
    │   ├─ Actualizar BD (simulado)
    │   └─ updateIndicators()
    │
    ├─ Animar cambios con GSAP
    │   ├─ animateValueUpdate()
    │   ├─ Cambio de color
    │   ├─ Escala
    │   └─ Transición suave
    │
    ├─ Actualizar gráficas: 10 segundos
    │   └─ chart.update()
    │
    └─ Renovar token: Cada 7 días
        └─ Redirigir a login
```

---

**Arquitectura completa y escalable lista para producción** ✅
