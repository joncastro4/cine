import { Request, Response } from 'express';
import { prisma } from '../db';

export async function getDirectores(_req: Request, res: Response) {
  try {
    const directores = await prisma.director.findMany({
      orderBy: { director: 'asc' },
    });

    res.json(
      directores.map((d) => ({
        IDDirector: d.idDirector,
        Director: d.director,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudieron cargar los directores' });
  }
}

export async function crearDirector(req: Request, res: Response) {
  const nombre = typeof req.body.Director === 'string' ? req.body.Director.trim() : '';

  if (!nombre) {
    res.status(400).json({ mensaje: 'Falta el nombre del director' });
    return;
  }

  try {
    const repetido = await prisma.director.findFirst({
      where: { director: nombre },
    });

    if (repetido) {
      res.status(400).json({ mensaje: 'Ese director ya está registrado' });
      return;
    }

    const nuevo = await prisma.director.create({
      data: { director: nombre },
    });

    res.status(201).json({
      IDDirector: nuevo.idDirector,
      Director: nuevo.director,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudo guardar el director' });
  }
}
