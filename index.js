// 1. Importar Express
const express = require('express');

// 2. Crear instancia de la aplicación
const app = express();

// 3. Importar rutas
const rutasGet = require('./routes/rutasGet');

// 3.1 Configurar rutas   
app.use('/', rutasGet);


// 4. Configurar middlewares básicos (recomendado)
app.use(express.json());



// 5. Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

