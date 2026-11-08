import { Router } from 'express';
import peliculasRouter from './pelicula.routes';
import directoresRouter from './director.routes';
import categoriasRouter from './categoria.routes';

const router = Router();

router.use('/peliculas', peliculasRouter);
router.use('/directores', directoresRouter);
router.use('/categorias', categoriasRouter);

export default router;

