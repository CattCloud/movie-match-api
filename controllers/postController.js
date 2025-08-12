

const addMovie = async (req, res,next) => {
    const { validateMovie } = require('../services/movieServices');
    const newMovie = req.body;
    try {
        await validateMovie(newMovie);
        res.status(201).json({
            estado: 'success',
            mensaje: 'Película añadida correctamente',
            pelicula: newMovie
        });
    } catch (error) {
        next(error);
    }
}


module.exports = { addMovie };