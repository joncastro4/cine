import { Router } from 'express';
import {
  getDirectores,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
} from '../controllers/director.controller';

const router = Router();

// GET /api/directores - Listar directores
router.get('/', getDirectores);

// GET /api/directores/:id - Detalle de un director
router.get('/:id', getDirectorById);

// POST /api/directores - Crear director
router.post('/', createDirector);

// PUT /api/directores/:id - Actualizar director
router.put('/:id', updateDirector);

// DELETE /api/directores/:id - Eliminar director
router.delete('/:id', deleteDirector);

export default router;

