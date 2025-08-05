
## 📘 Movie Match API – Laboratorio 09: Ecosistema Node.js

Proyecto integrador que simula una API REST para encontrar películas desde consola y servidor HTTP usando Node.js.

---

## 🧠 Objetivos Técnicos

- Comprender el entorno de ejecución Node.js vs navegador.
- Modularizar funciones usando CommonJS.
- Leer datos desde archivos CSV.
- Configurar scripts personalizados con `npm`.
- Levantar servidores HTTP básicos con `http.createServer`.

---

## 📂 Estructura del Proyecto

```
movie-match-api/
├── data/
│   └── movies.csv         # Base de datos con películas
├── utils/
│   └── movieUtils.js      # Funciones reutilizables
├── movie.js               # Script principal: búsqueda por título
├── filtermovie.js         # Script alternativo: filtrado por género
├── server.js              # Servidor básico para mostrar película
└── package.json           # Configuración de npm y scripts
```

---

## 🔍 Historias de Usuario + Guía de Comandos

| Historia | Descripción | Comando |
|---------|-------------|--------|
| **HU1** | Buscar película por título desde consola | `node movie.js "Inception"` |
| **HU2** | Modularizar lógica en `movieUtils.js` | *(Interno, ya realizado)* |
| **HU3** | Crear script personalizado con npm | `npm run search -- "Interstellar"` |
| **HU4** | Responder película aleatoria por servidor | `node server.js` → accede a `http://localhost:3000` en navegador |
| ⭐ Opcional | Filtrar películas por género | `npm run filter -- "Drama"` |

---

## 📦 Scripts disponibles (`package.json`)

```json
"scripts": {
  "search": "node movie.js",
  "filter": "node filtermovie.js",
  "start": "node server.js"
}
```

---

## 🧩 Notas Técnicas

- Usa `process.argv[2]` para capturar argumentos en consola.
- El `--` en `npm run` separa el nombre del script y sus argumentos.
- Se centraliza la lógica en `movieUtils.js` para mantener la limpieza y reutilización.


