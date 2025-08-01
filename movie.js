const inputMovie = process.argv[2];

console.log(`Buscando pelicula ${inputMovie}`);

const utils = require('./utils/movieUtils.js'); 

utils.getMovieByTitle(inputMovie);
