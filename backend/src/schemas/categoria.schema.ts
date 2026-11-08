import { z } from 'zod';

export const createCategoriaSchema = z.object({
  Categoria: z.string().min(1, 'El nombre de la categoría es obligatorio').max(100),
});

export const updateCategoriaSchema = createCategoriaSchema.partial();

