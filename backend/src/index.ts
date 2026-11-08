import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { swaggerDocument } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { prisma } from './config/prisma';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: '*', // Permitir conexiones desde cualquier origen (móvil, web, emuladores)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI - Documentación Interactiva
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'API Películas - Swagger UI',
}));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint para descargar la especificación OpenAPI en JSON (útil para Postman/Insomnia)
app.get('/api/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Ruta raíz con información y enlaces rápidos
app.get('/', (req: Request, res: Response) => {
  res.json({
    nombre: 'API de Películas, Directores y Categorías',
    version: '1.0.0',
    swagger: `http://localhost:${PORT}/api/docs`,
    endpoints: {
      swaggerUI: 'GET /api/docs',
      swaggerJSON: 'GET /api/docs.json',
      peliculas: {
        listar: 'GET /api/peliculas',
        detalle: 'GET /api/peliculas/:id',
        crear: 'POST /api/peliculas',
        actualizar: 'PUT /api/peliculas/:id',
        eliminar: 'DELETE /api/peliculas/:id',
      },
      directores: {
        listar: 'GET /api/directores',
        detalle: 'GET /api/directores/:id',
        crear: 'POST /api/directores',
        actualizar: 'PUT /api/directores/:id',
        eliminar: 'DELETE /api/directores/:id',
      },
      categorias: {
        listar: 'GET /api/categorias',
        detalle: 'GET /api/categorias/:id',
        crear: 'POST /api/categorias',
        actualizar: 'PUT /api/categorias/:id',
        eliminar: 'DELETE /api/categorias/:id',
      },
    },
  });
});

// Rutas principales bajo /api
app.use('/api', routes);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📖 Swagger UI interactivo: http://localhost:${PORT}/api/docs`);
  console.log(`🎬 Películas:  http://localhost:${PORT}/api/peliculas`);
  console.log(`🎥 Directores: http://localhost:${PORT}/api/directores`);
  console.log(`🏷️ Categorías: http://localhost:${PORT}/api/categorias`);
  console.log(`===============================================`);
});

// Manejo de cierre elegante
const shutdown = async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ Servidor y base de datos desconectados.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
