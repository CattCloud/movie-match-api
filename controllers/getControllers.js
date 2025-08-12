const {AppError} = require('../utils/AppError');

const mensajeBienvenida = (req, res) => {
    res.send('¡Bienvenido a Movie Match!');
}

const { getAllMovies } = require('../services/movieServices');

const getMovies = async (req, res,next) => {
    try {
        const orden = req.query.orden;
        const rawPage = req.query.page;
        const rawLimit = req.query.limit;

        let page, limit;

        // Caso 1: sin queries → devuelve todo
        if (!rawPage && !rawLimit) {
        const allMovies = await getAllMovies();
        return res.status(200).json({
            total: allMovies.length,
            peliculas: allMovies
        });
        }

        // Caso 2: solo uno definido → completar el otro
        page = parseInt(rawPage ?? '1');
        limit = parseInt(rawLimit ?? '10');

        // Validaciones
        if (isNaN(page) || page < 1) {
        throw new AppError("`page` debe ser un número entero positivo mayor o igual a 1", 400, 'validation');
         //return res.status(400).json({ error: "`page` debe ser un número entero positivo mayor o igual a 1" });
        }

        if (isNaN(limit) || limit < 1) {
        throw new AppError("`limit` debe ser un número entero positivo mayor o igual a 1", 400, 'validation');
        //return res.status(400).json({ error: "`limit` debe ser un número entero positivo mayor o igual a 1" });
        }

        // Obtener y paginar
        const allMovies = await getAllMovies();
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginated = allMovies.slice(start, end);



        // Ordenamiento editorial
        if ( orden && orden === 'year') {
            allMovies.sort((a, b) => a.year - b.year); // ascendente
        } else if ( orden && orden === 'rating') {
            allMovies.sort((a, b) => b.rating - a.rating); // descendente
        } else if (orden || orden === '') {
           throw new AppError("`orden` debe ser 'year' o 'rating'", 400, 'validation');
           //return res.status(400).json({ error: "`orden` debe ser 'year' o 'rating'" });
        }


        res.status(200).json({
            pagina: page,
            total: allMovies.length,
            peliculas: paginated
        });

    } catch (e) {
        next(e);
        //res.status(500).json({ error: "Error interno del servidor: " + e.message });
    }
};


const getMoviesByYear = async (req, res,next) => {
    const { getMovieByYear, getMovieByToYear, getMovieByFromYear, getMovieRangeYear } = require('../services/movieServices');
    try {
        const year = req.params.year;
        const { from, to } = req.query;
        if (!year && !from && !to) {
            throw new AppError("Debes especificar un año en la ruta /movies/year/:year o como query string ?from=YYYY&to=YYYY", 400, 'validation');
        }

        // Filtro por rango
        if (from && to) {
            const movies = await getMovieRangeYear(from, to);
            return res.status(200).json(
                movies.length === 0
                    ? { mensaje: `No se encontraron películas entre ${lowYear} y ${upYear}`, peliculas: [] }
                    : movies
            );
        }

        // Filtro desde cierto año
        if (from) {
            const movies = await getMovieByFromYear(from);
            return res.status(200).json(
                movies.length === 0
                    ? { mensaje: `No se encontraron películas desde el año ${from}`, peliculas: [] }
                    : movies
            );
        }

        // Filtro hasta cierto año
        if (to) {
            const movies = await getMovieByToYear(to);
            return res.status(200).json(
                movies.length === 0
                    ? { mensaje: `No se encontraron películas hasta el año ${to}`, peliculas: [] }
                    : movies
            );
        }

        const movies = await getMovieByYear(year);
        if (movies.length > 0) {
            res.status(200).json(movies);
        } else {
            throw new AppError(`No se encontraron películas del año ${year}`, 404, 'not_found');            
        }
    } catch (e) {
        next(e);
    }
}

const getStatsMovies = async (req, res,next) => {
    const { getGenreCounts } = require('../services/movieServices');
    try {
        const genreCounts = await getGenreCounts();
        res.status(200).json(genreCounts);
    } catch (error) {
        next(error);
        //res.status(500).json({ error: 'Error al obtener estadísticas de géneros' });
    }
}


const getMovieById_Nombre = async (req, res,next) => {
    const { getMovieByID_Title } = require('../services/movieServices');
    try {
        const pelicula = await getMovieByID_Title(req.params.id_nombre);
        if (pelicula) {
            res.status(200).json(pelicula);
        } else {
            throw new AppError("No se encontró la película", 404, 'not_found');
            //res.status(404).json({ error: "No se encontró la película" });
        }
    } catch (e) {
        next(e);
        //res.status(404).json({ error: e.message });
    }

}



const getMoviesByGenre = async (req, res,next) => {
    const { getMoviesByGenre } = require('../services/movieServices');
    try {
        const genero = req.params.genre;
        const peliculas = await getMoviesByGenre(genero);
        if (peliculas.length > 0) {
            res.status(200).json(peliculas);
        } else {
            throw new AppError('No se encontraron películas para el género ' + ` ${genero}`, 404, 'not_found');
            //res.status(404).json({ error: 'No se encontraron películas para el género' + ` ${genero}` });
        }
    } catch (error) {
        next(error);
        //res.status(500).json({ error: 'Error al obtener películas por género' });
    }
}

const getGenre = async (req, res,next) => {
    const { getGenre } = require('../services/movieServices');
    try {
        const genres = await getGenre();
        res.status(200).json({ generos: genres });
    } catch (error) {
        next(error);
        //res.status(500).json({ error: 'Error al obtener géneros' });
    }
}


const getMoviesByGenreStats = async (req, res,next) => {
    const { getMoviesByGenre } = require('../services/movieServices');
    try {
        const genero = req.params.genre;
        const peliculas = await getMoviesByGenre(genero);
        if (peliculas.length === 0) {
            throw new AppError('No se encontraron películas para el género ' + ` ${genero}`, 404, 'not_found');
            //return res.status(404).json({ error: 'No se encontraron películas para el género' });
        }
        const totalPeliculas = peliculas.length;
        const totalDuracion = peliculas.reduce((sum, pelicula) => sum + parseInt(pelicula.runtime_minutes || 0), 0);
        const promedioDuracion = totalDuracion / totalPeliculas;
        const totalRating = peliculas.reduce((sum, pelicula) => sum + parseFloat(pelicula.imdb_rating || 0), 0);
        const promedioRating = totalRating / totalPeliculas;
        res.status(200).json({
            totalPeliculas: totalPeliculas,
            promedioDuracion: promedioDuracion,
            promedioRating: promedioRating
        });
    } catch (e) {
        next(e);
        //res.status(404).json({ error: e.message });
    }
}


const getMovieByActor = async (req, res,next) => {
    const { getMovieByActor } = require('../services/movieServices');
    try {
        const actor = req.params.name;
        if (!actor) {
            return res.status(400).json({ error: 'Debes especificar un nombre de actor en la ruta /movies/actor/:name' });
        }
        const peliculas = await getMovieByActor(actor);
        if (peliculas.length > 0) {
            res.status(200).json(peliculas);
        } else {
            throw new AppError('No se encontraron películas para el actor' + ` ${actor}`, 404, 'not_found');    
            //res.status(404).json({ error: 'No se encontraron películas para el actor' + ` ${actor}` });
        }
    } catch (error) {
        next(error);
        //res.status(500).json({ error: 'Error al obtener películas por actor' });
    }
}

const getMovieByDirector = async (req, res,next) => {
    const { getMovieByDirector } = require('../services/movieServices');
    try {
        const director = req.params.name;
        if (!director) {
            throw new AppError('Debes especificar un nombre de director en la ruta /movies/director/:name', 400, 'validation');
            //return res.status(400).json({ error: 'Debes especificar un nombre de director en la ruta /movies/director/:name' });
        }
        const peliculas = await getMovieByDirector(director);
        if (peliculas.length > 0) {
            res.status(200).json(peliculas);
        } else {
            throw new AppError('No se encontraron películas para el director' + ` ${director}`, 404, 'not_found');
            //res.status(404).json({ error: 'No se encontraron películas para el director' + ` ${director}` });
        }
    } catch (error) {
        next(error);
        //res.status(500).json({ error: 'Error al obtener películas por director' });
    }
}

const getMoviesByRating = async (req, res,next) => {
    const { getMoviesByRating, getMoviesByFromRating, getMoviesByToRating, getMoviesByRangeRating } = require('../services/movieServices');
    try {
        const rating = req.params.rating;
        const from = req.query.from;
        const to = req.query.to;
        if (!rating && !from && !to) {
            throw new AppError("Debes especificar un rating en la ruta /movies/rating/:rating o como query string ?from=X&to=Y", 400, 'validation');
            //return res.status(400).json({ error: 'Debes especificar un rating en la ruta /movies/rating/:rating' });
        }
        if (from && to) {
            const peliculas = await getMoviesByRangeRating(from, to);
            return res.status(200).json(
                peliculas.length === 0
                    ? { mensaje: `No se encontraron películas con rating entre ${from} y ${to}`, peliculas: [] }
                    : peliculas
            );
        }
        if (from) {
            const peliculas = await getMoviesByFromRating(from);
            return res.status(200).json(
                peliculas.length === 0
                    ? { mensaje: `No se encontraron películas con rating desde ${from}`, peliculas: [] }
                    : peliculas
            );
        }
        if (to) {
            const peliculas = await getMoviesByToRating(to);
            return res.status(200).json(
                peliculas.length === 0
                    ? { mensaje: `No se encontraron películas con rating hasta ${to}`, peliculas: [] }
                    : peliculas
            );
        }
        const peliculas = await getMoviesByRating(rating);
        if (peliculas.length > 0) {
            res.status(200).json(peliculas);
        } else {
            throw new AppError('No se encontraron películas con el rating' + ` ${rating}`, 404, 'not_found');
            //res.status(404).json({ error: 'No se encontraron películas con el rating' + ` ${rating}` });
        }
    } catch (error) {
        next(error);
        //res.status(500).json({ error: 'Error al obtener películas por rating' });
    }
}



module.exports = {
    mensajeBienvenida
    , getMovies
    , getStatsMovies
    , getMovieById_Nombre
    , getMoviesByGenre,
    getGenre
    , getMoviesByGenreStats
    , getMoviesByYear
    , getMovieByActor
    , getMovieByDirector
    , getMoviesByRating
}

