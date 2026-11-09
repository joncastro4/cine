export type Pelicula = {
  Identificador: number;
  Titulo: string;
  IDDirector: number;
  Director: string;
  Duracion: number;
  IDCategoria: number;
  Categoria: string;
  Sinopsis: string;
};

export type Director = {
  IDDirector: number;
  Director: string;
};

export type Categoria = {
  Identificador: number;
  Categoria: string;
};

export type PeliculaInput = {
  Titulo: string;
  IDDirector: number;
  Duracion: number;
  IDCategoria: number;
  Sinopsis: string;
};
