const TaskRepository = require('../../infrastructure/repositories/task.repository');
const UserRepository = require('../../infrastructure/repositories/user.repository');

class TaskUseCases {
  constructor() {
    this.taskRepository = new TaskRepository();
    this.userRepository = new UserRepository();
  }

  async createTask(taskData, userId) {
    try {
      // Verificar que el usuario existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Crear la tarea asociada al usuario
      const task = await this.taskRepository.create({
        ...taskData,
        user: userId
      });

      return task;
    } catch (error) {
      throw error;
    }
  }

  async getUserTasks(userId, options = {}) {
    try {
      // Verificar que el usuario existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Obtener tareas del usuario
      const tasks = await this.taskRepository.findByUserId(userId, options);
      
      // Obtener estadísticas adicionales
      const totalTasks = await this.taskRepository.countByUserId(userId);
      const completedTasks = await this.taskRepository.getCompletedTasksByUserId(userId);
      const pendingTasks = await this.taskRepository.getPendingTasksByUserId(userId);

      return {
        tasks,
        pagination: {
          total: totalTasks,
          completed: completedTasks.length,
          pending: pendingTasks.length,
          page: options.page || 1,
          limit: options.limit || 10
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getTaskById(taskId, userId) {
    try {
      // Buscar tarea que pertenezca al usuario
      const task = await this.taskRepository.findByIdAndUserId(taskId, userId);
      if (!task) {
        throw new Error('Tarea no encontrada o no tienes permisos para acceder a ella');
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  async updateTask(taskId, updateData, userId) {
    try {
      // Verificar que la tarea existe y pertenece al usuario
      const existingTask = await this.taskRepository.findByIdAndUserId(taskId, userId);
      if (!existingTask) {
        throw new Error('Tarea no encontrada o no tienes permisos para modificarla');
      }

      // Actualizar la tarea
      const updatedTask = await this.taskRepository.update(taskId, updateData);
      
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(taskId, userId) {
    try {
      // Verificar que la tarea existe y pertenece al usuario
      const existingTask = await this.taskRepository.findByIdAndUserId(taskId, userId);
      if (!existingTask) {
        throw new Error('Tarea no encontrada o no tienes permisos para eliminarla');
      }

      // Eliminar la tarea
      await this.taskRepository.delete(taskId);
      
      return { message: 'Tarea eliminada exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  async toggleTaskCompletion(taskId, userId) {
    try {
      // Verificar que la tarea existe y pertenece al usuario
      const existingTask = await this.taskRepository.findByIdAndUserId(taskId, userId);
      if (!existingTask) {
        throw new Error('Tarea no encontrada o no tienes permisos para modificarla');
      }

      // Alternar el estado de completado
      const updatedTask = await this.taskRepository.update(taskId, {
        completed: !existingTask.completed
      });
      
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskUseCases;
