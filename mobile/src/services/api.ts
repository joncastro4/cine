import { Platform } from 'react-native';
import { Pelicula, Director, Categoria } from '../types';

// En Android Emulator localhost es 10.0.2.2; en Web y iOS Simulator es localhost
const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

let currentApiUrl = DEFAULT_URL;

export const setApiUrl = (url: string) => {
  currentApiUrl = url.replace(/\/$/, '');
};

export const getApiUrl = () => currentApiUrl;

// Datos de respaldo en caso de que MySQL aún no esté encendido
const MOCK_DIRECTORES: Director[] = [
  { IDDirector: 1, Director: 'Christopher Nolan', totalPeliculas: 2 },
  { IDDirector: 2, Director: 'Denis Villeneuve', totalPeliculas: 1 },
  { IDDirector: 3, Director: 'Hayao Miyazaki', totalPeliculas: 1 },
  { IDDirector: 4, Director: 'Quentin Tarantino', totalPeliculas: 1 },
];

const MOCK_CATEGORIAS: Categoria[] = [
  { Identificador: 1, Categoria: 'Ciencia Ficción', totalPeliculas: 2 },
  { Identificador: 2, Categoria: 'Drama', totalPeliculas: 1 },
  { Identificador: 3, Categoria: 'Animación', totalPeliculas: 1 },
  { Identificador: 4, Categoria: 'Acción', totalPeliculas: 1 },
];

const MOCK_PELICULAS: Pelicula[] = [
  {
    Identificador: 1,
    Titulo: 'Interstellar',
    IDDirector: 1,
    Director: 'Christopher Nolan',
    Duracion: 169,
    DuracionFormateada: '2h 49m',
    IDCategoria: 1,
    Categoria: 'Ciencia Ficción',
    Sinopsis: 'Un grupo de exploradores viaja a través de un agujero de gusano en el espacio para asegurar la supervivencia de la humanidad.',
    ImagenUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
  },
  {
    Identificador: 2,
    Titulo: 'Oppenheimer',
    IDDirector: 1,
    Director: 'Christopher Nolan',
    Duracion: 180,
    DuracionFormateada: '3h 00m',
    IDCategoria: 2,
    Categoria: 'Drama',
    Sinopsis: 'La historia del físico J. Robert Oppenheimer y su rol decisivo en el desarrollo de la bomba atómica.',
    ImagenUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
  },
  {
    Identificador: 3,
    Titulo: 'Dune: Parte Dos',
    IDDirector: 2,
    Director: 'Denis Villeneuve',
    Duracion: 166,
    DuracionFormateada: '2h 46m',
    IDCategoria: 1,
    Categoria: 'Ciencia Ficción',
    Sinopsis: 'Paul Atreides se une a Chani y a los Fremen para vengar a su familia y salvar el destino de la galaxia.',
    ImagenUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
  },
  {
    Identificador: 4,
    Titulo: 'El Viaje de Chihiro',
    IDDirector: 3,
    Director: 'Hayao Miyazaki',
    Duracion: 125,
    DuracionFormateada: '2h 05m',
    IDCategoria: 3,
    Categoria: 'Animación',
    Sinopsis: 'Una niña de 10 años ingresa a un mundo misterioso gobernado por espíritus y dioses tras un viaje familiar.',
    ImagenUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
  },
];

export const fetchPeliculas = async (): Promise<{ data: Pelicula[]; isFallback: boolean }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${currentApiUrl}/api/peliculas`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isFallback: false };
  } catch (err) {
    console.warn('API no disponible, usando datos de respaldo:', err);
    return { data: MOCK_PELICULAS, isFallback: true };
  }
};

export const fetchDirectores = async (): Promise<Director[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${currentApiUrl}/api/directores`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return MOCK_DIRECTORES;
  }
};

export const fetchCategorias = async (): Promise<Categoria[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${currentApiUrl}/api/categorias`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return MOCK_CATEGORIAS;
  }
};

export const createPeliculaApi = async (pelicula: {
  Titulo: string;
  IDDirector: number;
  Duracion: number;
  IDCategoria: number;
  Sinopsis: string;
  ImagenUrl?: string;
}): Promise<boolean> => {
  try {
    const res = await fetch(`${currentApiUrl}/api/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pelicula),
    });
    return res.ok;
  } catch (e) {
    console.error('Error al crear película:', e);
    return false;
  }
};

export const deletePeliculaApi = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${currentApiUrl}/api/peliculas/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    console.error('Error al eliminar película:', e);
    return false;
  }
};


export const createDirectorApi = async (Director: string): Promise<boolean> => {
  try {
    const res = await fetch(`${currentApiUrl}/api/directores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Director }),
    });
    return res.ok;
  } catch (e) {
    console.error('Error al crear director:', e);
    return false;
  }
};

export const deleteDirectorApi = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${currentApiUrl}/api/directores/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error('Error al eliminar director:', e);
    return false;
  }
};

export const createCategoriaApi = async (Categoria: string): Promise<boolean> => {
  try {
    const res = await fetch(`${currentApiUrl}/api/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Categoria }),
    });
    return res.ok;
  } catch (e) {
    console.error('Error al crear categoría:', e);
    return false;
  }
};

export const deleteCategoriaApi = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${currentApiUrl}/api/categorias/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error('Error al eliminar categoría:', e);
    return false;
  }
};
