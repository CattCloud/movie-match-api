const express = require("express");
const router = express.Router();

const getController = require('../controllers/getControllers');
const postController = require('../controllers/postController');
const putController = require('../controllers/putController');
const deleteController = require('../controllers/deleteController');
const { authMiddleware } = require('../middleware/authMiddlware');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Mensaje de bienvenida
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Mensaje de bienvenida exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Bienvenido a la API de Películas"
 */
router.get('/', getController.mensajeBienvenida);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Obtener todas las películas
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Filtrar por limite de resultados , por defecto 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Filtrar por página de resultados, por defecto 1
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *         description: Filtrar por orden de resultados, valores year o rating
 *     responses:
 *       200:
 *         description: Lista de películas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/movies', getController.getMovies);




/**
 * @swagger
 * /movies/metrics:
 *   get:
 *     summary: Obtener métricas generales de las películas
 *     tags: [Movies]
 *     description: Retorna estadísticas agregadas como cantidad total de películas, géneros, directores y actores únicos.
 *     responses:
 *       200:
 *         description: Métricas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMovies:
 *                   type: integer
 *                   example: 120
 *                   description: Número total de películas registradas
 *                 totalGenres:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   example: { "Drama": 45, "Comedia": 30, "Acción": 25 }
 *                   description: Conteo por género
 *                 totalDirectors:
 *                   type: integer
 *                   example: 35
 *                   description: Número de directores únicos
 *                 totalActors:
 *                   type: integer
 *                   example: 150
 *                   description: Número de actores únicos
 *       500:
 *         description: Error interno al obtener las métricas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/movies/metrics', getController.getMetrics);




/**
 * @swagger
 * /movies/genre:
 *   get:
 *     summary: Obtener lista de géneros disponibles
 *     tags: [Movies - Genre]
 *     responses:
 *       200:
 *         description: Lista de géneros obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Drama", "Comedy", "Action", "Thriller"]
 */
router.get('/movies/genre', getController.getGenre);

/**
 * @swagger
 * /movies/stats:
 *   get:
 *     summary: Obtener estadísticas generales de películas
 *     tags: [Movies - Stats]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/GenreStats'
 */
router.get('/movies/stats', getController.getStatsMovies);

/**
 * @swagger
 * /movies/year:
 *   get:
 *     summary: Obtener películas por rango de años (query parameter)
 *     tags: [Movies - Filter]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Año desde (mayor que)
 *       - in: query
 *         name: to
 *         schema:
 *           type: integer
 *         description: Año hasta (menor que)
 *     responses:
 *       200:
 *         description: Películas filtradas por año
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/movies/year', getController.getMoviesByYear);

/**
 * @swagger
 * /movies/year/{year}:
 *   get:
 *     summary: Obtener películas por año específico
 *     tags: [Movies - Filter]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Año de la película
 *         example: 2020
 *     responses:
 *       200:
 *         description: Películas del año especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/movies/year/:year', getController.getMoviesByYear);

/**
 * @swagger
 * /movies/duration:
 *   get:
 *     summary: Filtrar películas por duración mínima, máxima o rango
 *     tags: [Movies - Filter]
 *     description: Permite obtener películas cuya duración sea mayor, menor o dentro de un rango específico en minutos.
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Duración mínima en minutos. Debe ser un número entero positivo.
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Duración máxima en minutos. Debe ser un número entero positivo.
 *     responses:
 *       200:
 *         description: Películas filtradas exitosamente por duración
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     minutosMinimos:
 *                       type: integer
 *                       example: 120
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     peliculas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *                 - type: object
 *                   properties:
 *                     minutosMaximos:
 *                       type: integer
 *                       example: 90
 *                     total:
 *                       type: integer
 *                       example: 3
 *                     peliculas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *                 - type: object
 *                   properties:
 *                     minutosMinimos:
 *                       type: integer
 *                       example: 100
 *                     minutosMaximos:
 *                       type: integer
 *                       example: 150
 *                     total:
 *                       type: integer
 *                       example: 7
 *                     peliculas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *                 - type: object
 *                   properties:
 *                     mensaje:
 *                       type: string
 *                       example: No se encontraron películas con duración entre 100 y 150 minutos
 *                     peliculas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Error de validación en los parámetros de duración
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/movies/duration", getController.getMoviesByDuration);


/**
 * @swagger
 * /movies/director/{name}:
 *   get:
 *     summary: Buscar películas por director específico
 *     tags: [Movies - Search]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del director
 *         example: "Christopher Nolan"
 *     responses:
 *       200:
 *         description: Películas encontradas del director
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/movies/director/:name', getController.getMovieByDirector);



/**
 * @swagger
 * /movies/actor/{name}:
 *   get:
 *     summary: Buscar películas por actor específico
 *     tags: [Movies - Search]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del actor
 *         example: "Leonardo DiCaprio"
 *     responses:
 *       200:
 *         description: Películas encontradas con el actor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/movies/actor/:name', getController.getMovieByActor);

/**
 * @swagger
 * /movies/rating:
 *   get:
 *     summary: Filtrar películas por rango de calificación
 *     tags: [Movies - Filter]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: number
 *         description: Calificación mínima
 *       - in: query
 *         name: to
 *         schema:
 *           type: number
 *         description: Calificación máxima
 *     responses:
 *       200:
 *         description: Películas filtradas por calificación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/movies/rating', getController.getMoviesByRating);

/**
 * @swagger
 * /movies/rating/{rating}:
 *   get:
 *     summary: Obtener películas con calificación específica
 *     tags: [Movies - Filter]
 *     parameters:
 *       - in: path
 *         name: rating
 *         required: true
 *         schema:
 *           type: number
 *         description: Calificación exacta de IMDb
 *         example: 8.5
 *     responses:
 *       200:
 *         description: Películas con la calificación especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/movies/rating/:rating', getController.getMoviesByRating);

/**
 * @swagger
 * /movies/{id_nombre}:
 *   get:
 *     summary: Buscar película por ID o nombre
 *     tags: [Movies - Search]
 *     parameters:
 *       - in: path
 *         name: id_nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de IMDb o nombre de la película
 *         example: "tt0111161"
 *     responses:
 *       200:
 *         description: Película encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Película no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/movies/:id_nombre", getController.getMovieById_Nombre);

/**
 * @swagger
 * /movies/genre/{genre}:
 *   get:
 *     summary: Obtener películas por género específico
 *     tags: [Movies - Genre]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del género
 *         example: "Drama"
 *     responses:
 *       200:
 *         description: Películas del género especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/movies/genre/:genre', getController.getMoviesByGenre);

/**
 * @swagger
 * /movies/genre/{genre}/stats:
 *   get:
 *     summary: Obtener estadísticas de un género específico
 *     tags: [Movies - Stats]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del género
 *         example: "Drama"
 *     responses:
 *       200:
 *         description: Estadísticas del género
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     promedio_rating:
 *                       type: number
 *                     duracion_promedio:
 *                       type: number
 */
router.get('/movies/genre/:genre/stats', getController.getMoviesByGenreStats);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Agregar una nueva película
 *     tags: [Movies - CRUD]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: success
 *                 mensaje:
 *                   type: string
 *                   example: Película agregada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Película duplicada (ID o título ya existe)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/movies', authMiddleware, postController.addMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Actualizar una película existente
 *     tags: [Movies - CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la película a actualizar
 *         example: "tt0111161"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieUpdate'
 *     responses:
 *       200:
 *         description: Película actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: success
 *                 mensaje:
 *                   type: string
 *                   example: Película actualizada correctamente
 *                 pelicula:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     year:
 *                       type: integer
 *                     imdb_rating:
 *                       type: number
 *                     runtime_minutes:
 *                       type: integer
 *       400:
 *         description: Datos inválidos o campos prohibidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Película no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/movies/:id', authMiddleware, putController.putMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Eliminar una película existente
 *     tags: [Movies - CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la película a eliminar
 *         example: "tt0111161"
 *     responses:
 *       200:
 *         description: Película eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: success
 *                 mensaje:
 *                   type: string
 *                   example: Película eliminada correctamente
 *                 pelicula:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "tt0111161"
 *       400:
 *         description: ID no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               estado: error
 *               mensaje: ID de película no proporcionado
 *               tipo: delete
 *       401:
 *         description: Token no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               estado: error
 *               mensaje: No se proporcionó un token de autenticación
 *               tipo: auth
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               estado: error
 *               mensaje: Invalid token
 *               tipo: auth
 *       404:
 *         description: Película no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               estado: error
 *               mensaje: Película no encontrada
 *               tipo: not_found
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/movies/:id', authMiddleware, deleteController.deleteMovie);

module.exports = router;