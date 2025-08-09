const fs = require("fs/promises");
const path = require("path");
const { parse } = require("csv-parse/sync");

//Retorna arreglo de objetos con las películas
// Cada objeto tiene las propiedades: id,title,year,genre,director,actors,plot,imdb_rating,runtime_minutes

async function readMoviesCSV() {
  const filePath = path.join(__dirname, "../data/movies.csv");
  const contenido = await fs.readFile(filePath, "utf8");
  return parse(contenido, {
    columns: true,
    skip_empty_lines: true,
  });
}

module.exports = { readMoviesCSV };