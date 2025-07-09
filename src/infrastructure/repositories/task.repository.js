const Task = require('../../domain/models/task.model');

class TaskRepository {
  async create(taskData) {
    try {
      const task = new Task(taskData);
      return await task.save();
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const query = Task.find({ user: userId });
      
      // Aplicar ordenamiento
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
      query.sort(sortObj);
      
      // Aplicar paginación
      const skip = (page - 1) * limit;
      query.skip(skip).limit(parseInt(limit));
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Task.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUserId(taskId, userId) {
    try {
      return await Task.findOne({ _id: taskId, user: userId });
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Task.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Task.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async countByUserId(userId) {
    try {
      return await Task.countDocuments({ user: userId });
    } catch (error) {
      throw error;
    }
  }

  async getCompletedTasksByUserId(userId) {
    try {
      return await Task.find({ user: userId, completed: true });
    } catch (error) {
      throw error;
    }
  }

  async getPendingTasksByUserId(userId) {
    try {
      return await Task.find({ user: userId, completed: false });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskRepository;
