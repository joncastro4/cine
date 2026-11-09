import { Router } from 'express';
import { crearCategoria, getCategorias } from '../controllers/categorias.controller';

const router = Router();

router.get('/', getCategorias);
router.post('/', crearCategoria);

export default router;
