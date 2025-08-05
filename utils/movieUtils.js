const fs = require('fs/promises');
const path = require('path');
const { parse } = require('csv-parse/sync');

async function getMovieByTitle(inputMovie) {
  try {
    const filePath = "./data/movies.csv"; 
    const contenido = await fs.readFile(filePath, 'utf8');

    const registros = parse(contenido, {
      columns: true,          // convierte cada fila en un objeto con claves
      skip_empty_lines: true,
    });

    const pelicula = registros.find(reg =>
      reg.title && reg.title.toLowerCase().includes(inputMovie.toLowerCase())
    );

    if (!pelicula) {
      console.log(`❌ La película "${inputMovie}" no se encontró`);
      return null;
    }

    const ficha = `
    ⭐ ${pelicula.title} (${pelicula.year})
    - Género: ${pelicula.genre}
    - Director: ${pelicula.director}
    - Reparto: ${pelicula.actors}
    - Sinopsis: ${pelicula.plot}
    - Rating: ${pelicula.imdb_rating}
    - Duración: ${pelicula.runtime_minutes} minutos
    `;

    console.log('\n📽️  Película encontrada\n' + ficha);
    return pelicula;

  } catch (error) {
    console.error('Error al leer el archivo CSV:', error);
    throw error;
  }
}

async function getMovieByID_Title(parametro) {
  try {
    const filePath = "./data/movies.csv"; 
    const contenido = await fs.readFile(filePath, 'utf8');

    const registros = parse(contenido, {
      columns: true,          // convierte cada fila en un objeto con claves
      skip_empty_lines: true,
    });

    const pelicula = registros.find(reg =>
      reg.title && (reg.title.toLowerCase().includes(parametro.toLowerCase()) || reg.id.toLowerCase().includes(parametro.toLowerCase()))
    );

    if (!pelicula) {
      console.log(`❌ La película "${parametro}" no se encontró`);
      return null;
    }

    return pelicula;

  } catch (error) {
    console.error('Error al leer el archivo CSV:', error);
    throw new Error("Error al leer el archivo CSV, no se pudieron obtener las películas disponibles");
  }
}




async function getAllMovies() {
    try {
        const filePath = path.join(__dirname, '../data/movies.csv');
        const contenido = await fs.readFile(filePath, 'utf8');
    
        //Arreglo de objetos movie
        const registros = parse(contenido, {
        columns: true,
        skip_empty_lines: true,
        });
        
        return registros;
    } catch (error) {
        console.error('Error al leer el archivo CSV:', error);
        throw new Error("Error al leer el archivo CSV, no se pudieron obtener las películas disponibles");
    }

}

async function getMoviesByGenre(generoMovie) {
    try {
        const filePath = path.join(__dirname, '../data/movies.csv');
        const contenido = await fs.readFile(filePath, 'utf8');  
        const registros = parse(contenido, {
            columns: true,
            skip_empty_lines: true,
        });
        const peliculasFiltradas = registros.filter(reg =>
            reg.genre && reg.genre.toLowerCase().includes(generoMovie.toLowerCase())
        );  
        if (peliculasFiltradas.length === 0) {
            console.log(`❌ No se encontraron películas del género "${generoMovie}"`);
            return ;
        }
        console.log(`\n🎬 Películas del género "${generoMovie}":`);
        peliculasFiltradas.forEach(pelicula => {
            console.log(`- ${pelicula.title} (${pelicula.year})`);
        });
    }catch(error){
        console.error('Error al leer el archivo CSV:', error);
        throw error;        
    }   

}

async function getGenreCounts() {
    try {
        const filePath = path.join(__dirname, '../data/movies.csv');
        const contenido = await fs.readFile(filePath, 'utf8');
    
        //Arreglo de objetos movie
        const registros = parse(contenido, {
        columns: true,
        skip_empty_lines: true,
        });
        const genreCounts = {};
        registros.forEach(pelicula=>{
          const generos=pelicula.genre.split(", ");
          generos.forEach(genero=>{
            //Si el genero ya esta registrado en el objeto genreCounts
            if(genreCounts[genero]){
              genreCounts[genero]+=1;
            }else{
              genreCounts[genero]=1;
            }
          })
        })
        return genreCounts;
      }
    catch (error) {
        console.error('Error al leer el archivo CSV:', error);          
    }   
}



module.exports = { getMovieByTitle,getAllMovies,getMoviesByGenre ,getMovieByID_Title,getGenreCounts};