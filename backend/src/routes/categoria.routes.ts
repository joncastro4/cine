import { Router } from 'express';
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../controllers/categoria.controller';

const router = Router();

// GET /api/categorias - Listar categorías
router.get('/', getCategorias);

// GET /api/categorias/:id - Detalle de categoría
router.get('/:id', getCategoriaById);

// POST /api/categorias - Crear categoría
router.post('/', createCategoria);

// PUT /api/categorias/:id - Actualizar categoría
router.put('/:id', updateCategoria);

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', deleteCategoria);

export default router;

