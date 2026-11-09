import { Platform } from 'react-native';
import { Pelicula } from '../types';

// En el emulador de Android, localhost es la compu: 10.0.2.2
// Si lo abres en el celular, cambia esto por la IP de tu máquina.
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

async function pedir<T>(ruta: string): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`);

  if (!respuesta.ok) {
    throw new Error('La API respondió con error');
  }

  return respuesta.json() as Promise<T>;
}

export function getPeliculas() {
  return pedir<Pelicula[]>('/api/peliculas');
}

export function getPelicula(id: number) {
  return pedir<Pelicula>(`/api/peliculas/${id}`);
}
