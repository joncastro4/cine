export interface Director {
  IDDirector: number;
  Director: string;
  totalPeliculas?: number;
}

export interface Categoria {
  Identificador: number;
  Categoria: string;
  totalPeliculas?: number;
}

export interface Pelicula {
  Identificador: number;
  Titulo: string;
  IDDirector: number;
  Director?: string;
  Duracion: number;
  DuracionFormateada?: string;
  IDCategoria: number;
  Categoria?: string;
  Sinopsis: string;
  ImagenUrl?: string | null;
}

export interface Asiento {
  id: string; // ej: "C4"
  fila: string;
  columna: number;
  tipo: 'general' | 'vip' | 'preferencial';
  estado: 'disponible' | 'ocupado';
  precio: number;
}

export interface TicketReserva {
  codigo: string;
  pelicula: string;
  sala: string;
  horario: string;
  fecha: string;
  asientos: string[];
  total: number;
}

