
## 📘 Movie Match API – Laboratorio 10: Servidor Express y API REST

Segunda fase del proyecto Movie Match API, enfocada en construir un servidor Express real, definir rutas RESTful y permitir interacción dinámica vía peticiones HTTP. Esta etapa introduce arquitectura de rutas, separación de responsabilidades y consultas flexibles por parámetros o queries.

---

### 🎯 Objetivos de Aprendizaje

- Comprender y aplicar el concepto de rutas RESTful en Express
- Construir un servidor Express básico con múltiples rutas y controladores
- Separar lógica en funciones modulares reutilizables
- Habilitar interacción completa desde navegador mediante GET dinámico y filtros

---

### 🧠 Conceptos Clave

| Concepto | Descripción |
|----------|-------------|
| **RESTful** | Estilo arquitectónico basado en recursos accesibles por URL + métodos HTTP |
| **Métodos HTTP** | Verbos como `GET`, `POST`, `PUT`, `DELETE` que definen acciones sobre datos |
| **Rutas** | Funciones separadas que gestionan la lógica de cada endpoint en Express |

---

### ⚙️ Setup Inicial

Preparar entorno:

```bash
npm init -y
npm install express
```

Estructura recomendada:

```
movie-match-api/
├── data/              # CSV con películas
├── utils/             # movieUtils.js con lógica modular
├── server.js          # Servidor Express + rutas RESTful
├── package.json
└── node_modules/
```

---

## 🧾 Nuevas Historias de Usuario – Fase RESTful

| Historia | Descripción | Ruta |
|---------|-------------|------|
| **HU1** | Listar todas las películas disponibles | `GET /movies` |
| **HU2** | Ver detalles de una película específica | `GET /movies/:id_or_name` |
| **HU3** | Filtrar películas por género | `GET /movies?genre=comedy` |
| ⭐ Extra | Mensaje de bienvenida | `GET /` |
| ⭐ Extra | Ver estadísticas agrupadas por género | `GET /movies/stats` |

---

### ✅ Checkpoints Técnicos

- `/movies` devuelve JSON con todas las películas.
- `/movies/:id_or_name` permite búsqueda flexible por ID o nombre.
- `/movies?genre=` filtra correctamente o devuelve todo si no hay query.
- `/` muestra mensaje de servidor activo.
- `/movies/stats` resume cantidad de películas por género.

