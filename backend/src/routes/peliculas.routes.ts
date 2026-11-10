import { Router } from 'express';
import {
  actualizarPelicula,
  crearPelicula,
  eliminarPelicula,
  getPeliculaPorId,
  getPeliculas,
} from '../controllers/peliculas.controller';

const router = Router();

router.get('/', getPeliculas);
router.post('/', crearPelicula);
router.get('/:id', getPeliculaPorId);
router.put('/:id', actualizarPelicula);
router.delete('/:id', eliminarPelicula);

export default router;
