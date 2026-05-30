# 🚀 GUÍA DE DESPLIEGUE Y MEJORAS FUTURAS - SmartRoom

## DESPLIEGUE EN PRODUCCIÓN

### 1. Preparar Servidor

#### En Linux (Ubuntu/Debian)
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MySQL
sudo apt install -y mysql-server

# Instalar Nginx (opcional, como reverse proxy)
sudo apt install -y nginx

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p < /path/to/schema.sql

# Crear usuario MySQL para la app
mysql -u root -p
> CREATE USER 'smartroom'@'localhost' IDENTIFIED BY 'contraseña-fuerte';
> GRANT ALL PRIVILEGES ON smartroom.* TO 'smartroom'@'localhost';
> FLUSH PRIVILEGES;
```

### 3. Configurar Backend

```bash
cd /var/www/smartroom/backend

# Instalar dependencias
npm install --production

# Configurar .env
cp .env.example .env
# Editar .env con credenciales de producción
nano .env
```

### 4. Iniciar con PM2

```bash
# Crear archivo de configuración
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'smartroom-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Habilitar inicio automático
pm2 startup
```

### 5. Configurar Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/smartroom
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend
    location / {
        alias /var/www/smartroom/frontend/;
        try_files $uri $uri/ =404;
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Caché estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6. SSL/HTTPS con Let's Encrypt

```bash
# Instalar certbot
sudo apt install -y certbot python3-certbot-nginx

# Generar certificado
sudo certbot certonly --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 📦 DESPLIEGUE CON DOCKER

### Dockerfile Backend

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Dockerfile Frontend

```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
RUN npm install -g http-server
COPY frontend/ .

FROM nginx:alpine
COPY --from=builder /app /usr/share/nginx/html
EXPOSE 80
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: smartroom
    ports:
      - "3306:3306"
    volumes:
      - ./database:/docker-entrypoint-initdb.d
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root
      DB_NAME: smartroom
      NODE_ENV: production
    depends_on:
      - mysql
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mysql_data:
```

### Ejecutar con Docker

```bash
docker-compose up -d
```

---

## 🔍 MONITOREO Y MANTENIMIENTO

### Logs
```bash
# Backend
pm2 logs smartroom-backend

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MySQL
tail -f /var/log/mysql/error.log
```

### Backups de Base de Datos

```bash
# Backup automático diario
#!/bin/bash
BACKUP_DIR="/backups/smartroom"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p smartroom > $BACKUP_DIR/smartroom_$DATE.sql
gzip $BACKUP_DIR/smartroom_$DATE.sql

# Agregar a crontab
0 2 * * * /scripts/backup-db.sh
```

### Monitoreo de Recursos

```bash
# Ver estado de PM2
pm2 monit

# Ver procesos
pm2 list

# Reiniciar aplicación
pm2 restart smartroom-backend

# Detener aplicación
pm2 stop smartroom-backend

# Ver logs
pm2 logs smartroom-backend
```

---

## 🔐 SEGURIDAD EN PRODUCCIÓN

### 1. Variables de Entorno Seguras
```bash
# Generar JWT secreto seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Usar secretos seguros
export JWT_SECRET="valor-generado-arriba"
export DB_PASSWORD="contraseña-fuerte"
```

### 2. HTTPS Obligatorio
```nginx
# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Headers de Seguridad
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:" always;
```

### 4. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por IP
});

app.use('/api/', limiter);
```

### 5. Validación y Sanitización
```javascript
const validator = require('validator');

// Validar email
if (!validator.isEmail(email)) {
  return res.status(400).json({ error: 'Email inválido' });
}

// Escapar HTML
const safe = validator.escape(userInput);
```

---

## 📈 MEJORAS FUTURAS RECOMENDADAS

### 1. WebSocket para Tiempo Real
```javascript
// server.js
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('sensor-update', (data) => {
    io.emit('update-dashboard', data);
  });
});
```

### 2. Autenticación Avanzada
- [ ] OAuth2 (Google, GitHub)
- [ ] Autenticación de dos factores (2FA)
- [ ] Biometría
- [ ] Sessions persistentes

### 3. Features Avanzadas
- [ ] Sincronización en tiempo real
- [ ] Notificaciones por email/SMS
- [ ] Reportes PDF automáticos
- [ ] Exportación de datos
- [ ] Integración con dispositivos IoT reales
- [ ] Control automático basado en reglas
- [ ] Machine Learning para predicciones
- [ ] Análisis de consumo energético

### 4. Mejoras de UI/UX
- [ ] Dark/Light mode toggle
- [ ] Temas personalizables
- [ ] Widgets personalizables
- [ ] Modo tablero (drag & drop)
- [ ] Notificaciones toast
- [ ] Búsqueda avanzada
- [ ] Filtros complejos
- [ ] Historiales de cambios

### 5. Performance
- [ ] Redis para caché
- [ ] CDN para assets
- [ ] Lazy loading de imágenes
- [ ] Compresión de datos
- [ ] Minificación de CSS/JS
- [ ] Service Workers
- [ ] Progressive Web App (PWA)

### 6. Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Cypress)
- [ ] Load testing
- [ ] Security testing

### 7. DevOps
- [ ] CI/CD con GitHub Actions
- [ ] Automatización de deployment
- [ ] Monitoring con Prometheus
- [ ] Logging centralizado (ELK)
- [ ] Alertas automáticas
- [ ] Análisis de código (SonarQube)

### 8. Base de Datos
- [ ] Replicación master-slave
- [ ] Clustering
- [ ] Sharding para escalabilidad
- [ ] Cache en memoria (Redis)
- [ ] Índices optimizados
- [ ] Particionamiento de tablas

---

## 📊 CHECKLIST DE DESPLIEGUE

### Pre-despliegue
- [ ] Revisar y probar código
- [ ] Actualizar dependencias
- [ ] Ejecutar tests
- [ ] Verificar .env producción
- [ ] Hacer backup de BD
- [ ] Revisar logs

### Despliegue
- [ ] Subir archivos al servidor
- [ ] Instalar dependencias
- [ ] Ejecutar migrations
- [ ] Configurar HTTPS
- [ ] Iniciar servicios
- [ ] Verificar conectividad

### Post-despliegue
- [ ] Probar endpoints API
- [ ] Verificar frontend
- [ ] Revisar logs
- [ ] Monitorear recursos
- [ ] Configurar backups
- [ ] Documentar cambios
- [ ] Notificar usuarios

---

## 🔄 ACTUALIZACIÓN DE VERSIONES

```bash
# Actualizar Backend
cd backend
git pull
npm install
npm run dev

# Actualizar Frontend
cd frontend
git pull
# No requiere instalar depencias

# Actualizar Base de Datos
mysql -u root -p < migrations/v1.1.sql
```

---

## 📞 TROUBLESHOOTING PRODUCCIÓN

### Error: "Cannot find module"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install --production
```

### Error: "Port already in use"
```bash
# Encontrar proceso
lsof -i :3000

# Matar proceso
kill -9 PID
```

### Error: "Database connection timeout"
```bash
# Verificar MySQL está corriendo
sudo service mysql status

# Reiniciar MySQL
sudo service mysql restart
```

### Bajo rendimiento
```bash
# Ver uso de memoria
pm2 monit

# Aumentar límite de memoria
pm2 start server.js --max-memory-restart 1G

# Usar cluster mode
pm2 start server.js -i max
```

---

## 📚 RECURSOS DE AYUDA

- [Node.js Docs](https://nodejs.org/docs/)
- [Express Deployment](https://expressjs.com/en/advanced/best-practice-security.html)
- [MySQL Best Practices](https://dev.mysql.com/doc/refman/8.0/en/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
- [Docker Documentation](https://docs.docker.com/)

---

## 🎓 CONCLUSIÓN

SmartRoom está listo para desplegarse en producción. Sigue esta guía para una instalación segura y confiable.

**¡Tu aplicación SmartRoom está lista para el mundo! 🚀**
