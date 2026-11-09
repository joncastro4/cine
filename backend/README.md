# API

Express + Prisma + MySQL.

Tablas: `Peliculas`, `Directores`, `Categorias`.

## Rutas

- `GET /api/peliculas` lista todas, con el nombre del director y de la categoría.
- `GET /api/peliculas/:id` regresa una. Si el id no existe, responde 404.
- `POST /api/peliculas` crea una. `PUT /api/peliculas/:id` la edita. `DELETE /api/peliculas/:id` la borra.
- `GET` y `POST` en `/api/directores` y `/api/categorias` sirven para elegirlos o registrar uno nuevo.

## Arranque

```
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

El `.env` necesita `DATABASE_URL` apuntando a `cinema_db`. El ejemplo está en `.env.example`.

`database.sql` es el mismo esquema, por si se crea la base desde Workbench.
