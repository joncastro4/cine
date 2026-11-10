import { Request, Response } from 'express';
import { prisma } from '../db';

export async function getCategorias(_req: Request, res: Response) {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { categoria: 'asc' },
    });

    res.json(
      categorias.map((c) => ({
        Identificador: c.identificador,
        Categoria: c.categoria,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudieron cargar las categorías' });
  }
}

export async function crearCategoria(req: Request, res: Response) {
  const nombre = typeof req.body.Categoria === 'string' ? req.body.Categoria.trim() : '';

  if (!nombre) {
    res.status(400).json({ mensaje: 'Falta el nombre de la categoría' });
    return;
  }

  try {
    const repetida = await prisma.categoria.findFirst({
      where: { categoria: nombre },
    });

    if (repetida) {
      res.status(400).json({ mensaje: 'Esa categoría ya está registrada' });
      return;
    }

    const nueva = await prisma.categoria.create({
      data: { categoria: nombre },
    });

    res.status(201).json({
      Identificador: nueva.identificador,
      Categoria: nueva.categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudo guardar la categoría' });
  }
}
