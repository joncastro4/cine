# 🎬 API de Películas, Directores y Categorías

API REST robusta y tipada en TypeScript construida con **Express.js**, **Prisma ORM** y **MySQL** para la gestión de las tablas `Peliculas`, `Directores` y `Categorias`.

---

## 🗄️ Modelo de Base de Datos (MySQL)

Cumple estrictamente con las 3 tablas y campos solicitados:

1. **Tabla `Películas`**
   - `Identificador`: Clave primaria autoincremental
   - `Titulo`: Título de la película (VARCHAR 255)
   - `IDDirector`: Clave foránea referenciando a `Directores`
   - `Duracion`: Duración en minutos (INT)
   - `IDCategoria`: Clave foránea referenciando a `Categorias`
   - `Sinopsis`: Sinopsis o descripción (TEXT)
   - `ImagenUrl`: URL del póster (VARCHAR 500, opcional)

2. **Tabla `Directores`**
   - `IDDirector`: Clave primaria autoincremental
   - `Director`: Nombre del director (VARCHAR 255)

3. **Tabla `Categorías`**
   - `Identificador`: Clave primaria autoincremental
   - `Categoria`: Nombre de la categoría (VARCHAR 100)

---

## 🚀 Inicio Rápido

1. **Configura el archivo `.env`:**
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="mysql://root:12341234@localhost:3306/cinema_db"
   ```

2. **Crea las tablas y carga datos de prueba:**
   ```bash
   npm run prisma:push
   npm run seed
   ```

3. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

---

## 📖 Documentación Interactiva (Swagger)

Abre en tu navegador:
* **Swagger UI:** `http://localhost:3000/api/docs`
* **Especificación OpenAPI (JSON):** `http://localhost:3000/api/docs.json`

---

## 📡 Catálogo de Rutas CRUD

### 🎥 1. Películas (`/api/peliculas`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/peliculas` | Listar todas las películas (filtros opcionales `?categoria=`, `?director=`, `?search=`) |
| `GET` | `/api/peliculas/:id` | Obtener detalle de una película |
| `POST` | `/api/peliculas` | Crear una película |
| `PUT` | `/api/peliculas/:id` | Actualizar datos de una película |
| `DELETE` | `/api/peliculas/:id` | Eliminar una película |

#### Ejemplo POST `/api/peliculas`
```json
{
  "Titulo": "Inception",
  "IDDirector": 1,
  "Duracion": 148,
  "IDCategoria": 1,
  "Sinopsis": "Un ladrón con la habilidad de entrar en los sueños de los demás recibe una última misión.",
  "ImagenUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1"
}
```

---

### 🎬 2. Directores (`/api/directores`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/directores` | Listar directores y total de películas asociadas |
| `GET` | `/api/directores/:id` | Detalle del director con sus películas |
| `POST` | `/api/directores` | Registrar nuevo director (`{"Director": "Christopher Nolan"}`) |
| `PUT` | `/api/directores/:id` | Actualizar nombre del director |
| `DELETE` | `/api/directores/:id` | Eliminar director |

---

### 🏷️ 3. Categorías (`/api/categorias`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/categorias` | Listar categorías y total de películas asociadas |
| `GET` | `/api/categorias/:id` | Detalle de categoría con sus películas |
| `POST` | `/api/categorias` | Crear categoría (`{"Categoria": "Ciencia Ficción"}`) |
| `PUT` | `/api/categorias/:id` | Actualizar categoría |
| `DELETE` | `/api/categorias/:id` | Eliminar categoría |

---

## 🛠️ Scripts Disponibles

* `npm run dev`: Inicia el servidor con recarga en caliente (`tsx`).
* `npm run build`: Compila TypeScript a JavaScript (`dist/`).
* `npm start`: Inicia el servidor en producción desde `dist/index.js`.
* `npm run prisma:generate`: Regenera el cliente de Prisma.
* `npm run prisma:push`: Sincroniza el esquema con MySQL.
* `npm run prisma:studio`: Abre la interfaz visual de Prisma en el navegador.
* `npm run seed`: Inserta datos iniciales de prueba.
