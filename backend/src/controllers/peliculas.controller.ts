import { Request, Response } from 'express';
import { prisma } from '../db';

function armarPelicula(p: {
  identificador: number;
  titulo: string;
  idDirector: number;
  duracion: number;
  idCategoria: number;
  sinopsis: string;
  director: { director: string };
  categoria: { categoria: string };
}) {
  return {
    Identificador: p.identificador,
    Titulo: p.titulo,
    IDDirector: p.idDirector,
    Director: p.director.director,
    Duracion: p.duracion,
    IDCategoria: p.idCategoria,
    Categoria: p.categoria.categoria,
    Sinopsis: p.sinopsis,
  };
}

const incluir = {
  director: true,
  categoria: true,
};

export async function getPeliculas(_req: Request, res: Response) {
  try {
    const peliculas = await prisma.pelicula.findMany({
      include: incluir,
      orderBy: { identificador: 'asc' },
    });

    res.json(peliculas.map(armarPelicula));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudieron cargar las películas' });
  }
}

export async function getPeliculaPorId(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ mensaje: 'El id no es válido' });
    return;
  }

  try {
    const pelicula = await prisma.pelicula.findUnique({
      where: { identificador: id },
      include: incluir,
    });

    if (!pelicula) {
      res.status(404).json({ mensaje: 'No se encontró la película' });
      return;
    }

    res.json(armarPelicula(pelicula));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar la película' });
  }
}
