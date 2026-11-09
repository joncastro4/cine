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

function leerDatos(body: {
  Titulo?: unknown;
  Sinopsis?: unknown;
  Duracion?: unknown;
  IDDirector?: unknown;
  IDCategoria?: unknown;
}) {
  if (!body || typeof body !== 'object') return { error: 'Faltan los datos' };

  const titulo = typeof body.Titulo === 'string' ? body.Titulo.trim() : '';
  const sinopsis = typeof body.Sinopsis === 'string' ? body.Sinopsis.trim() : '';
  const duracion = Number(body.Duracion);
  const idDirector = Number(body.IDDirector);
  const idCategoria = Number(body.IDCategoria);

  if (!titulo) return { error: 'Falta el título' };
  if (!sinopsis) return { error: 'Falta la sinopsis' };
  if (!Number.isInteger(duracion) || duracion <= 0) {
    return { error: 'La duración tiene que ser un número de minutos' };
  }
  if (!Number.isInteger(idDirector)) return { error: 'Elige un director' };
  if (!Number.isInteger(idCategoria)) return { error: 'Elige una categoría' };

  return { titulo, sinopsis, duracion, idDirector, idCategoria };
}

async function existenRelaciones(idDirector: number, idCategoria: number) {
  const director = await prisma.director.findUnique({ where: { idDirector } });
  if (!director) return 'Ese director no existe';

  const categoria = await prisma.categoria.findUnique({ where: { identificador: idCategoria } });
  if (!categoria) return 'Esa categoría no existe';

  return null;
}

export async function crearPelicula(req: Request, res: Response) {
  const datos = leerDatos(req.body);
  if ('error' in datos) {
    res.status(400).json({ mensaje: datos.error });
    return;
  }

  try {
    const relacion = await existenRelaciones(datos.idDirector, datos.idCategoria);
    if (relacion) {
      res.status(400).json({ mensaje: relacion });
      return;
    }

    const nueva = await prisma.pelicula.create({
      data: {
        titulo: datos.titulo,
        sinopsis: datos.sinopsis,
        duracion: datos.duracion,
        idDirector: datos.idDirector,
        idCategoria: datos.idCategoria,
      },
      include: incluir,
    });

    res.status(201).json(armarPelicula(nueva));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudo guardar la película' });
  }
}

export async function actualizarPelicula(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ mensaje: 'El id no es válido' });
    return;
  }

  const datos = leerDatos(req.body);
  if ('error' in datos) {
    res.status(400).json({ mensaje: datos.error });
    return;
  }

  try {
    const relacion = await existenRelaciones(datos.idDirector, datos.idCategoria);
    if (relacion) {
      res.status(400).json({ mensaje: relacion });
      return;
    }

    const actualizada = await prisma.pelicula.update({
      where: { identificador: id },
      data: {
        titulo: datos.titulo,
        sinopsis: datos.sinopsis,
        duracion: datos.duracion,
        idDirector: datos.idDirector,
        idCategoria: datos.idCategoria,
      },
      include: incluir,
    });

    res.json(armarPelicula(actualizada));
  } catch (error) {
    const codigo = (error as { code?: string }).code;
    if (codigo === 'P2025') {
      res.status(404).json({ mensaje: 'No se encontró la película' });
      return;
    }
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudo actualizar la película' });
  }
}

export async function eliminarPelicula(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ mensaje: 'El id no es válido' });
    return;
  }

  try {
    await prisma.pelicula.delete({ where: { identificador: id } });
    res.json({ mensaje: 'Película eliminada' });
  } catch (error) {
    const codigo = (error as { code?: string }).code;
    if (codigo === 'P2025') {
      res.status(404).json({ mensaje: 'No se encontró la película' });
      return;
    }
    console.error(error);
    res.status(500).json({ mensaje: 'No se pudo eliminar la película' });
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
