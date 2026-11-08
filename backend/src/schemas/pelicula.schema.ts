import { z } from 'zod';

export const createPeliculaSchema = z.object({
  Titulo: z.string().min(1, 'El título es obligatorio').max(255),
  IDDirector: z.number({ invalid_type_error: 'IDDirector debe ser un número entero' }).int().positive(),
  Duracion: z.number({ invalid_type_error: 'Duración debe ser un número entero de minutos' }).int().positive(),
  IDCategoria: z.number({ invalid_type_error: 'IDCategoria debe ser un número entero' }).int().positive(),
  Sinopsis: z.string().min(1, 'La sinopsis es obligatoria'),
  ImagenUrl: z.string().url('Debe ser una URL válida').optional().nullable(),
});

export const updatePeliculaSchema = createPeliculaSchema.partial();
