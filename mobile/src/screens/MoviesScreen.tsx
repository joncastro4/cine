import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  type ScrollViewInstance,
  useWindowDimensions,
} from 'react-native';
import tw from '../lib/tailwind';
import { Pelicula, Categoria } from '../types';
import { MovieCard } from '../components/MovieCard';

const PAGE_SIZE = 4;

interface MoviesScreenProps {
  movies: Pelicula[];
  categories: Categoria[];
  loading: boolean;
  onRefresh: () => void;
  onSelectMovie: (movie: Pelicula) => void;
  onSimulateCinema: (movie: Pelicula) => void;
}

export const MoviesScreen: React.FC<MoviesScreenProps> = ({
  movies,
  categories,
  loading,
  onRefresh,
  onSelectMovie,
  onSimulateCinema,
}) => {
  const { width } = useWindowDimensions();
  const isWebOrTablet = width >= 768;

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const scrollRef = useRef<ScrollViewInstance>(null);
  const [page, setPageState] = useState<number>(1);
  const setPage = (n: number) => {
    setPageState(n);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchSearch =
        m.Titulo.toLowerCase().includes(search.toLowerCase()) ||
        (m.Director && m.Director.toLowerCase().includes(search.toLowerCase())) ||
        (m.Sinopsis && m.Sinopsis.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === null || m.IDCategoria === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [movies, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedMovies = useMemo(
    () => filteredMovies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredMovies, currentPage]
  );

  // Al cambiar filtros volvemos a la primera página
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  const renderPager = (spacing: string) =>
    totalPages > 1 ? (
      <View style={tw`flex-row items-center justify-center ${spacing}`}>
          <TouchableOpacity
            disabled={currentPage === 1}
            onPress={() => setPage(currentPage - 1)}
            style={tw`px-3 h-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 mr-2 ${currentPage === 1 ? 'opacity-30' : ''}`}
          >
            <Text style={tw`text-slate-300 text-xs font-bold`}>{isWebOrTablet ? '‹ Anterior' : '‹'}</Text>
          </TouchableOpacity>

          {/* En celular solo se muestra la página actual; en pantallas grandes, todas */}
          {(isWebOrTablet
            ? Array.from({ length: totalPages }, (_, i) => i + 1)
            : [currentPage]
          ).map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setPage(n)}
              style={tw`w-9 h-9 items-center justify-center rounded-xl border mr-2 ${
                n === currentPage ? 'bg-rose-600 border-rose-500' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Text style={tw`text-xs font-bold ${n === currentPage ? 'text-white' : 'text-slate-400'}`}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            disabled={currentPage === totalPages}
            onPress={() => setPage(currentPage + 1)}
            style={tw`px-3 h-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 ${currentPage === totalPages ? 'opacity-30' : ''}`}
          >
            <Text style={tw`text-slate-300 text-xs font-bold`}>{isWebOrTablet ? 'Siguiente ›' : '›'}</Text>
          </TouchableOpacity>
        </View>
    ) : null;

  return (
    <ScrollView
      ref={scrollRef}
      style={tw`flex-1 bg-slate-950`}
      contentContainerStyle={tw`p-4 pb-20`}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#e11d48" />
      }
    >
      {/* Barra de Búsqueda */}
      <View style={tw`bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 flex-row items-center mb-4`}>
        <Text style={tw`text-slate-400 mr-2.5 text-base`}>🔍</Text>
        <TextInput
          placeholder="Buscar película, director o sinopsis..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
          style={tw`flex-1 text-white text-sm`}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={tw`text-slate-400 font-bold px-2`}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtro por Categorías (Horizontal) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row mb-6`}>
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          style={tw`mr-2 px-4 py-2 rounded-xl border ${
            selectedCategory === null
              ? 'bg-rose-600 border-rose-500 shadow-md shadow-rose-600/30'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <Text style={tw`text-xs font-bold ${selectedCategory === null ? 'text-white' : 'text-slate-400'}`}>
            Todas ({movies.length})
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.Identificador;
          const count = movies.filter((m) => m.IDCategoria === cat.Identificador).length;
          return (
            <TouchableOpacity
              key={cat.Identificador}
              onPress={() => setSelectedCategory(isSelected ? null : cat.Identificador)}
              style={tw`mr-2 px-4 py-2 rounded-xl border ${
                isSelected
                  ? 'bg-rose-600 border-rose-500 shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Text style={tw`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                {cat.Categoria} {count > 0 ? `(${count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Título de la sección */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-white font-black text-xl tracking-wide`}>
          En Cartelera
        </Text>
        <Text style={tw`text-slate-400 text-xs`}>
          {filteredMovies.length} {filteredMovies.length === 1 ? 'película' : 'películas'}
        </Text>
      </View>

      {renderPager('mb-4')}

      {/* Grid de Películas Responsivo */}
      {filteredMovies.length === 0 ? (
        <View style={tw`bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 items-center my-6`}>
          <Text style={tw`text-4xl mb-3`}>🎬</Text>
          <Text style={tw`text-white font-bold text-lg mb-1`}>No se encontraron películas</Text>
          <Text style={tw`text-slate-400 text-xs text-center mb-4`}>
            Prueba ajustando los filtros de categoría o el término de búsqueda.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              setSelectedCategory(null);
            }}
            style={tw`bg-slate-800 px-4 py-2 rounded-xl border border-slate-700`}
          >
            <Text style={tw`text-rose-400 text-xs font-bold`}>Restablecer Filtros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={isWebOrTablet ? tw`flex-row flex-wrap -mx-2` : undefined}>
          {pagedMovies.map((movie) => (
            <View
              key={movie.Identificador}
              style={isWebOrTablet ? tw`w-1/2 px-2` : undefined}
            >
              <MovieCard
                movie={movie}
                onSelectMovie={onSelectMovie}
                onSimulateCinema={onSimulateCinema}
              />
            </View>
          ))}
        </View>
      )}

      {renderPager('mt-2')}
    </ScrollView>
  );
};

