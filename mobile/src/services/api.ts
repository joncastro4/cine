import { Platform } from 'react-native';
import { Categoria, Director, Pelicula, PeliculaInput } from '../types';

// En el emulador de Android, localhost es la compu: 10.0.2.2
// Si lo abres en el celular, cambia esto por la IP de tu máquina.
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

async function pedir<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(opciones?.headers ?? {}),
    },
  });

  const data = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje =
      data && typeof data.mensaje === 'string' ? data.mensaje : 'La API respondió con error';
    throw new Error(mensaje);
  }

  return data as T;
}

export function getPeliculas() {
  return pedir<Pelicula[]>('/api/peliculas');
}

export function getPelicula(id: number) {
  return pedir<Pelicula>(`/api/peliculas/${id}`);
}

export function crearPelicula(datos: PeliculaInput) {
  return pedir<Pelicula>('/api/peliculas', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export function actualizarPelicula(id: number, datos: PeliculaInput) {
  return pedir<Pelicula>(`/api/peliculas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export function eliminarPelicula(id: number) {
  return pedir<{ mensaje: string }>(`/api/peliculas/${id}`, {
    method: 'DELETE',
  });
}

export function getDirectores() {
  return pedir<Director[]>('/api/directores');
}

export function crearDirector(nombre: string) {
  return pedir<Director>('/api/directores', {
    method: 'POST',
    body: JSON.stringify({ Director: nombre }),
  });
}

export function getCategorias() {
  return pedir<Categoria[]>('/api/categorias');
}

export function crearCategoria(nombre: string) {
  return pedir<Categoria>('/api/categorias', {
    method: 'POST',
    body: JSON.stringify({ Categoria: nombre }),
  });
}
