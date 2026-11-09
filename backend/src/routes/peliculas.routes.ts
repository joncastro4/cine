import { Router } from 'express';
import { getPeliculaPorId, getPeliculas } from '../controllers/peliculas.controller';

const router = Router();

router.get('/', getPeliculas);
router.get('/:id', getPeliculaPorId);

export default router;
