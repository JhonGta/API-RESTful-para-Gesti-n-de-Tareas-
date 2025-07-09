const AuthUseCases = require('../../domain/use-cases/auth.use-case');

class AuthMiddleware {
  constructor() {
    this.authUseCases = new AuthUseCases();
  }

  authenticate = async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Acceso denegado. No se proporcionó token de autorización'
        });
      }

      // Verificar formato: "Bearer <token>"
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Formato de token inválido. Use: Bearer <token>'
        });
      }

      // Extraer el token
      const token = authHeader.substring(7);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Acceso denegado. Token no proporcionado'
        });
      }

      // Verificar y decodificar el token
      const decoded = this.authUseCases.verifyToken(token);
      
      // Obtener información del usuario
      const user = await this.authUseCases.getUserProfile(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido. Usuario no encontrado'
        });
      }

      // Agregar usuario al objeto request
      req.user = user;
      req.userId = user._id;
      
      next();
    } catch (error) {
      console.error('Error en middleware de autenticación:', error.message);
      
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

  // Middleware opcional para rutas que pueden funcionar con o sin autenticación
  optionalAuth = async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        if (token) {
          const decoded = this.authUseCases.verifyToken(token);
          const user = await this.authUseCases.getUserProfile(decoded.userId);
          
          if (user) {
            req.user = user;
            req.userId = user._id;
          }
        }
      }
      
      next();
    } catch (error) {
      // En autenticación opcional, continuamos sin error
      next();
    }
  };
}

module.exports = AuthMiddleware;
