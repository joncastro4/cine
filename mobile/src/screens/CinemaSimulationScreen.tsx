import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import tw from '../lib/tailwind';
import { Pelicula, Asiento, TicketReserva } from '../types';

interface CinemaSimulationScreenProps {
  movies: Pelicula[];
  selectedMovie: Pelicula | null;
  onBack: () => void;
}

interface Sala {
  nombre: string;
  filas: number;
  columnas: number;
}

// Cada película se proyecta en una sala distinta, con distinta cantidad de asientos.
const SALAS: Sala[] = [
  { nombre: 'Sala 1 - IMAX 3D', filas: 6, columnas: 10 },
  { nombre: 'Sala 2 - VIP Dolby', filas: 4, columnas: 6 },
  { nombre: 'Sala 3 - Macro 2D', filas: 7, columnas: 9 },
  { nombre: 'Sala 4 - Premium', filas: 5, columnas: 8 },
  { nombre: 'Sala 5 - 4DX', filas: 5, columnas: 7 },
  { nombre: 'Sala 6 - Gran Formato', filas: 8, columnas: 10 },
];
const PRECIO_BOLETO = 85;
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const CinemaSimulationScreen: React.FC<CinemaSimulationScreenProps> = ({
  movies,
  selectedMovie,
  onBack,
}) => {
  const currentMovie = selectedMovie || movies[0];

  const movieIndex = Math.max(
    0,
    movies.findIndex((m) => m.Identificador === currentMovie?.Identificador)
  );
  const sala = SALAS[movieIndex % SALAS.length];
  const FILAS = useMemo(() => LETRAS.slice(0, sala.filas).split(''), [sala]);
  const seatSize = sala.columnas >= 10 ? 28 : 32;

  const [selectedHorario, setSelectedHorario] = useState<string>('19:00');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketModalVisible, setTicketModalVisible] = useState<boolean>(false);
  const [ticketData, setTicketData] = useState<TicketReserva | null>(null);

  const horarios = ['13:30', '16:15', '19:00', '21:45'];

  // Generar asientos con ocupación simulada determinista según la película y horario
  const asientos: Asiento[] = useMemo(() => {
    if (!currentMovie) return [];
    const list: Asiento[] = [];

    FILAS.forEach((fila, filaIdx) => {
      for (let col = 1; col <= sala.columnas; col++) {
        const id = `${fila}${col}`;
        const seed = (filaIdx * 19 + col * 37 + currentMovie.Identificador * 11 + selectedHorario.length * 5 + selectedHorario.charCodeAt(1)) % 10;
        const ocupado = seed === 2 || seed === 5 || seed === 8;

        const tipo: 'general' | 'vip' | 'preferencial' =
          filaIdx === 0 ? 'preferencial' : filaIdx >= FILAS.length - 2 ? 'vip' : 'general';

        list.push({
          id,
          fila,
          columna: col,
          tipo,
          estado: ocupado ? 'ocupado' : 'disponible',
          precio: tipo === 'vip' ? PRECIO_BOLETO + 35 : PRECIO_BOLETO,
        });
      }
    });

    return list;
  }, [currentMovie, selectedHorario, FILAS, sala]);

  const toggleSeat = (asiento: Asiento) => {
    if (asiento.estado === 'ocupado') return;

    if (selectedSeats.includes(asiento.id)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== asiento.id));
    } else {
      setSelectedSeats([...selectedSeats, asiento.id]);
    }
  };

  const totalPagar = useMemo(() => {
    return selectedSeats.reduce((acc, seatId) => {
      const found = asientos.find((a) => a.id === seatId);
      return acc + (found ? found.precio : PRECIO_BOLETO);
    }, 0);
  }, [selectedSeats, asientos]);

  const handleConfirmReservation = () => {
    if (selectedSeats.length === 0 || !currentMovie) return;

    const nuevoTicket: TicketReserva = {
      codigo: `CINETOPIA-${Math.floor(100000 + Math.random() * 900000)}`,
      pelicula: currentMovie.Titulo,
      sala: sala.nombre,
      horario: selectedHorario,
      fecha: new Date().toLocaleDateString('es-MX', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      asientos: [...selectedSeats],
      total: totalPagar,
    };

    setTicketData(nuevoTicket);
    setTicketModalVisible(true);
  };

  const handleCloseTicket = () => {
    setTicketModalVisible(false);
    setSelectedSeats([]);
  };

  if (!currentMovie) {
    return (
      <View style={tw`flex-1 items-center justify-center p-6 bg-slate-950`}>
        <Text style={tw`text-white text-lg`}>Cargando catálogo de películas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-slate-950`} contentContainerStyle={tw`pb-20`}>
      {/* Encabezado: volver + película + sala */}
      <View style={tw`px-4 pt-4 mb-4`}>
        <TouchableOpacity onPress={onBack} style={tw`self-start mb-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800`}>
          <Text style={tw`text-slate-300 text-xs font-bold`}>‹ Volver a Cartelera</Text>
        </TouchableOpacity>

        <View style={tw`flex-row bg-slate-900 border border-slate-800 rounded-2xl p-3`}>
          <Image
            source={{ uri: currentMovie.ImagenUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800' }}
            style={tw`w-16 h-24 rounded-lg mr-3`}
            resizeMode="cover"
          />
          <View style={tw`flex-1 justify-center`}>
            <Text style={tw`text-white font-extrabold text-lg`} numberOfLines={2}>{currentMovie.Titulo}</Text>
            <Text style={tw`text-rose-400 font-bold text-sm mt-1`}>{sala.nombre}</Text>
            <Text style={tw`text-slate-400 text-xs`}>
              {sala.filas} filas × {sala.columnas} asientos = {sala.filas * sala.columnas} asientos
            </Text>
          </View>
        </View>
      </View>

      {/* Horarios */}
      <View style={tw`px-4 mb-4`}>
        <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-wider mb-2`}>
          Función:
        </Text>
        <View style={tw`flex-row gap-2`}>
          {horarios.map((h) => (
            <TouchableOpacity
              key={h}
              onPress={() => {
                setSelectedHorario(h);
                setSelectedSeats([]);
              }}
              style={tw`flex-1 py-2 rounded-xl items-center border ${
                selectedHorario === h ? 'bg-rose-600 border-rose-500' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Text style={tw`text-xs font-extrabold ${selectedHorario === h ? 'text-white' : 'text-slate-400'}`}>
                {h}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. SIMULACIÓN DE LA SALA DE CINE */}
      <View style={tw`mx-4 bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl items-center`}>
        {/* Pantalla Curva Simulada */}
        <View style={tw`w-full items-center mb-8`}>
          <View style={tw`w-3/4 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80 mb-2`} />
          <Text style={tw`text-cyan-400 text-[11px] font-black tracking-widest`}>
            PANTALLA DE CINE (SCREEN)
          </Text>
        </View>

        {/* Cuadrícula de Asientos */}
        <View style={tw`w-full max-w-sm mb-6`}>
          {FILAS.map((fila) => (
            <View key={fila} style={tw`flex-row items-center justify-between my-1.5`}>
              <Text style={tw`text-slate-500 font-bold text-xs w-4`}>{fila}</Text>

              <View style={tw`flex-row gap-1 flex-1 justify-center`}>
                {asientos
                  .filter((a) => a.fila === fila)
                  .map((asiento) => {
                    const isSelected = selectedSeats.includes(asiento.id);
                    const isOccupied = asiento.estado === 'ocupado';

                    let bgClass = 'bg-slate-800 border-slate-700'; // disponible general
                    if (isOccupied) {
                      bgClass = 'bg-slate-950 border-slate-900 opacity-30';
                    } else if (isSelected) {
                      bgClass = 'bg-rose-600 border-rose-400 shadow-md shadow-rose-500/50';
                    } else if (asiento.tipo === 'vip') {
                      bgClass = 'bg-amber-950/80 border-amber-600/70';
                    }

                    return (
                      <TouchableOpacity
                        key={asiento.id}
                        disabled={isOccupied}
                        onPress={() => toggleSeat(asiento)}
                        style={[tw`rounded-lg items-center justify-center border ${bgClass}`, { width: seatSize, height: seatSize }]}
                      >
                        <Text
                          style={tw`text-[10px] font-bold ${
                            isSelected
                              ? 'text-white'
                              : isOccupied
                              ? 'text-slate-600'
                              : asiento.tipo === 'vip'
                              ? 'text-amber-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {asiento.columna}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>

              <Text style={tw`text-slate-500 font-bold text-xs w-4 text-right`}>{fila}</Text>
            </View>
          ))}
        </View>

        {/* Leyenda de Asientos */}
        <View style={tw`flex-row justify-center gap-4 py-3 border-t border-slate-800/80 w-full`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700 mr-1.5`} />
            <Text style={tw`text-slate-400 text-[11px]`}>Disponible</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-3.5 h-3.5 rounded bg-slate-950 border border-slate-900 opacity-40 mr-1.5`} />
            <Text style={tw`text-slate-500 text-[11px]`}>Ocupado</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-3.5 h-3.5 rounded bg-amber-950 border border-amber-500 mr-1.5`} />
            <Text style={tw`text-amber-400 text-[11px]`}>VIP</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-3.5 h-3.5 rounded bg-rose-600 border border-rose-400 mr-1.5`} />
            <Text style={tw`text-rose-400 text-[11px]`}>Tu selección</Text>
          </View>
        </View>
      </View>

      {/* 4. Barra de Resumen y Confirmación */}
      <View style={tw`m-4 p-4 bg-slate-900 rounded-2xl border border-slate-800 flex-row items-center justify-between`}>
        <View>
          <Text style={tw`text-slate-400 text-xs`}>
            {selectedSeats.length === 0
              ? 'Toca los asientos para elegir'
              : `${selectedSeats.length} asiento(s): ${selectedSeats.join(', ')}`}
          </Text>
          <Text style={tw`text-white font-black text-2xl`}>
            ${totalPagar} <Text style={tw`text-xs font-normal text-slate-400`}>MXN</Text>
          </Text>
        </View>

        <TouchableOpacity
          disabled={selectedSeats.length === 0}
          onPress={handleConfirmReservation}
          style={tw`px-6 py-3.5 rounded-xl shadow-lg ${
            selectedSeats.length > 0 ? 'bg-rose-600 shadow-rose-600/40' : 'bg-slate-800 opacity-40'
          }`}
        >
          <Text style={tw`text-white font-black text-sm`}>Confirmar Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Ticket de Cine Simulado */}
      <Modal visible={ticketModalVisible} transparent={true} animationType="fade">
        <View style={tw`flex-1 bg-black/85 items-center justify-center p-4`}>
          <View style={tw`bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden border border-slate-700 shadow-2xl`}>
            {/* Header del Ticket */}
            <View style={tw`bg-rose-600 p-5 items-center`}>
              <Text style={tw`text-white/80 text-xs font-bold uppercase tracking-widest mb-1`}>
                BOLETO DE CINE SIMULADO
              </Text>
              <Text style={tw`text-white font-black text-2xl text-center`}>
                {ticketData?.pelicula}
              </Text>
            </View>

            {/* Contenido del Ticket */}
            <View style={tw`p-6 bg-slate-900`}>
              <View style={tw`flex-row justify-between py-2 border-b border-slate-800`}>
                <Text style={tw`text-slate-400 text-sm`}>Código Reserva:</Text>
                <Text style={tw`text-cyan-400 font-mono font-bold`}>{ticketData?.codigo}</Text>
              </View>

              <View style={tw`flex-row justify-between py-2 border-b border-slate-800`}>
                <Text style={tw`text-slate-400 text-sm`}>Sala:</Text>
                <Text style={tw`text-white font-bold`}>{ticketData?.sala}</Text>
              </View>

              <View style={tw`flex-row justify-between py-2 border-b border-slate-800`}>
                <Text style={tw`text-slate-400 text-sm`}>Función:</Text>
                <Text style={tw`text-white font-bold`}>{ticketData?.horario} ({ticketData?.fecha})</Text>
              </View>

              <View style={tw`flex-row justify-between py-2 border-b border-slate-800`}>
                <Text style={tw`text-slate-400 text-sm`}>Asientos:</Text>
                <Text style={tw`text-rose-400 font-extrabold text-base`}>
                  {ticketData?.asientos.join(', ')}
                </Text>
              </View>

              <View style={tw`flex-row justify-between py-3`}>
                <Text style={tw`text-slate-300 font-bold`}>Total Simulado:</Text>
                <Text style={tw`text-emerald-400 font-black text-xl`}>${ticketData?.total} MXN</Text>
              </View>

              {/* Código QR Simulado */}
              <View style={tw`items-center my-4 p-4 bg-white rounded-2xl`}>
                <Image
                  source={{
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${ticketData?.codigo}`,
                  }}
                  style={tw`w-36 h-36`}
                />
                <Text style={tw`text-slate-600 text-[10px] font-mono mt-2`}>
                  Escanea en la entrada de la sala
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCloseTicket}
                style={tw`bg-slate-800 py-3.5 rounded-xl items-center border border-slate-700`}
              >
                <Text style={tw`text-white font-bold text-sm`}>Cerrar y Nueva Simulación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

