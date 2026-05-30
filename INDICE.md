# 📖 SmartRoom - Índice de Documentación

> **SmartRoom**: Sistema Inteligente de Monitoreo y Control Digital
> 
> Una aplicación web profesional con diseño futurista, dashboard moderno y arquitectura moderna.

---

## 🚀 INICIO RÁPIDO

Para empezar lo antes posible, lee primero:

1. **[INSTALACION_RAPIDA.md](./INSTALACION_RAPIDA.md)** ⚡
   - Pasos simples para comenzar
   - Configuración de base de datos
   - Iniciar servidor y frontend

---

## 📚 DOCUMENTACIÓN COMPLETA

### 1. **[README.md](./README.md)** 📖
   - Descripción general del proyecto
   - Características principales
   - Estructura del proyecto
   - Instalación detallada
   - Documentación API
   - Guía de estilos
   - Troubleshooting

### 2. **[RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md)** 📊
   - Resumen ejecutivo
   - Estadísticas del código
   - Características implementadas
   - Paleta de colores
   - Tecnologías utilizadas
   - Buenas prácticas

### 3. **[API_EJEMPLOS.md](./API_EJEMPLOS.md)** 🔌
   - Ejemplos de uso de API
   - Endpoints con ejemplos curl
   - Respuestas JSON
   - Códigos de error
   - Uso desde JavaScript

### 4. **[ARQUITECTURA.md](./ARQUITECTURA.md)** 🏗️
   - Diagrama de capas
   - Flujos de datos
   - Estructura detallada de directorios
   - Tecnologías y versiones
   - Diagramas visuales

### 5. **[DESPLIEGUE.md](./DESPLIEGUE.md)** 🚀
   - Despliegue en producción
   - Configuración de servidores
   - Docker y docker-compose
   - Monitoreo y mantenimiento
   - Seguridad en producción
   - Mejoras futuras recomendadas

### 6. **[LICENSE](./LICENSE)** 📄
   - Licencia MIT
   - Términos de uso

---

## 📁 ESTRUCTURA DEL PROYECTO

```
SmartRoom/
├── frontend/                    # 🎨 Interface de usuario
│   ├── index.html              # Dashboard principal
│   ├── css/                    # Estilos
│   └── js/                     # Scripts
├── backend/                    # ⚙️ Servidor Express
│   ├── server.js              # Servidor principal
│   ├── routes/                # Rutas API
│   ├── controllers/           # Lógica de negocio
│   ├── middleware/            # Autenticación
│   ├── config/                # Base de datos
│   ├── package.json           # Dependencias
│   └── .env                   # Configuración
├── database/                  # 💾 Base de datos
│   └── schema.sql            # Esquema MySQL
└── Documentación
    ├── README.md             # Documentación
    ├── INSTALACION_RAPIDA.md # Guía rápida ⭐
    ├── RESUMEN_PROYECTO.md   # Resumen
    ├── API_EJEMPLOS.md       # Ejemplos API
    ├── ARQUITECTURA.md       # Diagrama
    ├── DESPLIEGUE.md        # Despliegue
    ├── LICENSE              # Licencia
    └── .gitignore          # Configuración git
```

---

## 🎯 GUÍAS POR CASO DE USO

### 👤 Soy Usuario Final
1. Abre el archivo `frontend/index.html` en tu navegador
2. Usa el dashboard para monitorear sensores
3. Ve a **[INSTALACION_RAPIDA.md](./INSTALACION_RAPIDA.md)** para configurar completo

### 👨‍💻 Soy Desarrollador
1. Lee **[README.md](./README.md)** para entender la estructura
2. Consulta **[API_EJEMPLOS.md](./API_EJEMPLOS.md)** para ejemplos de código
3. Revisa **[ARQUITECTURA.md](./ARQUITECTURA.md)** para entender el flujo
4. Modifica los archivos en `frontend/js/` y `backend/`

### 🏢 Voy a Desplegar en Producción
1. Lee **[INSTALACION_RAPIDA.md](./INSTALACION_RAPIDA.md)** primero
2. Consulta **[DESPLIEGUE.md](./DESPLIEGUE.md)** para producción
3. Usa Docker para fácil despliegue
4. Configura HTTPS y seguridad

### 📚 Quiero Aprender la Arquitectura
1. Comienza con **[RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md)**
2. Estudia **[ARQUITECTURA.md](./ARQUITECTURA.md)** detalladamente
3. Revisa **[API_EJEMPLOS.md](./API_EJEMPLOS.md)** para endpoints
4. Explora el código fuente con estos conocimientos

---

## 🔑 CONCEPTOS CLAVE

### Frontend
- **SPA (Single Page Application)**: Toda la UI en un único HTML
- **Glassmorphism**: Diseño con transparencias y blur
- **Responsive Design**: Funciona en desktop, tablet y móvil
- **GSAP**: Animaciones suaves y profesionales
- **Chart.js**: Gráficas interactivas en tiempo real

### Backend
- **REST API**: Arquitectura de servicios web
- **JWT**: Autenticación segura con tokens
- **MVC**: Separación de responsabilidades
- **Middleware**: Capa de procesamiento de requests
- **Validación**: Protección de datos en servidor y cliente

### Base de Datos
- **Relaciones**: Usuarios → Habitaciones → Sensores
- **Vistas**: Para reportes complejos
- **Procedimientos**: Lógica en la base de datos
- **Eventos**: Tareas automáticas programadas
- **Índices**: Optimización de búsquedas

---

## 🚀 PASOS SIGUIENTES

### 1. Instalación (15 minutos)
```bash
# 1. Ejecutar schema.sql en MySQL
# 2. cd backend && npm install
# 3. npm run dev
# 4. Abrir frontend/index.html
```

### 2. Exploración (30 minutos)
- Navega por el dashboard
- Prueba diferentes sensores
- Genera alertas
- Revisa las gráficas

### 3. Aprendizaje (1-2 horas)
- Lee la documentación
- Estudia el código fuente
- Entiende los flujos
- Prueba la API

### 4. Customización (Variable)
- Personaliza estilos en CSS
- Agrega nuevos sensores
- Crea nuevos endpoints
- Implementa nuevas features

### 5. Despliegue (2-3 horas)
- Configura servidor
- Actualiza variables de entorno
- Ejecuta schema.sql en producción
- Inicia con PM2 o Docker

---

## 📊 ARCHIVOS IMPORTANTES

### Frontend
- `frontend/index.html` - Dashboard principal (UI)
- `frontend/css/styles.css` - Diseño y estilos (800+ líneas)
- `frontend/js/app.js` - Inicialización (200+ líneas)
- `frontend/js/dashboard.js` - Lógica del dashboard (500+ líneas)
- `frontend/js/api.js` - Cliente REST (300+ líneas)
- `frontend/js/animations.js` - Animaciones (400+ líneas)

### Backend
- `backend/server.js` - Servidor Express (200+ líneas)
- `backend/config/database.js` - Conexión MySQL (80+ líneas)
- `backend/controllers/userController.js` - Usuarios (150+ líneas)
- `backend/controllers/roomController.js` - Habitaciones (200+ líneas)
- `backend/controllers/sensorController.js` - Sensores (300+ líneas)
- `backend/routes/users.js` - Rutas usuarios
- `backend/routes/rooms.js` - Rutas habitaciones
- `backend/routes/sensors.js` - Rutas sensores
- `backend/middleware/auth.js` - Autenticación (100+ líneas)

### Base de Datos
- `database/schema.sql` - Esquema completo (400+ líneas)
  - 5 tablas
  - 3 vistas
  - 1 procedimiento
  - 2 eventos
  - Datos de ejemplo

---

## 💡 TIPS Y TRUCOS

### Desarrollo
- Abre consola (F12) para ver logs
- Usa `pm2 logs` para ver logs del servidor
- `pm2 monit` para monitorear recursos
- Usa Postman o Insomnia para probar API

### Frontend
- Modifica CSS en `styles.css` para cambiar apariencia
- Edita `dashboard.js` para cambiar lógica
- Personaliza colores en variables CSS
- Agrega más sensores en datos mock

### Backend
- Edita `.env` para cambiar configuración
- Modifica controladores para cambiar lógica
- Agrega nuevas rutas en `routes/`
- Crea nuevos controladores según necesidad

### Base de Datos
- Consulta datos: `SELECT * FROM sensores;`
- Modifica tablas: ALTER TABLE ...
- Ver vistas: `SELECT * FROM vista_sensores_activos;`
- Ejecutar procedimientos: `CALL sp_registrar_lectura_sensor(...);`

---

## 🐛 TROUBLESHOOTING RÁPIDO

| Problema | Solución |
|----------|----------|
| Puerto 3000 en uso | Cambiar puerto en .env |
| Error MySQL | Verificar credenciales en .env |
| CORS error | Revisar CORS_ORIGIN en .env |
| Módulo no encontrado | Ejecutar `npm install` |
| Página en blanco | Abrir F12 para ver errores |
| API no responde | Verificar que backend está corriendo |

---

## 📞 CONTACTO Y SOPORTE

- 📖 Revisa primero **[README.md](./README.md)**
- 🚀 Para instalación: **[INSTALACION_RAPIDA.md](./INSTALACION_RAPIDA.md)**
- 💻 Para código: Consulta los archivos en `frontend/` y `backend/`
- 🔌 Para API: **[API_EJEMPLOS.md](./API_EJEMPLOS.md)**
- 🏗️ Para arquitectura: **[ARQUITECTURA.md](./ARQUITECTURA.md)**
- 🌐 Para producción: **[DESPLIEGUE.md](./DESPLIEGUE.md)**

---

## 📈 ESTADÍSTICAS DEL PROYECTO

| Métrica | Cantidad |
|---------|----------|
| Líneas de código | ~6,100 |
| Archivos | ~22 |
| Frontend HTML | 200+ |
| Frontend CSS | 1,500+ |
| Frontend JS | 1,200+ |
| Backend | 1,000+ |
| SQL | 400+ |
| Documentación | 800+ |

---

## ✅ CHECKLIST DE INSTALACIÓN

- [ ] MySQL instalado y corriendo
- [ ] Esquema SQL ejecutado
- [ ] Node.js v14+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] .env configurado con credenciales
- [ ] Backend iniciado (`npm run dev`)
- [ ] Frontend sirviendo (en puerto 8080)
- [ ] Navegador abierto en `http://localhost:8080`
- [ ] Dashboard mostrando datos

---

## 🎉 ¡LISTO PARA COMENZAR!

1. **Paso 1**: Lee [INSTALACION_RAPIDA.md](./INSTALACION_RAPIDA.md)
2. **Paso 2**: Sigue los pasos de instalación
3. **Paso 3**: Abre el dashboard en tu navegador
4. **Paso 4**: ¡Disfruta de SmartRoom!

**¿Preguntas?** Consulta la documentación correspondiente arriba.

---

**SmartRoom v1.0.0 - Sistema Inteligente de Monitoreo** ✨

> "Controla tu hogar inteligentemente con SmartRoom"

Creado con ❤️ para desarrolladores y usuarios inteligentes.
