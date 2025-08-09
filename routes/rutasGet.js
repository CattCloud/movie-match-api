const express = require("express");
const router = express.Router();

const controllers = require('../controllers/getControllers');

router.get('/', controllers.mensajeBienvenida);


router.get('/movies', controllers.getMovies);

router.get('/movies/genre', controllers.getGenre);

router.get('/movies/stats', controllers.getStatsMovies);

router.get('/movies/year', controllers.getMoviesByYear);

router.get('/movies/director', controllers.getMovieByDirector);

router.get('/movies/actor', controllers.getMovieByActor);

router.get('/movies/rating', controllers.getMoviesByRating);

router.get('/movies/rating/:rating', controllers.getMoviesByRating);



router.get('/movies/actor/:name', controllers.getMovieByActor);

router.get('/movies/year/:year', controllers.getMoviesByYear);

router.get('/movies/director/:name', controllers.getMovieByDirector);


router.get("/movies/:id_nombre",controllers.getMovieById);

router.get('/movies/genre/:genre', controllers.getMoviesByGenre);

router.get('/movies/genre/:genre/stats', controllers.getMoviesByGenreStats);



module.exports = router;