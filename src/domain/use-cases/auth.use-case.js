const jwt = require('jsonwebtoken');
const UserRepository = require('../../infrastructure/repositories/user.repository');

class AuthUseCases {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(userData) {
    try {
      const { name, email, password } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('El usuario ya existe con ese email');
      }

      // Crear nuevo usuario
      const user = await this.userRepository.create({
        name,
        email,
        password
      });

      // Generar token JWT
      const token = this.generateToken(user._id);

      return {
        user,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(credentials) {
    try {
      const { email, password } = credentials;

      // Buscar usuario por email (con password para verificación)
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token JWT
      const token = this.generateToken(user._id);

      // Remover password del objeto user
      const userResponse = user.toJSON();

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = AuthUseCases;
