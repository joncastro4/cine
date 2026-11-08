import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { Pelicula } from '../types';

interface MovieCardProps {
  movie: Pelicula;
  onSelectMovie: (movie: Pelicula) => void;
  onSimulateCinema: (movie: Pelicula) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelectMovie, onSimulateCinema }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800';

  return (
    <View style={tw`bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg mb-4`}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => onSelectMovie(movie)}>
        <View style={tw`h-56 w-full relative bg-slate-900`}>
          <Image
            source={{ uri: movie.ImagenUrl || fallbackImage }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
          <View style={tw`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80`} />
          
          {/* Badge de Categoría */}
          <View style={tw`absolute top-3 left-3 bg-rose-600/90 px-2.5 py-1 rounded-lg backdrop-blur-md`}>
            <Text style={tw`text-white font-bold text-xs uppercase tracking-wider`}>
              {movie.Categoria || 'Cine'}
            </Text>
          </View>

          {/* Badge de Duración */}
          <View style={tw`absolute top-3 right-3 bg-black/60 px-2.5 py-1 rounded-lg border border-white/20 backdrop-blur-md`}>
            <Text style={tw`text-white text-xs font-semibold`}>
              ⏱️ {movie.DuracionFormateada || `${movie.Duracion} min`}
            </Text>
          </View>
        </View>

        <View style={tw`p-4`}>
          <Text style={tw`text-white font-extrabold text-xl mb-1`} numberOfLines={1}>
            {movie.Titulo}
          </Text>

          <Text style={tw`text-slate-400 text-xs mb-2`}>
            Director: <Text style={tw`text-slate-200 font-semibold`}>{movie.Director || `ID #${movie.IDDirector}`}</Text>
          </Text>

          <Text style={tw`text-slate-300 text-sm leading-relaxed mb-4`} numberOfLines={2}>
            {movie.Sinopsis}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botones de acción rápida */}
      <View style={tw`px-4 pb-4 flex-row gap-2`}>
        <TouchableOpacity
          onPress={() => onSelectMovie(movie)}
          style={tw`flex-1 py-2.5 bg-slate-700/70 rounded-xl items-center border border-slate-600`}
        >
          <Text style={tw`text-slate-200 font-bold text-xs`}>Ver Detalle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSimulateCinema(movie)}
          style={tw`flex-1 py-2.5 bg-rose-600 rounded-xl items-center shadow-md shadow-rose-600/30 flex-row justify-center`}
        >
          <Text style={tw`text-white font-bold text-xs mr-1`}>🎟️</Text>
          <Text style={tw`text-white font-bold text-xs`}>Simular</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

