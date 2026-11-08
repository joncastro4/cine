import { Router } from 'express';
import {
  getPeliculas,
  getPeliculaById,
  createPelicula,
  updatePelicula,
  deletePelicula,
} from '../controllers/pelicula.controller';

const router = Router();

// GET /api/peliculas - Obtener todas las películas (con filtros por categoria, director, search)
router.get('/', getPeliculas);

// GET /api/peliculas/:id - Obtener detalle de una película específica
router.get('/:id', getPeliculaById);

// POST /api/peliculas - Crear una nueva película
router.post('/', createPelicula);

// PUT /api/peliculas/:id - Actualizar película
router.put('/:id', updatePelicula);

// DELETE /api/peliculas/:id - Eliminar película
router.delete('/:id', deletePelicula);

export default router;

