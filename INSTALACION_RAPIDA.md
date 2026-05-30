# GUÍA RÁPIDA DE INSTALACIÓN - SmartRoom

## Paso 1️: Preparar Base de Datos

### En MySQL Workbench o línea de comando:
```sql
mysql -u root -p
```

Luego ejecuta:
```sql
SOURCE database/schema.sql;
```

O copia el contenido de `database/schema.sql` y ejecutalo en MySQL.

## Paso 2️: Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (ya existe, solo verifica)
# Editar .env con tus credenciales de MySQL
```

### Verificar .env:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=smartroom
PORT=3000
JWT_SECRET=smartroom-secret-key-2026
```

## Paso 3️: Iniciar Backend

```bash
# Desde la carpeta backend/
npm run dev
```

**Output esperado:**
```
╔════════════════════════════════════════╗
║     SmartRoom - Backend Server         ║
║   Sistema Inteligente de Monitoreo     ║
╚════════════════════════════════════════╝

[SERVER] ✓ Servidor iniciado exitosamente
[SERVER] Host: localhost
[SERVER] Puerto: 3000
[SERVER] URL: http://localhost:3000
```

## Paso 4️: Abrir Frontend

### Opción A: Con http-server
```bash
# Instalar http-server globalmente (si no lo tienes)
npm install -g http-server

# Ir a la carpeta frontend
cd frontend

# Iniciar servidor
http-server -p 8080 -c-1
```

Luego abre en el navegador: `http://localhost:8080`

### Opción B: Abrir directamente
1. Ve a la carpeta `frontend/`
2. Haz clic derecho en `index.html`
3. Selecciona "Abrir con navegador"

## Verificación

Cuando todo esté funcionando:

- ✅ Frontend abierto en `http://localhost:8080` (o donde lo serviste)
- ✅ Backend corriendo en `http://localhost:3000`
- ✅ MySQL conectado
- ✅ Dashboard mostrando datos de prueba

### Probar API:
```bash
curl http://localhost:3000/

# Deberías ver:
# {
#   "success": true,
#   "message": "SmartRoom - Sistema Inteligente de Monitoreo",
#   "version": "1.0.0"
# }
```

## Datos de Prueba

La base de datos viene con:
- **Usuario**: demo@smartroom.local / password
- **3 Habitaciones**: Sala, Dormitorio, Cocina
- **6 Sensores**: Temperatura, Humedad, Luz, etc.

## Solución de Problemas

### ❌ "Cannot find module 'express'"
```bash
cd backend
npm install
```

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:3306"
- Verificar que MySQL está corriendo
- Verificar credenciales en .env

### ❌ "CORS error"
- Backend y frontend deben estar en puertos diferentes
- Verificar `CORS_ORIGIN` en .env

### ❌ "Página en blanco"
- Abrir consola (F12) y revisar errores
- Verificar que backend está corriendo

## Comandos Útiles

```bash
# Backend
npm run dev          # Iniciar en desarrollo
npm start           # Iniciar en producción
npm test            # Ejecutar tests

# Frontend
http-server         # Servir archivos estáticos

# MySQL
mysql -u root -p    # Conectar a MySQL
USE smartroom;      # Seleccionar BD
SHOW TABLES;        # Ver tablas
```

## URLs Importantes

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend | http://localhost:8080 | 8080 |
| Backend | http://localhost:3000 | 3000 |
| MySQL | localhost | 3306 |
| API Docs | http://localhost:3000 | - |

## ¡Listo!

Tu aplicación SmartRoom está lista para usar. Disfruta del monitoreo inteligente.

### Próximos pasos:
- Crear más usuarios
- Agregar más habitaciones
- Configurar más sensores
- Personalizar el dashboard
- Implementar WebSocket para tiempo real

**¿Preguntas?** Revisa el archivo `README.md` para más información.
