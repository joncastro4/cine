import { z } from 'zod';

export const createDirectorSchema = z.object({
  Director: z.string().min(1, 'El nombre del director es obligatorio').max(255),
});

export const updateDirectorSchema = createDirectorSchema.partial();

