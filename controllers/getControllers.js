

const mensajeBienvenida = (req, res) => {
    res.send('¡Bienvenido a Movie Match!');
}

const { getAllMovies } = require('../services/movieServices');

const getMovies = async (req, res) => {
  try {
    const rawPage = req.query.page;
    const rawLimit = req.query.limit;
    const orden = req.query.orden;

    const page = parseInt(rawPage);
    const limit = parseInt(rawLimit);

    // Validaciones
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "`page` debe ser un número entero positivo mayor o igual a 1" });
    }

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: "`limit` debe ser un número entero positivo mayor o igual a 1" });
    }

    let allMovies = await getAllMovies();

    // Ordenamiento editorial
    if (orden === 'year') {
      allMovies.sort((a, b) => a.year - b.year); // ascendente
    } else if (orden === 'rating') {
      allMovies.sort((a, b) => b.rating - a.rating); // descendente
    } else if (orden) {
      return res.status(400).json({ error: "`orden` debe ser 'year' o 'rating'" });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = allMovies.slice(start, end);

    res.status(200).json({
      pagina: page,
      total: allMovies.length,
      peliculas: paginated
    });

  } catch (e) {
    res.status(500).json({ error: "Error interno del servidor: " + e.message });
  }
};


const getMoviesByYear = async (req, res) => {
    const { getMovieByYear, getMovieByToYear, getMovieByFromYear, getMovieRangeYear } = require('../services/movieServices');
    try {
        const year = req.params.year;
        const { from, to } = req.query;
        if (!year && !from && !to) {
            return res.status(400).json({
                mensaje: 'Debes especificar un parametro de año en la ruta /movies/year/:year o como query string ?from=YYYY&to=YYYY'
            });
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
            res.status(404).json({ error: `No se encontraron películas del año ${year}` });
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
}

const getStatsMovies = async (req, res) => {
    const { getGenreCounts } = require('../services/movieServices');
    try {
        const genreCounts = await getGenreCounts();
        res.status(200).json(genreCounts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas de géneros' });
    }
}


const getMovieById = async (req, res) => {
    const { getMovieByID_Title } = require('../services/movieServices');
    try {
        const pelicula = await getMovieByID_Title(req.params.id_nombre);
        if (pelicula) {
            res.status(200).json(pelicula);
        } else {
            res.status(404).json({ error: "No se encontró la película" });
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }

}



const getMoviesByGenre = async (req, res) => {
    const { getMoviesByGenre } = require('../services/movieServices');
    try {
        const genero = req.params.genre;
        const peliculas = await getMoviesByGenre(genero);
        if (peliculas.length > 0) {
            res.status(200).json(peliculas);
        } else {
            res.status(404).json({ error: 'No se encontraron películas para el género' + ` ${genero}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener películas por género' });
    }
}

const getGenre = async (req, res) => {
    const { getGenre } = require('../services/movieServices');
    try {
        const genres = await getGenre();
        res.status(200).json({ generos: genres });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener géneros' });
    }
}


const getMoviesByGenreStats = async (req, res) => {
    const { getMoviesByGenre } = require('../services/movieServices');
    try {
        const genero = req.params.genre;
        const peliculas = await getMoviesByGenre(genero);
        if (peliculas.length === 0) {
            return res.status(404).json({ error: 'No se encontraron películas para el género' });
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
        res.status(404).json({ error: e.message });
    }
}


const getMovieByActor = async (req, res) => {
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
            res.status(404).json({ error: 'No se encontraron películas para el actor' + ` ${actor}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener películas por actor' });
    }
}

const getMovieByDirector = async (req, res) => {
    const { getMovieByDirector } = require('../services/movieServices');
    try {
        const director = req.params.name;
        if (!director) {
            return res.status(400).json({ error: 'Debes especificar un nombre de director en la ruta /movies/director/:name' });
        }
        const peliculas = await getMovieByDirector(director);
        if (peliculas.length > 0) {
            res.status(200).json(peliculas);
        } else {
            res.status(404).json({ error: 'No se encontraron películas para el director' + ` ${director}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener películas por director' });
    }
}

const getMoviesByRating = async (req, res) => {
    const { getMoviesByRating, getMoviesByFromRating, getMoviesByToRating, getMoviesByRangeRating } = require('../services/movieServices');
    try {
        const rating = req.params.rating;
        const from = req.query.from;
        const to = req.query.to;
        if (!rating && !from && !to) {
            return res.status(400).json({ error: 'Debes especificar un rating en la ruta /movies/rating/:rating' });
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
            res.status(404).json({ error: 'No se encontraron películas con el rating' + ` ${rating}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener películas por rating' });
    }
}

module.exports = {
    mensajeBienvenida
    , getMovies
    , getStatsMovies
    , getMovieById
    , getMoviesByGenre,
    getGenre
    , getMoviesByGenreStats
    , getMoviesByYear
    , getMovieByActor
    , getMovieByDirector
    , getMoviesByRating
}

