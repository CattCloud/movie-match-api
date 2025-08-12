
## 📘 Movie Match API – Servidor Express y API REST

Proyecto Movie Match API, enfocada en construir un servidor Express real, definir rutas RESTful y permitir interacción dinámica vía peticiones HTTP. 
--- 
### ⚙️ Setup Inicial

Preparar entorno:

```bash
# 1. Clona el repositorio
git clone https://github.com/CattCloud/movie-match-api.git
cd movie-match-api

# 2. Instala las dependencias
npm install

# 3. Coloco en el archivo .env tus variables de entorno
# Ejemplo:
echo "PORT=3000" > .env

# 4. Ejecuta en modo desarrollo con reinicio automático
npm run dev

# 5. (Opcional) Valida la documentación Swagger
npm run validate-swagger
```


Estructura de carpetas:

```
MOVIE-MATCH-API/
├── controllers/         # Lógica por método HTTP
│   ├── deleteController.js
│   ├── getControllers.js
│   ├── postController.js
│   └── putController.js
├── data/                # Fuente CSV de películas
│   └── movies.csv
├── docs/                # Swagger UI y documentación
│   └── swagger.json
│   └── index.html       # Visualizador Swagger (GitHub Pages)
├── middleware/          # CORS, auth, logger, error handler
│   ├── authMiddleware.js
│   ├── cors.js
│   ├── errorHandler.js
│   └── logger.js
├── models/              # Modelo de película
│   └── movieModel.js
├── routes/              # Rutas Express
│   └── rutasGet.js
├── services/            # Lógica de negocio
│   └── movieServices.js
├── utils/               # Utilidades y errores personalizados
│   └── AppError.js
├── .env                 # Variables de entorno
├── .gitignore
├── index.js             # Punto de entrada del servidor
├── package-lock.json
├── package.json
└── README.md
└── validateSwagger.js 
```
