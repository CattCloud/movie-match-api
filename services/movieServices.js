const { get } = require('..');
const { readMoviesCSV, writeMovieToCSV , writeAllMoviesToCSV, deleteMovieCSV} = require('../models/movieModel');
const { AppError } = require("../utils/AppError");

async function getAllMovies() {
  return await readMoviesCSV();
}

async function getMovieByID_Title(parametro) {
  const registros = await readMoviesCSV();
  return registros.find(reg =>
    reg.title?.toLowerCase().includes(parametro.toLowerCase()) ||
    reg.id?.toLowerCase().includes(parametro.toLowerCase())
  );
}



async function getMoviesByGenre(generoMovie) {
  const registros = await readMoviesCSV();
  return registros.filter(reg =>
    reg.genre?.toLowerCase().includes(generoMovie.toLowerCase())
  );
}



async function getGenreCounts() {
  const registros = await readMoviesCSV();
  const genreCounts = {};
  registros.forEach(pelicula => {
    const generos = pelicula.genre.split(", ");
    generos.forEach(genero => {
      genreCounts[genero] = (genreCounts[genero] || 0) + 1;
    });
  });
  return genreCounts;
}


async function getGenre() {
  const registros = await readMoviesCSV();
  const genres = [];
  registros.forEach(pelicula => {
    const generos = pelicula.genre.split(", ");
    generos.forEach(genero => {
      if (genres.includes(genero)) return;
      genres.push(genero);
    });
  });
  return genres;
}


async function getMovieByYear(year) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => reg.year === year.toString());
  if (movies.length === 0) {
    return [];
  }
  return movies;
}


async function getMovieByToYear(year) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => parseInt(reg.year) < parseInt(year));
  if (movies.length === 0) {
    return [];
  }
  return movies;
}

async function getMovieByFromYear(year) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => parseInt(reg.year) > parseInt(year));
  if (movies.length === 0) {
    return [];
  }
  return movies;
}


async function getMovieRangeYear(from, to) {
  const registros = await readMoviesCSV();
  console.log(`Buscando películas desde ${from} hasta ${to}`);
  let movies = registros.filter(reg => {
    const y = parseInt(reg.year);
    return y > parseInt(from) && y < parseInt(to);
  });
  if (movies.length === 0) {
    return [];
  }
  return movies;
}





async function getMovieByDirector(params) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => reg.director.toLowerCase().includes(params.toLowerCase()));
  if (movies.length === 0) {
    return [];
  }
  return movies;
}



async function getMovieByMinDuration(minutes) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => parseInt(reg.runtime_minutes) >= parseInt(minutes));
  return {
    minutosMinimos: minutes,
    total: movies.length,
    peliculas: movies
  }
}


async function getMovieByMaxDuration(minutes) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => parseInt(reg.runtime_minutes) <= parseInt(minutes));
  return {
    minutosMaximos: minutes,
    total: movies.length,
    peliculas: movies
  }
}


async function getMovieByRangeDuration(minminutes,maxminutes) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => (parseInt(reg.runtime_minutes) >= parseInt(minminutes)) && (parseInt(reg.runtime_minutes) <= parseInt(maxminutes)));
  return {
    minutosMinimos: minminutes,
    minutosMaximos: maxminutes,
    total: movies.length,
    peliculas: movies
  } 
}



async function getMovieByActor(params) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => reg.actors.toLowerCase().includes(params.toLowerCase()));
  if (movies.length === 0) {
    return [];
  }
  return movies;
}

async function getMoviesByRating(rating) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => parseFloat(reg.imdb_rating) == parseFloat(rating));
  if (movies.length === 0) {
    return [];
  }
  return movies;
}

async function getMoviesByFromRating(rating) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => parseFloat(reg.imdb_rating) >= parseFloat(rating));
  if (movies.length === 0) {
    return [];
  }
  return movies;
}

async function getMoviesByToRating(rating) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => parseFloat(reg.imdb_rating) <= parseFloat(rating));
  if (movies.length === 0) {
    return [];
  }
  return movies;
}

async function getMoviesByRangeRating(ratingfrom, ratingto) {
  const registros = await readMoviesCSV();
  let movies = registros.filter(reg => {
    return (parseFloat(reg.imdb_rating) >= parseFloat(ratingfrom)) && (parseFloat(reg.imdb_rating) <= parseFloat(ratingto))
  });
  if (movies.length === 0) {
    return [];
  }
  return movies;
}

async function getMetrics() {
  try{
  const registros = await readMoviesCSV();
  const totalMovies = registros.length;
  const totalGenres = await getGenreCounts();

  const totalDirectors = new Set(registros.map(reg => reg.director)).size;
  const totalActors = new Set(registros.flatMap(reg => reg.actors.split(", "))).size;
  return {
    totalMovies, 
    totalGenres,
    totalDirectors,
    totalActors
  }}
  catch (error) {
    throw new AppError("Error al obtener las métricas", 500, "metrics");
  } 
  
}

async function validateMovie(movie) {
  const allowedFields = [
    "id", "title", "year", "genre", "director",
    "actors", "plot", "imdb_rating", "runtime_minutes"
  ];

  const movieKeys = Object.keys(movie);
  const unknownFields = movieKeys.filter(key => !allowedFields.includes(key));

  if (unknownFields.length > 0) {
    throw new AppError(
      `Campos desconocidos detectados: ${unknownFields.join(", ")}`,
      400,
      "validación"
    );
  }

  const {
    id, title, year, genre, director,
    actors, plot, imdb_rating, runtime_minutes
  } = movie;

  try {
    // Validaciones estructurales
    if (!id || !/^tt\d+$/.test(id)) {
      throw new AppError("ID inválido. Debe tener formato IMDb", 400, "validación");
    }

    if (!title || !genre || !director || !actors || !plot) {
      throw new AppError("Faltan campos obligatorios", 400, "validación");
    }

    if (typeof year !== "number" || year < 1900 || year > new Date().getFullYear()) {
      throw new AppError("Año inválido", 400, "validación");
    }

    if (typeof imdb_rating !== "number" || imdb_rating < 0 || imdb_rating > 10) {
      throw new AppError("Rating IMDb inválido", 400, "validación");
    }

    if (typeof runtime_minutes !== "number" || runtime_minutes <= 0) {
      throw new AppError("Duración inválida", 400, "validación");
    }

    // Validación de unicidad
    const movies = await getAllMovies();

    const idExists = movies.some(m => m.id === id);
    const titleExists = movies.some(m => m.title.toLowerCase() === title.toLowerCase());

    if (idExists) {
      throw new AppError("ID duplicado. Ya existe una película con ese ID", 409, "duplicado");
    }

    if (titleExists) {
      throw new AppError("Título duplicado. Ya existe una película con ese título", 409, "duplicado");
    }

    writeMovieToCSV(movie);
  } catch (err) {
    throw err;
  }
}

async function updateMovie(id, updatedData) {
  try {
    const movies = await getAllMovies();
    console.log(movies)

    const index = movies.findIndex(m => m.id == id);
    if (index === -1) {
      throw new AppError("Película no encontrada", 404, "not_found");
    }

    validateUpdateMovie(updatedData);

    const movie = movies[index];
    movies[index] = { ...movie , ...updatedData };

    await writeAllMoviesToCSV(movies);
  
  } catch (error) {
    throw error;
  }

}


async function deleteMovie(id) {
  try {
    const movies = await getAllMovies();
    const index = movies.findIndex(m => m.id === id);
    if (index === -1) {
      throw new AppError("Película no encontrada", 404, "not_found");
    }
      
    movies.splice(index, 1);
    await deleteMovieCSV(movies);

  } catch (error) {
    throw error;
  } 
}


function validateUpdateMovie(data) {
  const camposPermitidos = ["year", "imdb_rating", "runtime_minutes"];
  const camposProhibidos = ["id", "title", "genre", "actors", "director", "plot"];
  

  // Detectar claves desconocidas
  const claves = Object.keys(data);
  for (const clave of claves) {
    if (!camposPermitidos.includes(clave) && !camposProhibidos.includes(clave)) {
      throw new AppError(`Campo desconocido '${clave}'`, 400, "update");
    }
  }

  // Bloquear campos prohibidos
  for (const campo of camposProhibidos) {
    if (campo in data) {
      throw new AppError(`No se permite modificar el campo '${campo}'`, 400, "update");
    }
  }

  if ("year" in data) {
    const año = data.year;
    const actual = new Date().getFullYear();
    if (typeof año !== "number" || año < 1900 || año > actual) {
      throw new AppError("Año inválido", 400, "update");
    }
  }

  if ("imdb_rating" in data) {
    const rating = data.imdb_rating;
    if (typeof rating !== "number" || rating < 0 || rating > 10) {
      throw new AppError("Rating inválido", 400, "update");
    }
  }

  if ("runtime_minutes" in data) {
    const duracion = data.runtime_minutes;
    if (typeof duracion !== "number" || duracion <= 0) {
      throw new AppError("Duración inválida", 400, "update");
    }
  }
}


module.exports = {
  getAllMovies,
  getMovieByID_Title,
  getMoviesByGenre,
  getGenreCounts,
  getGenre,
  getMovieByYear,
  getMovieByToYear,
  getMovieByFromYear,
  getMovieRangeYear,
  getMovieByDirector,
  getMovieByActor,
  getMoviesByRating,
  getMoviesByFromRating,
  getMoviesByToRating,
  getMoviesByRangeRating,
  getMetrics,
  getMovieByMinDuration,
  getMovieByMaxDuration,
  getMovieByRangeDuration,  
  validateMovie,
  updateMovie,
  deleteMovie
};