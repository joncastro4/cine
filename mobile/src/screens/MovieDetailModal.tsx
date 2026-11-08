import React from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { Pelicula } from '../types';

interface MovieDetailModalProps {
  movie: Pelicula | null;
  visible: boolean;
  onClose: () => void;
  onOpenCinemaSimulation: (movie: Pelicula) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  visible,
  onClose,
  onOpenCinemaSimulation,
}) => {
  if (!movie) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800';

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/85 justify-end`}>
        <View style={tw`bg-slate-900 border-t border-slate-700 rounded-t-3xl max-h-[90%] overflow-hidden`}>
          {/* Header con botón cerrar */}
          <View style={tw`flex-row justify-between items-center p-4 border-b border-slate-800`}>
            <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-wider`}>
              Detalle de Película
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={tw`w-8 h-8 rounded-full bg-slate-800 items-center justify-center`}
            >
              <Text style={tw`text-slate-300 font-bold text-lg`}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={tw`p-5 pb-10`}>
            {/* Poster grande */}
            <View style={tw`items-center mb-5`}>
              <Image
                source={{ uri: movie.ImagenUrl || fallbackImage }}
                style={[tw`rounded-2xl bg-slate-800`, { width: 220, aspectRatio: 2 / 3 }]}
                resizeMode="contain"
              />
            </View>

            {/* Título */}
            <Text style={tw`text-white font-black text-3xl mb-3`}>
              {movie.Titulo}
            </Text>

            {/* Fila de Insignias / Tags */}
            <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
              <View style={tw`bg-rose-600/30 border border-rose-500/40 px-3 py-1.5 rounded-xl`}>
                <Text style={tw`text-rose-300 font-bold text-xs`}>
                  🏷️ {movie.Categoria || 'Sin categoría'}
                </Text>
              </View>

              <View style={tw`bg-amber-600/30 border border-amber-500/40 px-3 py-1.5 rounded-xl`}>
                <Text style={tw`text-amber-300 font-bold text-xs`}>
                  ⏱️ {movie.DuracionFormateada || `${movie.Duracion} min`}
                </Text>
              </View>

              <View style={tw`bg-cyan-600/30 border border-cyan-500/40 px-3 py-1.5 rounded-xl`}>
                <Text style={tw`text-cyan-300 font-bold text-xs`}>
                  🎬 {movie.Director || 'Sin director'}
                </Text>
              </View>
            </View>

            {/* Ficha técnica según base de datos */}
            <View style={tw`bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 mb-6`}>
              <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-wider mb-3`}>
                Ficha Técnica
              </Text>

              <View style={tw`flex-row justify-between py-1.5 border-b border-slate-700/40`}>
                <Text style={tw`text-slate-400 text-sm`}>Director:</Text>
                <Text style={tw`text-white font-bold`}>{movie.Director || 'N/A'}</Text>
              </View>

              <View style={tw`flex-row justify-between py-1.5 border-b border-slate-700/40`}>
                <Text style={tw`text-slate-400 text-sm`}>Categoría:</Text>
                <Text style={tw`text-white font-bold`}>{movie.Categoria || 'N/A'}</Text>
              </View>

              <View style={tw`flex-row justify-between py-1.5`}>
                <Text style={tw`text-slate-400 text-sm`}>Duración Exacta:</Text>
                <Text style={tw`text-white font-bold`}>{movie.Duracion} minutos</Text>
              </View>
            </View>

            {/* Sinopsis */}
            <Text style={tw`text-slate-200 font-bold text-lg mb-2`}>
              Sinopsis
            </Text>
            <Text style={tw`text-slate-300 text-base leading-relaxed mb-8`}>
              {movie.Sinopsis}
            </Text>

            {/* Botón para abrir simulación */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                onOpenCinemaSimulation(movie);
              }}
              style={tw`bg-rose-600 py-4 rounded-2xl items-center shadow-lg shadow-rose-600/40 flex-row justify-center`}
            >
              <Text style={tw`text-white font-extrabold text-base mr-2`}>🍿</Text>
              <Text style={tw`text-white font-extrabold text-base`}>
                Simular Sala de Cine para esta Película
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

