const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const AuthMiddleware = require('../../infrastructure/middlewares/auth.middleware');
const { handleValidationErrors } = require('../../infrastructure/middlewares/error.middleware');

const router = express.Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Validaciones para registro
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número')
];

// Validaciones para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

// Rutas públicas
router.post('/register', 
  registerValidation, 
  handleValidationErrors, 
  authController.register
);

router.post('/login', 
  loginValidation, 
  handleValidationErrors, 
  authController.login
);

// Rutas protegidas
router.get('/profile', 
  authMiddleware.authenticate, 
  authController.getProfile
);

module.exports = router;
