const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos
const connectDB = require('./src/config/database');

// Importar rutas
const authRoutes = require('./src/api/routes/auth.routes');
const taskRoutes = require('./src/api/routes/task.routes');

// Importar middlewares
const { errorHandler, notFound } = require('./src/infrastructure/middlewares/error.middleware');

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Tareas - Arquitectura Limpia',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      tasks: {
        create: 'POST /api/tasks',
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
        toggle: 'PATCH /api/tasks/:id/toggle'
      }
    },
    documentation: {
      health: 'GET /health'
    }
  });
});

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Configurar puerto y iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log('\n📚 Endpoints disponibles:');
  console.log('   POST /api/auth/register - Registrar usuario');
  console.log('   POST /api/auth/login - Iniciar sesión');
  console.log('   GET  /api/auth/profile - Obtener perfil (protegido)');
  console.log('   POST /api/tasks - Crear tarea (protegido)');
  console.log('   GET  /api/tasks - Obtener tareas (protegido)');
  console.log('   GET  /api/tasks/:id - Obtener tarea específica (protegido)');
  console.log('   PUT  /api/tasks/:id - Actualizar tarea (protegido)');
  console.log('   DELETE /api/tasks/:id - Eliminar tarea (protegido)');
  console.log('   PATCH /api/tasks/:id/toggle - Cambiar estado (protegido)');
  console.log('\n');
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

module.exports = app;
