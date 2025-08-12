


const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      estado: err.status,
      mensaje: err.message,
      tipo: err.tipo
    });
  } else {
    console.error('ERROR NO OPERACIONAL 💥', err);
    res.status(500).json({
      estado: 'error',
      mensaje: 'Algo salió mal en el servidor'
    });
  }
};


module.exports = { errorHandler};