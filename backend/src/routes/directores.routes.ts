import { Router } from 'express';
import { crearDirector, getDirectores } from '../controllers/directores.controller';

const router = Router();

router.get('/', getDirectores);
router.post('/', crearDirector);

export default router;
