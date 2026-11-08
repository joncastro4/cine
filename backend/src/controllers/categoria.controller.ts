import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { createCategoriaSchema, updateCategoriaSchema } from '../schemas/categoria.schema';

export const getCategorias = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { identificador: 'asc' },
      include: {
        _count: {
          select: { peliculas: true },
        },
      },
    });

    res.json({
      success: true,
      count: categorias.length,
      data: categorias.map((c) => ({
        Identificador: c.identificador,
        Categoria: c.categoria,
        totalPeliculas: c._count.peliculas,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoriaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Identificador de categoría inválido' });
      return;
    }

    const categoria = await prisma.categoria.findUnique({
      where: { identificador: id },
      include: {
        peliculas: {
          select: {
            identificador: true,
            titulo: true,
            duracion: true,
            imagenUrl: true,
            director: {
              select: {
                idDirector: true,
                director: true,
              },
            },
          },
        },
      },
    });

    if (!categoria) {
      res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      return;
    }

    res.json({
      success: true,
      data: {
        Identificador: categoria.identificador,
        Categoria: categoria.categoria,
        peliculas: categoria.peliculas.map((p) => ({
          Identificador: p.identificador,
          Titulo: p.titulo,
          Duracion: p.duracion,
          ImagenUrl: p.imagenUrl,
          Director: p.director.director,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategoria = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createCategoriaSchema.parse(req.body);

    const nueva = await prisma.categoria.create({
      data: {
        categoria: validated.Categoria,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: {
        Identificador: nueva.identificador,
        Categoria: nueva.categoria,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoria = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Identificador de categoría inválido' });
      return;
    }

    const validated = updateCategoriaSchema.parse(req.body);

    const actualizada = await prisma.categoria.update({
      where: { identificador: id },
      data: {
        categoria: validated.Categoria,
      },
    });

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: {
        Identificador: actualizada.identificador,
        Categoria: actualizada.categoria,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoria = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Identificador de categoría inválido' });
      return;
    }

    await prisma.categoria.delete({
      where: { identificador: id },
    });

    res.json({
      success: true,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

