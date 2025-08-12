const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { errorHandler } = require('./middleware/errorHandler'); // Ajusta la ruta según tu estructura
require('dotenv').config();
const isDev = process.env.NODE_ENV !== 'production';//Diferenciar entornos
 
const app = express();

// Middlewares básicos
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movies API',
      version: '1.0.0',
      description: 'API para gestión de películas con operaciones CRUD',
      contact: {
        name: 'Erick Verde'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token en el formato: 1234'
        }
      },
      schemas: {
        Movie: {
          type: 'object',
          required: ['id', 'title', 'year', 'genre', 'director', 'actors', 'plot', 'imdb_rating', 'runtime_minutes'],
          properties: {
            id: {
              type: 'string',
              pattern: '^tt\\d+$',
              description: 'ID único de IMDb (formato: ttXXXXXXX)',
              example: 'tt0111161'
            },
            title: {
              type: 'string',
              description: 'Título de la película',
              example: 'The Shawshank Redemption'
            },
            year: {
              type: 'integer',
              minimum: 1900,
              maximum: 2024,
              description: 'Año de lanzamiento',
              example: 1994
            },
            genre: {
              type: 'string',
              description: 'Géneros separados por comas',
              example: 'Drama, Crime'
            },
            director: {
              type: 'string',
              description: 'Director de la película',
              example: 'Frank Darabont'
            },
            actors: {
              type: 'string',
              description: 'Actores principales separados por comas',
              example: 'Tim Robbins, Morgan Freeman'
            },
            plot: {
              type: 'string',
              description: 'Sinopsis de la película',
              example: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
            },
            imdb_rating: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              description: 'Calificación de IMDb',
              example: 9.3
            },
            runtime_minutes: {
              type: 'integer',
              minimum: 1,
              description: 'Duración en minutos',
              example: 142
            }
          }
        },
        MovieUpdate: {
          type: 'object',
          properties: {
            year: {
              type: 'integer',
              minimum: 1900,
              maximum: 2024,
              description: 'Año de lanzamiento',
              example: 1994
            },
            imdb_rating: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              description: 'Calificación de IMDb',
              example: 9.3
            },
            runtime_minutes: {
              type: 'integer',
              minimum: 1,
              description: 'Duración en minutos',
              example: 142
            }
          },
          additionalProperties: false
        },
        Error: {
          type: 'object',
          properties: {
            estado: {
              type: 'string',
              example: 'error'
            },
            mensaje: {
              type: 'string',
              example: 'Descripción del error'
            },
            tipo: {
              type: 'string',
              example: 'validation'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            estado: {
              type: 'string',
              example: 'success'
            },
            mensaje: {
              type: 'string',
              example: 'Operación exitosa'
            },
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Movie' },
                { type: 'array', items: { $ref: '#/components/schemas/Movie' } },
                { type: 'object' }
              ]
            }
          }
        },
        GenreStats: {
          type: 'object',
          additionalProperties: {
            type: 'integer'
          },
          example: {
            "Drama": 150,
            "Comedy": 120,
            "Action": 95,
            "Thriller": 80
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Escanea archivos en la carpeta routes
};

const specs = swaggerJsdoc(swaggerOptions);

// Configuración personalizada de Swagger UI
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Movies API Documentation",
  customfavIcon: "/assets/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
};

// Ruta de documentación , solo en desarrollo
//if (isDev) {
//  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
//}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));



// Rutas principales
const routes = require('./routes/rutasGet'); // Ajusta según tu estructura
app.use('/', routes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Puerto de servidor
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/docs`);
});

module.exports = app;



/*
const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc(swaggerOptions);
fs.writeFileSync('./docs/swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ swagger.json generado en /docs');
*/