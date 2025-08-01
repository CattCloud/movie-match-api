const generoMovie = process.argv[2];

console.log(`Filtrando peliculas de genero ${generoMovie}`);

const utils = require('./utils/movieUtils.js'); 

utils.getMoviesByGenre(generoMovie);
