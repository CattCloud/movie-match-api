const { parse } = require('csv-parse');
const { readMoviesCSV } = require('../models/movieModel');
const { get } = require('../routes/rutasGet');

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
      if(genres.includes(genero)) return;
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
getMoviesByRangeRating
};