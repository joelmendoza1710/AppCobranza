# Guía de Despliegue en Railway

Este proyecto está configurado para ser desplegado en [Railway](https://railway.app/). Consta de dos servicios: `Backend` (Spring Boot) y `Frontend` (Angular/Nginx), y una base de datos PostgreSQL.

## 1. Preparación

Asegúrate de tener el código actualizado en tu repositorio de GitHub.

## 2. Crear proyecto en Railway

1.  Inicia sesión en Railway.
2.  Crea un **New Project** > **Provision PostgreSQL**. Esto creará tu base de datos.
3.  Añade un servicio desde GitHub: **New** > **GitHub Repo** > Selecciona este repositorio.

## 3. Configurar Servicios

Railway detectará el repositorio. Necesitamos configurar dos servicios separados apuntando al mismo repo pero a diferentes carpetas/Dockerfiles.

### Servicio de Base de Datos (PostgreSQL)

Ya deberías tenerlo creado (paso 2). Railway te dará las variables de conexión (`DATABASE_URL`, `PGHOST`, etc.).

### Servicio Backend (Spring Boot)

1.  En la configuración del servicio (Settings):
    - **Root Directory**: `/backend`
    - **Docker Location**: `/backend/Dockerfile`
2.  En la sección **Variables**:
    - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}` (Railway suele proveer variables raw, o puedes usar la `DATABASE_URL` formateada para JDBC).
      - _Tip_: Usa la variable `DATABASE_URL` que Railway provee para Postgres, pero asegúrate que empiece con `jdbc:postgresql://`...
    - `SPRING_DATASOURCE_USERNAME`: `${PGUSER}`
    - `SPRING_DATASOURCE_PASSWORD`: `${PGPASSWORD}`
    - `JWT_SECRET`: Genera una cadena larga y segura.
    - `PORT`: `8080` (Opcional, Spring usa 8080 por defecto, Railway le asignará un puerto público).
3.  **Networking**: Genera un dominio público (ej. `backend-production.up.railway.app`).

### Servicio Frontend (Angular + Nginx)

1. Añade otro servicio desde el mismo repo (o "Add Service" > "GitHub Repo" otra vez).
2. En la configuración del servicio (Settings):
   - **Root Directory**: `/from`
   - **Docker Location**: `/from/Dockerfile`
3. En la sección **Variables**:
   - `PORT`: `${PORT}` (Railway inyecta esto automáticamente, Nginx lo usará).
   - `BACKEND_URL`: La URL pública de tu backend **con el protocolo http/https** (ej. `https://backend-production.up.railway.app`). **IMPORTANTE**: No pongas barra al final (`/`).
4. **Networking**: Genera un dominio público para acceder a la app.

## 4. Verificar

Una vez desplegado:

1.  Abre la URL del Frontend.
2.  El sistema debería cargar y conectar con el Backend (puedes verificar en la consola del navegador si las peticiones a `/api/...` van a la URL correcta del backend).

## Notas Importantes

- **Variables de Entorno**: El frontend NECESITA la variable `BACKEND_URL` para saber a dónde enviar las peticiones. Nginx actúa como proxy reverso usando esta URL.
- **Puertos**: Railway asigna puertos dinámicos. La configuración de Nginx ahora lee la variable `PORT` proporcionada por Railway.
