const {AppError} = require('../utils/AppError');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError('No se proporcionó un token de autenticación', 401, 'auth');
  }
  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError('Formato de token inválido', 401, 'auth');
    }

  const token = authHeader.split(' ')[1];

  // Simulación: token válido es "1234"
  if (token !== '1234') {
    throw new AppError('Invalid token', 403, 'auth');
  }

  next(); // Token válido, continúa
}

module.exports = {authMiddleware};