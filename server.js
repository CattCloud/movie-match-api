const http = require('http');
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
});