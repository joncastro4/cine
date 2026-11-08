import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { createDirectorSchema, updateDirectorSchema } from '../schemas/director.schema';

export const getDirectores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const directores = await prisma.director.findMany({
      orderBy: { idDirector: 'asc' },
      include: {
        _count: {
          select: { peliculas: true },
        },
      },
    });

    res.json({
      success: true,
      count: directores.length,
      data: directores.map((d) => ({
        IDDirector: d.idDirector,
        Director: d.director,
        totalPeliculas: d._count.peliculas,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getDirectorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de director inválido' });
      return;
    }

    const director = await prisma.director.findUnique({
      where: { idDirector: id },
      include: {
        peliculas: {
          select: {
            identificador: true,
            titulo: true,
            duracion: true,
            imagenUrl: true,
            categoria: {
              select: {
                identificador: true,
                categoria: true,
              },
            },
          },
        },
      },
    });

    if (!director) {
      res.status(404).json({ success: false, message: 'Director no encontrado' });
      return;
    }

    res.json({
      success: true,
      data: {
        IDDirector: director.idDirector,
        Director: director.director,
        peliculas: director.peliculas.map((p) => ({
          Identificador: p.identificador,
          Titulo: p.titulo,
          Duracion: p.duracion,
          ImagenUrl: p.imagenUrl,
          Categoria: p.categoria.categoria,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createDirectorSchema.parse(req.body);

    const nuevo = await prisma.director.create({
      data: {
        director: validated.Director,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Director creado exitosamente',
      data: {
        IDDirector: nuevo.idDirector,
        Director: nuevo.director,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de director inválido' });
      return;
    }

    const validated = updateDirectorSchema.parse(req.body);

    const actualizado = await prisma.director.update({
      where: { idDirector: id },
      data: {
        director: validated.Director,
      },
    });

    res.json({
      success: true,
      message: 'Director actualizado exitosamente',
      data: {
        IDDirector: actualizado.idDirector,
        Director: actualizado.director,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de director inválido' });
      return;
    }

    await prisma.director.delete({
      where: { idDirector: id },
    });

    res.json({
      success: true,
      message: 'Director eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

