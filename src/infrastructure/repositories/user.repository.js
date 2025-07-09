const User = require('../../domain/models/user.model');

class UserRepository {
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await User.findById(id).select('-password');
    } catch (error) {
      throw error;
    }
  }

  async findByIdWithPassword(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      }).select('-password');
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
