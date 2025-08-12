const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto a tu dominio permitido    
    methods: 'GET,POST,PUT,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
    credentials: true, // Permitir credenciales (cookies, autenticación)
};

const corsMiddleware = cors(corsOptions);
module.exports = corsMiddleware;