const deleteMovie = async (req, res, next) => { 
    const { deleteMovie } = require('../services/movieServices');
    const movieId = req.params.id;       
    try {
        if(movieId === undefined || movieId === null) {
            throw new AppError('ID de película no proporcionado', 400, 'delete');   
        }

        await deleteMovie(movieId);
        res.status(200).json({
            estado: 'success',
            mensaje: 'Película eliminada correctamente',
            pelicula: { id: movieId }
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = { deleteMovie };