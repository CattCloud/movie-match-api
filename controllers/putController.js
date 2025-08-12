const {AppError} = require('../utils/AppError');

const putMovie= async (req, res, next) => {
    const { updateMovie } = require('../services/movieServices');
    const movieId = req.params.id;
    const updatedData = req.body;       
    try {
        if(movieId === undefined || movieId === null) {
            throw new AppError('ID de película no proporcionado', 400, 'update');   
        }

        if(updatedData === undefined || updatedData === null) {
            throw new AppError('No se proporcionaron datos para actualizar', 400, 'update');
        } 



        await updateMovie(movieId, updatedData);
        res.status(200).json({
            estado: 'success',
            mensaje: 'Película actualizada correctamente',
            pelicula: { id: movieId, ...updatedData }
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = { putMovie };