const AuthUseCases = require('../../domain/use-cases/auth.use-case');

class AuthController {
  constructor() {
    this.authUseCases = new AuthUseCases();
  }

  // POST /api/auth/register
  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Validaciones básicas
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son obligatorios (name, email, password)'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Registrar usuario
      const result = await this.authUseCases.registerUser({
        name,
        email,
        password
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/auth/login
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son obligatorios'
        });
      }

      // Iniciar sesión
      const result = await this.authUseCases.loginUser({
        email,
        password
      });

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/auth/profile (ruta protegida)
  getProfile = async (req, res, next) => {
    try {
      // El usuario ya está disponible en req.user gracias al middleware de autenticación
      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
