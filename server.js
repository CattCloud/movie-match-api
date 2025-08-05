// 1. Importar Express
const express = require('express');

// 2. Crear instancia de la aplicación
const app = express();

// 3. Configurar middlewares básicos (recomendado)
app.use(express.json());

// 4. Definir rutas
app.get('/', (req, res) => {
  res.send('¡Bienvenido a Movie Match!');
});


app.get('/movies', async (req, res) => {
  const { getAllMovies,getMoviesByGenre } = require('./utils/movieUtils');   
  try{
    let movies;
    if(req.query.genre){
      movies = await getMoviesByGenre(req.query.genre);
    }else{
      movies = await getAllMovies();
    }
    res.status(200).json(movies);
  }catch(e){
    res.status(404).json({error:e.message});
  }
});




app.get('/movies/stats', async (req, res) => {
    const { getGenreCounts } = require('./utils/movieUtils');   
    try {
        const genreCounts = await getGenreCounts();
        res.status(200).json(genreCounts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas de géneros' });
    }
})

app.get("/movies/:id_nombre",async(req,res)=>{
  const { getMovieByID_Title } = require('./utils/movieUtils');   
  try{
    const pelicula=await getMovieByID_Title(req.params.id_nombre);
    if(pelicula){
      res.status(200).json(pelicula);
    }else{
      res.status(404).json({error:"No se encontró la película"});
    }
  }catch(e){
    res.status(404).json({error:e.message});
  }

});


// 5. Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});



/*const http = require('http');
const { getAllMovies } = require('./utils/movieUtils');


function getRandomItem(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

const server = http.createServer(async (req, res) => {
  try {
    const peliculas = await getAllMovies();
    const seleccionada = getRandomItem(peliculas);

    // Preparar respuesta como JSON
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(seleccionada));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error al obtener película: ' + error.message);
  }
});

server.listen(3000, () => {
  console.log('🎬 Servidor Movie Match activo en http://localhost:3000');
});*/