// scripts/validateSwagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movies API',
      version: '1.0.0',
      description: 'API para gestión de películas con operaciones CRUD'
    }
  },
  apis: ['./routes/*.js']
};

try {
  console.log('Validando documentación Swagger...');
  
  const specs = swaggerJsdoc(swaggerOptions);
  
  // Verificar que se generaron las especificaciones
  if (!specs || Object.keys(specs).length === 0) {
    throw new Error('No se pudieron generar las especificaciones Swagger');
  }

  // Verificar que existen paths
  if (!specs.paths || Object.keys(specs.paths).length === 0) {
    throw new Error('No se encontraron rutas documentadas');
  }

  // Contar endpoints documentados
  const pathCount = Object.keys(specs.paths).length;
  let methodCount = 0;
  
  for (const path of Object.values(specs.paths)) {
    methodCount += Object.keys(path).length;
  }

  console.log('Validación exitosa!');
  console.log(`Estadísticas de documentación:`);
  console.log(`   - Rutas documentadas: ${pathCount}`);
  console.log(`   - Métodos documentados: ${methodCount}`);
  console.log(`   - Esquemas definidos: ${specs.components?.schemas ? Object.keys(specs.components.schemas).length : 0}`);

  // Guardar especificaciones en archivo JSON
  const outputPath = path.join(__dirname, '../docs/swagger.json');
  const docsDir = path.dirname(outputPath);
  
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  console.log(`Especificaciones guardadas en: ${outputPath}`);

} catch (error) {
  console.error('❌ Error en la validación:', error.message);
  process.exit(1);
}