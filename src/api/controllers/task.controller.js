const TaskUseCases = require('../../domain/use-cases/task.use-case');

class TaskController {
  constructor() {
    this.taskUseCases = new TaskUseCases();
  }

  // POST /api/tasks
  createTask = async (req, res, next) => {
    try {
      const { title, description } = req.body;
      const userId = req.userId;

      // Validaciones básicas
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El título de la tarea es obligatorio'
        });
      }

      // Crear tarea
      const task = await this.taskUseCases.createTask({
        title: title.trim(),
        description: description ? description.trim() : ''
      }, userId);

      res.status(201).json({
        success: true,
        message: 'Tarea creada exitosamente',
        data: {
          task
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/tasks
  getTasks = async (req, res, next) => {
    try {
      const userId = req.userId;
      
      // Parámetros de consulta opcionales
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Opciones para la consulta
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      // Obtener tareas del usuario
      const result = await this.taskUseCases.getUserTasks(userId, options);

      res.status(200).json({
        success: true,
        message: 'Tareas obtenidas exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/tasks/:id
  getTaskById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      // Obtener tarea específica
      const task = await this.taskUseCases.getTaskById(id, userId);

      res.status(200).json({
        success: true,
        message: 'Tarea obtenida exitosamente',
        data: {
          task
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/tasks/:id
  updateTask = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const updateData = req.body;

      // Validaciones
      if (updateData.title !== undefined && (!updateData.title || updateData.title.trim().length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'El título no puede estar vacío'
        });
      }

      // Limpiar y preparar datos de actualización
      const cleanUpdateData = {};
      if (updateData.title !== undefined) {
        cleanUpdateData.title = updateData.title.trim();
      }
      if (updateData.description !== undefined) {
        cleanUpdateData.description = updateData.description.trim();
      }
      if (updateData.completed !== undefined) {
        cleanUpdateData.completed = Boolean(updateData.completed);
      }

      // Actualizar tarea
      const task = await this.taskUseCases.updateTask(id, cleanUpdateData, userId);

      res.status(200).json({
        success: true,
        message: 'Tarea actualizada exitosamente',
        data: {
          task
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/tasks/:id
  deleteTask = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      // Eliminar tarea
      const result = await this.taskUseCases.deleteTask(id, userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  // PATCH /api/tasks/:id/toggle
  toggleTaskCompletion = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      // Alternar estado de completado
      const task = await this.taskUseCases.toggleTaskCompletion(id, userId);

      res.status(200).json({
        success: true,
        message: `Tarea marcada como ${task.completed ? 'completada' : 'pendiente'}`,
        data: {
          task
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = TaskController;
