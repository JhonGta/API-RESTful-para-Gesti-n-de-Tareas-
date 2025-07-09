const express = require('express');
const { body, param, query } = require('express-validator');
const TaskController = require('../controllers/task.controller');
const AuthMiddleware = require('../../infrastructure/middlewares/auth.middleware');
const { handleValidationErrors } = require('../../infrastructure/middlewares/error.middleware');

const router = express.Router();
const taskController = new TaskController();
const authMiddleware = new AuthMiddleware();

// Validaciones para crear tarea
const createTaskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede tener más de 1000 caracteres')
];

// Validaciones para actualizar tarea
const updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede tener más de 1000 caracteres'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('El campo completed debe ser un booleano')
];

// Validaciones para parámetros de ID
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido')
];

// Validaciones para query parameters de paginación
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'completed'])
    .withMessage('Solo se puede ordenar por: createdAt, updatedAt, title, completed'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser: asc o desc')
];

// Todas las rutas requieren autenticación
router.use(authMiddleware.authenticate);

// POST /api/tasks - Crear nueva tarea
router.post('/', 
  createTaskValidation, 
  handleValidationErrors, 
  taskController.createTask
);

// GET /api/tasks - Obtener todas las tareas del usuario
router.get('/', 
  paginationValidation, 
  handleValidationErrors, 
  taskController.getTasks
);

// GET /api/tasks/:id - Obtener tarea específica
router.get('/:id', 
  idValidation, 
  handleValidationErrors, 
  taskController.getTaskById
);

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', 
  updateTaskValidation, 
  handleValidationErrors, 
  taskController.updateTask
);

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', 
  idValidation, 
  handleValidationErrors, 
  taskController.deleteTask
);

// PATCH /api/tasks/:id/toggle - Alternar estado de completado
router.patch('/:id/toggle', 
  idValidation, 
  handleValidationErrors, 
  taskController.toggleTaskCompletion
);

module.exports = router;
