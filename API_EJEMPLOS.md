# 📚 Ejemplos de Uso de la API SmartRoom

## 1. AUTENTICACIÓN

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "userId": 2
}
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Sesión iniciada",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

## 2. HABITACIONES

### Listar todas las habitaciones
```bash
curl -X GET http://localhost:3000/api/rooms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "rooms": [
    {
      "id": 1,
      "nombre": "Sala de Estar",
      "descripcion": "Sala principal de la casa",
      "ubicacion": "Planta baja",
      "temperatura_actual": 22.5,
      "fecha_creacion": "2026-05-29T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Crear nueva habitación
```bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Garage",
    "descripcion": "Garaje principal",
    "ubicacion": "Planta baja"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Habitación creada exitosamente",
  "roomId": 4
}
```

### Obtener habitación específica
```bash
curl -X GET http://localhost:3000/api/rooms/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "room": {
    "id": 1,
    "nombre": "Sala de Estar",
    "sensores": [
      {
        "id": 1,
        "nombre": "Temperatura Sala",
        "tipo": "temperature",
        "valor_actual": 22.5,
        "unidad": "°C"
      }
    ]
  }
}
```

### Actualizar habitación
```bash
curl -X PUT http://localhost:3000/api/rooms/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sala Principal",
    "temperatura_actual": 23.0
  }'
```

### Eliminar habitación
```bash
curl -X DELETE http://localhost:3000/api/rooms/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 3. SENSORES

### Listar todos los sensores
```bash
curl -X GET http://localhost:3000/api/sensors \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "sensors": [
    {
      "id": 1,
      "habitacion_id": 1,
      "nombre": "Temperatura Sala",
      "tipo": "temperature",
      "valor_actual": 22.5,
      "unidad": "°C",
      "estado": "activo",
      "fecha_creacion": "2026-05-29T10:00:00.000Z"
    }
  ],
  "count": 6
}
```

### Filtrar sensores por habitación
```bash
curl -X GET "http://localhost:3000/api/sensors?room=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Crear sensor
```bash
curl -X POST http://localhost:3000/api/sensors \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "habitacion_id": 1,
    "nombre": "Sensor de Humo",
    "tipo": "smoke",
    "unidad": "%",
    "valor_minimo": 0,
    "valor_maximo": 100
  }'
```

### Obtener sensor específico
```bash
curl -X GET http://localhost:3000/api/sensors/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Obtener historial de sensor (últimas 24 horas)
```bash
curl -X GET "http://localhost:3000/api/sensors/1/history?range=24h" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "valor": 22.5,
      "fecha_registro": "2026-05-29T10:00:00.000Z"
    },
    {
      "id": 2,
      "valor": 22.7,
      "fecha_registro": "2026-05-29T11:00:00.000Z"
    }
  ],
  "count": 24
}
```

### Alternar sensor (ON/OFF)
```bash
curl -X POST http://localhost:3000/api/sensors/1/toggle \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Sensor inactivo",
  "newState": "inactivo"
}
```

### Actualizar sensor
```bash
curl -X PUT http://localhost:3000/api/sensors/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Temperatura Principal",
    "valor_actual": 23.5,
    "estado": "activo"
  }'
```

### Eliminar sensor
```bash
curl -X DELETE http://localhost:3000/api/sensors/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 4. DATOS EN VIVO

### Obtener datos en vivo
```bash
curl -X GET http://localhost:3000/api/sensors/live \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "sensors": [
    {
      "id": 1,
      "nombre": "Temperatura Sala",
      "tipo": "temperature",
      "valor_actual": 22.5,
      "unidad": "°C",
      "estado": "activo",
      "habitacion": "Sala de Estar"
    }
  ],
  "timestamp": "2026-05-29T15:30:45.123Z"
}
```

---

## 5. USUARIO

### Obtener perfil
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nombre": "Usuario Demo",
    "email": "demo@smartroom.local",
    "fecha_creacion": "2026-05-29T09:00:00.000Z"
  }
}
```

### Actualizar perfil
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Nombre",
    "email": "neoemail@example.com"
  }'
```

---

## 6. ESTADÍSTICAS

### Dashboard
```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Estadísticas generales
```bash
curl -X GET http://localhost:3000/api/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Estadísticas de habitación
```bash
curl -X GET http://localhost:3000/api/rooms/1/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## CÓDIGOS DE ERROR

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Solicitud incorrecta |
| 401 | No autorizado |
| 404 | No encontrado |
| 500 | Error interno del servidor |

---

## NOTAS IMPORTANTES

1. **Autenticación**: Todos los endpoints excepto `/register` y `/login` requieren un token JWT en el header `Authorization: Bearer {token}`

2. **Tokens**: Los tokens expiran después de 7 días. Se debe hacer login nuevamente.

3. **Rangos de historial válidos**: `1h`, `24h`, `7d`, `30d`

4. **Tipos de sensores válidos**: `temperature`, `humidity`, `light`, `door`, `gas`, `smoke`, `motion`, `energy`

5. **Estados válidos**: `activo`, `inactivo`, `falla`

---

## USANDO DESDE JAVASCRIPT

```javascript
// Registro
const response = await fetch('http://localhost:3000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Juan',
    email: 'juan@example.com',
    password: 'pass123',
    confirmPassword: 'pass123'
  })
});
const data = await response.json();
console.log(data);

// Login
const loginResponse = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'juan@example.com',
    password: 'pass123'
  })
});
const loginData = await loginResponse.json();
const token = loginData.token;

// Obtener habitaciones
const roomsResponse = await fetch('http://localhost:3000/api/rooms', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const rooms = await roomsResponse.json();
console.log(rooms);
```

---

**Más información en README.md**
