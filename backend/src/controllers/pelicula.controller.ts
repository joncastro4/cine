import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { createPeliculaSchema, updatePeliculaSchema } from '../schemas/pelicula.schema';

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}m`;
};

export const getPeliculas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoria, director, search } = req.query;

    const whereClause: any = {};

    if (categoria) {
      const catId = parseInt(categoria as string, 10);
      if (!isNaN(catId)) {
        whereClause.idCategoria = catId;
      }
    }

    if (director) {
      const dirId = parseInt(director as string, 10);
      if (!isNaN(dirId)) {
        whereClause.idDirector = dirId;
      }
    }

    if (search) {
      whereClause.titulo = {
        contains: String(search),
      };
    }

    const peliculas = await prisma.pelicula.findMany({
      where: whereClause,
      include: {
        director: {
          select: {
            idDirector: true,
            director: true,
          },
        },
        categoria: {
          select: {
            identificador: true,
            categoria: true,
          },
        },
      },
      orderBy: { identificador: 'asc' },
    });

    const data = peliculas.map((p) => ({
      Identificador: p.identificador,
      Titulo: p.titulo,
      IDDirector: p.idDirector,
      Director: p.director.director,
      Duracion: p.duracion,
      DuracionFormateada: formatDuration(p.duracion),
      IDCategoria: p.idCategoria,
      Categoria: p.categoria.categoria,
      Sinopsis: p.sinopsis,
      ImagenUrl: p.imagenUrl,
    }));

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPeliculaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Identificador de película inválido' });
      return;
    }

    const pelicula = await prisma.pelicula.findUnique({
      where: { identificador: id },
      include: {
        director: true,
        categoria: true,
      },
    });

    if (!pelicula) {
      res.status(404).json({ success: false, message: 'Película no encontrada' });
      return;
    }

    res.json({
      success: true,
      data: {
        Identificador: pelicula.identificador,
        Titulo: pelicula.titulo,
        IDDirector: pelicula.idDirector,
        Director: pelicula.director.director,
        Duracion: pelicula.duracion,
        DuracionFormateada: formatDuration(pelicula.duracion),
        IDCategoria: pelicula.idCategoria,
        Categoria: pelicula.categoria.categoria,
        Sinopsis: pelicula.sinopsis,
        ImagenUrl: pelicula.imagenUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPelicula = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createPeliculaSchema.parse(req.body);

    // Validar existencia de Director y Categoria
    const [directorExists, categoriaExists] = await Promise.all([
      prisma.director.findUnique({ where: { idDirector: validated.IDDirector } }),
      prisma.categoria.findUnique({ where: { identificador: validated.IDCategoria } }),
    ]);

    if (!directorExists) {
      res.status(404).json({
        success: false,
        message: `El director con ID ${validated.IDDirector} no existe`,
      });
      return;
    }

    if (!categoriaExists) {
      res.status(404).json({
        success: false,
        message: `La categoría con ID ${validated.IDCategoria} no existe`,
      });
      return;
    }

    const nueva = await prisma.pelicula.create({
      data: {
        titulo: validated.Titulo,
        idDirector: validated.IDDirector,
        duracion: validated.Duracion,
        idCategoria: validated.IDCategoria,
        sinopsis: validated.Sinopsis,
        imagenUrl: validated.ImagenUrl || null,
      },
      include: {
        director: true,
        categoria: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Película creada exitosamente',
      data: {
        Identificador: nueva.identificador,
        Titulo: nueva.titulo,
        IDDirector: nueva.idDirector,
        Director: nueva.director.director,
        Duracion: nueva.duracion,
        DuracionFormateada: formatDuration(nueva.duracion),
        IDCategoria: nueva.idCategoria,
        Categoria: nueva.categoria.categoria,
        Sinopsis: nueva.sinopsis,
        ImagenUrl: nueva.imagenUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePelicula = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Identificador de película inválido' });
      return;
    }

    const validated = updatePeliculaSchema.parse(req.body);

    if (validated.IDDirector) {
      const directorExists = await prisma.director.findUnique({
        where: { idDirector: validated.IDDirector },
      });
      if (!directorExists) {
        res.status(404).json({
          success: false,
          message: `El director con ID ${validated.IDDirector} no existe`,
        });
        return;
      }
    }

    if (validated.IDCategoria) {
      const categoriaExists = await prisma.categoria.findUnique({
        where: { identificador: validated.IDCategoria },
      });
      if (!categoriaExists) {
        res.status(404).json({
          success: false,
          message: `La categoría con ID ${validated.IDCategoria} no existe`,
        });
        return;
      }
    }

    const actualizada = await prisma.pelicula.update({
      where: { identificador: id },
      data: {
        ...(validated.Titulo && { titulo: validated.Titulo }),
        ...(validated.IDDirector && { idDirector: validated.IDDirector }),
        ...(validated.Duracion && { duracion: validated.Duracion }),
        ...(validated.IDCategoria && { idCategoria: validated.IDCategoria }),
        ...(validated.Sinopsis && { sinopsis: validated.Sinopsis }),
        ...(validated.ImagenUrl !== undefined && { imagenUrl: validated.ImagenUrl }),
      },
      include: {
        director: true,
        categoria: true,
      },
    });

    res.json({
      success: true,
      message: 'Película actualizada exitosamente',
      data: {
        Identificador: actualizada.identificador,
        Titulo: actualizada.titulo,
        IDDirector: actualizada.idDirector,
        Director: actualizada.director.director,
        Duracion: actualizada.duracion,
        DuracionFormateada: formatDuration(actualizada.duracion),
        IDCategoria: actualizada.idCategoria,
        Categoria: actualizada.categoria.categoria,
        Sinopsis: actualizada.sinopsis,
        ImagenUrl: actualizada.imagenUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePelicula = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Identificador de película inválido' });
      return;
    }

    await prisma.pelicula.delete({
      where: { identificador: id },
    });

    res.json({
      success: true,
      message: 'Película eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

