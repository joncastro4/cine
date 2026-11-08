# 🍿 Cinetopia — Sistema Integral de Cines y Películas

Proyecto compuesto por dos aplicaciones conectadas:

1. **`backend/`**: API REST en **Express.js**, **TypeScript** y **Prisma ORM** sobre **MySQL**, con documentación interactiva en **Swagger**.
2. **`mobile/`**: App móvil y web en **Expo (React Native)** con **Tailwind CSS**. Incluye cartelera con paginado, detalle de película, simulación de salas de cine (una sala distinta por película) y pestañas para agregar y eliminar películas, directores y categorías.

---

## 📁 Estructura

```text
├── backend/                 # API REST (Express + Prisma + MySQL)
│   ├── prisma/schema.prisma # Modelos: Películas, Directores, Categorías
│   ├── src/
│   │   ├── config/          # Prisma y Swagger
│   │   ├── controllers/     # CRUD de películas, directores y categorías
│   │   ├── middlewares/     # Manejo de errores
│   │   ├── prisma/seed.ts   # Datos iniciales (14 películas con póster)
│   │   ├── routes/          # Rutas REST
│   │   ├── schemas/         # Validaciones con Zod
│   │   └── index.ts         # Servidor Express
│   └── database.sql         # Script SQL alternativo con datos iniciales
│
└── mobile/                  # App Expo + Tailwind
    ├── src/
    │   ├── components/      # Header, barra inferior, MovieCard
    │   ├── screens/         # Cartelera, Detalle, Simulación, Películas, Directores, Categorías
    │   ├── services/        # Cliente HTTP de la API
    │   └── types/           # Interfaces TypeScript
    └── App.tsx
```

---

## ✅ Requisitos

| Herramienta | Versión |
|---|---|
| **Node.js** | **22.13+ o 24.3+** (⚠️ Node 25 **no** es compatible con Expo 58) |
| **MySQL** | 8.x (local o en Docker) |
| **npm** | el que trae Node |

Con `nvm`: `nvm install 24 && nvm use 24`.

---

## 🚀 Cómo correr el proyecto

### 1. Clonar

```bash
git clone git@github.com:joncastro4/cine.git
cd cine
```

### 2. Base de datos MySQL

Necesitas un servidor MySQL con un usuario `root`. Si no tienes uno, levántalo con Docker (usa la contraseña que pongas en el `.env` del paso 3):

```bash
docker run -d --name cinetopia-mysql \
  -e MYSQL_ROOT_PASSWORD=12341234 \
  -e MYSQL_DATABASE=cinema_db \
  -p 3306:3306 mysql:8
```

Prisma crea las tablas por ti; la base `cinema_db` se crea sola si el usuario tiene permisos.

### 3. Backend (Terminal 1)

```bash
cd backend
npm install
```

Crea el archivo `backend/.env` (no se sube al repositorio) con tu usuario y contraseña de MySQL:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:12341234@localhost:3306/cinema_db"
```

Luego:

```bash
npm run prisma:generate   # Genera el cliente de Prisma
npm run prisma:push       # Crea las tablas en MySQL
npm run seed              # Carga directores, categorías y 14 películas con póster
npm run dev               # API en http://localhost:3000
```

- **Swagger UI:** http://localhost:3000/api/docs
- Puedes repetir `npm run seed` cuando quieras: no duplica películas y actualiza sus pósters.

### 4. App móvil / web (Terminal 2)

```bash
cd mobile
npm install
npx expo start --web      # Abre la app en el navegador
```

Para correrla en un teléfono, usa `npx expo start` y escanea el QR con **Expo Go**.

> Si el servidor de Expo se queda "colgado" al iniciar, ejecútalo con la entrada cerrada: `npx expo start --web </dev/null`.

---

## 🔌 Conexión de la app con el API

La app busca el API en `http://localhost:3000` (en el emulador de Android usa `http://10.0.2.2:3000`). Si el API no responde, muestra datos de ejemplo de respaldo.

Si pruebas desde un **teléfono real** en la misma red Wi-Fi, `localhost` apunta al teléfono y no a tu computadora. En ese caso cambia `DEFAULT_URL` en `mobile/src/services/api.ts` por la IP de tu computadora, por ejemplo `http://192.168.1.50:3000`.

---

## 🧪 Verificación rápida

```bash
curl http://localhost:3000/api/peliculas   # Debe devolver 14 películas
cd mobile && npx tsc --noEmit              # Revisión de tipos de la app
```

## 🛠️ Problemas frecuentes

- **`Cannot find module 'babel-preset-expo'`**: ejecuta `npm install` dentro de `mobile/` (ya está como dependencia).
- **Error de conexión de Prisma**: revisa que MySQL esté corriendo y que usuario, contraseña y puerto del `DATABASE_URL` sean correctos.
- **Las imágenes no cargan**: los pósters se piden a `upload.wikimedia.org`, así que necesitas internet.
