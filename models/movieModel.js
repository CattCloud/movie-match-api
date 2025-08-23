const fs = require("fs/promises");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { AppError } = require("../utils/AppError");


//Retorna arreglo de objetos con las películas
// Cada objeto tiene las propiedades: id,title,year,genre,director,actors,plot,imdb_rating,runtime_minutes
async function readMoviesCSV() {
  try {
    const filePath = path.join(__dirname, "../data/movies.csv");
    const contenido = await fs.readFile(filePath, "utf8");

    const movies = parse(contenido, {
      columns: true,
      skip_empty_lines: true,
    });

    if (!Array.isArray(movies) || movies.length === 0) {
      throw new AppError("El archivo CSV está vacío o mal formateado", 400, "csv");
    }
    //console.log(movies)

    return movies;
  } catch (err) {
    throw new AppError("Error al leer el archivo CSV", 500, "csv");
  }
}

// Agrega una película al final del archivo CSV
async function writeMovieToCSV(movie) {
  const filePath = path.join(__dirname, "../data/movies.csv");

  const header = "id,title,year,genre,director,actors,plot,imdb_rating,runtime_minutes\n";
  const line = `"${movie.id}","${movie.title}",${movie.year},"${movie.genre}","${movie.director}","${movie.actors}","${movie.plot}",${movie.imdb_rating},${movie.runtime_minutes}\n`;

  const contenido = await fs.readFile(filePath, "utf8");

  if (!contenido.startsWith("id,")) {
    await fs.writeFile(filePath, header + line, "utf8");
  } else {
    if (!contenido.endsWith('\n')) {
      await fs.appendFile(filePath, '\n', 'utf8');
    }
    await fs.appendFile(filePath, line, "utf8");
  }
}
//Recibe un arreglo de objetos y escribe todas las películas en el CSV
async function writeAllMoviesToCSV(movies) {
  const filePath = path.join(__dirname, "../data/movies.csv");

  const headers = [
    "id",
    "title",
    "year",
    "genre",
    "director",
    "actors",
    "plot",
    "imdb_rating",
    "runtime_minutes"
  ];

  const headerLine = headers.join(","); // cabecera CSV

  const lines = movies.map(movie =>
    `"${movie.id}","${movie.title}",${movie.year},"${movie.genre}","${movie.director}","${movie.actors}","${movie.plot}",${movie.imdb_rating},${movie.runtime_minutes}`
  );

  const csvContent = [headerLine, ...lines].join("\n") + "\n";

  await fs.writeFile(filePath, csvContent, "utf8");
}

async function deleteMovieCSV(movies) {
  try {
    const filePath = path.join(__dirname, "../data/movies.csv");
    await fs.writeFile(filePath, "", "utf8"); // Limpia el archivo CSV
    await writeAllMoviesToCSV(movies); // Escribe las películas restantes
  } catch (err) {
    throw new AppError("Error al eliminar la película del CSV", 500, "csv");
  }
}


module.exports = { readMoviesCSV, writeMovieToCSV, writeAllMoviesToCSV, deleteMovieCSV };