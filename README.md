# API RESTful para Gestión de Tareas (To-Do)

Una API RESTful completa desarrollada con **Node.js**, **Express** y **MongoDB**, implementando principios de **Arquitectura Limpia** para la gestión de tareas personales.

## 🏗️ Arquitectura

El proyecto sigue los principios de Arquitectura Limpia, organizando el código en capas bien definidas:

```
/src
├── /api                    # Capa de API (Interfaz)
│   ├── /routes            # Definición de rutas
│   └── /controllers       # Controladores de HTTP
├── /domain                # Capa de Dominio (Lógica de Negocio)
│   ├── /models           # Esquemas de datos
│   └── /use-cases        # Casos de uso/Lógica de negocio
├── /infrastructure       # Capa de Infraestructura
│   ├── /repositories     # Acceso a datos
│   └── /middlewares      # Middlewares de Express
└── /config               # Configuraciones
```

## 🚀 Características

- ✅ **Autenticación JWT** completa
- ✅ **CRUD completo** para tareas
- ✅ **Arquitectura Limpia** con separación de responsabilidades
- ✅ **Validaciones robustas** de entrada
- ✅ **Manejo de errores** centralizado
- ✅ **Seguridad** con bcrypt para contraseñas
- ✅ **Autorización** - usuarios solo ven sus propias tareas
- ✅ **Paginación** y ordenamiento de resultados

## 🛠️ Tecnologías

- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Express Validator
- **Seguridad**: bcryptjs para hash de contraseñas
- **CORS**: Habilitado para frontend

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd ExamenU2_GuamanJhon
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/todo-api
   JWT_SECRET=mi_clave_secreta_super_segura_2025
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

4. **Ejecutar el proyecto**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev
   
   # Producción
   npm start
   ```

## 📚 API Endpoints

### 🔐 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/profile` | Obtener perfil del usuario | Sí |

### 📝 Tareas

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/tasks` | Crear nueva tarea | Sí |
| GET | `/api/tasks` | Obtener todas las tareas del usuario | Sí |
| GET | `/api/tasks/:id` | Obtener tarea específica | Sí |
| PUT | `/api/tasks/:id` | Actualizar tarea completa | Sí |
| DELETE | `/api/tasks/:id` | Eliminar tarea | Sí |
| PATCH | `/api/tasks/:id/toggle` | Cambiar estado completado | Sí |

### 🔍 Utilidad

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/` | Información de la API |

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Crear Tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Completar proyecto",
    "description": "Terminar la API de tareas con arquitectura limpia"
  }'
```

### Obtener Tareas (con paginación)
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗂️ Estructura de Datos

### Usuario
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string (hasheada)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Tarea
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "user": "ObjectId (referencia a Usuario)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 🔒 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para la autenticación. Para acceder a endpoints protegidos:

1. Registrarse o iniciar sesión para obtener un token
2. Incluir el token en el header `Authorization`:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

## ⚡ Características Avanzadas

### Paginación
```
GET /api/tasks?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### Filtros de Consulta
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)
- `sortBy`: Campo para ordenar (createdAt, updatedAt, title, completed)
- `sortOrder`: Orden (asc, desc)

### Validaciones
- **Email**: Formato válido y único
- **Contraseña**: Mínimo 6 caracteres con mayúscula, minúscula y número
- **Títulos**: Entre 1 y 200 caracteres
- **Descripciones**: Máximo 1000 caracteres

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 12)
- Validación de entrada en todos los endpoints
- Autorización por usuario (solo ve sus propias tareas)
- Manejo seguro de errores sin exponer información sensible
- CORS configurado

## 🐛 Manejo de Errores

La API maneja diferentes tipos de errores:

- **400**: Errores de validación
- **401**: No autorizado (token inválido/expirado)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

Respuesta de error típica:
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [] // Array de errores de validación (si aplica)
}
```

## 🧪 Testing

Para probar la API puedes usar:
- **Postman**: Importar colección de endpoints
- **curl**: Comandos de ejemplo incluidos
- **Thunder Client**: Extensión de VS Code

## 📊 Estado del Proyecto

- ✅ Registro y autenticación de usuarios
- ✅ CRUD completo de tareas
- ✅ Arquitectura limpia implementada
- ✅ Validaciones y manejo de errores
- ✅ Documentación completa
- ✅ Seguridad implementada

## 👨‍💻 Autor

**GuamanJhon** - Examen Unidad 2 - Desarrollo de Aplicaciones Distribuidas


