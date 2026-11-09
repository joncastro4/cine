# Cinetopia

App de cine para consultar películas. La base está en MySQL, el backend es una API en Express y la app es Expo.

## Qué hace

- La sala muestra todas las películas. Al tocar una, su título pasa a la pantalla.
- El detalle enseña título, director, duración, categoría y sinopsis.

## Cómo correrlo

Hace falta Node 22 o 24 y MySQL encendido.

1. Crea la base. Puedes correr `backend/database.sql` en Workbench, o usar Prisma (paso 2).
2. En `backend`, copia `.env.example` a `.env` y pon tu usuario y contraseña de MySQL.

```
cd backend
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

La API queda en http://localhost:3000/api/peliculas

3. En otra terminal:

```
cd mobile
npm install
npx expo start --web
```

Si la API está apagada, la sala muestra un aviso. Eso no es lo mismo que una cartelera vacía.
