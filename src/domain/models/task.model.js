const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la tarea es obligatorio'],
    trim: true,
    minlength: [1, 'El título debe tener al menos 1 caracter'],
    maxlength: [200, 'El título no puede tener más de 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'La tarea debe estar asociada a un usuario']
  }
}, {
  timestamps: true
});

// Índice para optimizar consultas por usuario
taskSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
