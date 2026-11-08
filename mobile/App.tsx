import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from './src/lib/tailwind';
import { Pelicula, Director, Categoria } from './src/types';
import {
  fetchPeliculas,
  fetchDirectores,
  fetchCategorias,
  createDirectorApi,
  deleteDirectorApi,
  createCategoriaApi,
  deleteCategoriaApi,
} from './src/services/api';
import { Header, BottomTabBar, TabKey } from './src/components/Header';
import { MoviesScreen } from './src/screens/MoviesScreen';
import { CinemaSimulationScreen } from './src/screens/CinemaSimulationScreen';
import { AddMovieScreen } from './src/screens/AddMovieScreen';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { MovieDetailModal } from './src/screens/MovieDetailModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('movies');
  const [movies, setMovies] = useState<Pelicula[]>([]);
  const [directores, setDirectores] = useState<Director[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Película seleccionada para el modal de detalle o la simulación
  const [selectedMovie, setSelectedMovie] = useState<Pelicula | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pelisResult, dirsResult, catsResult] = await Promise.all([
        fetchPeliculas(),
        fetchDirectores(),
        fetchCategorias(),
      ]);
      setMovies(pelisResult.data);
      setDirectores(dirsResult);
      setCategorias(catsResult);
    } catch (e) {
      console.error('Error cargando datos:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenDetail = (movie: Pelicula) => {
    setSelectedMovie(movie);
    setDetailModalVisible(true);
  };

  // Abrir simulación de sala con la película elegida
  const handleSimulateCinema = (movie: Pelicula) => {
    setSelectedMovie(movie);
    setDetailModalVisible(false);
    setSimulating(true);
  };

  const handleSelectTab = (tab: TabKey) => {
    setSimulating(false);
    setCurrentTab(tab);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-950`}>
      <StatusBar style="light" />

      {/* La barra superior ocupa todo el ancho; el contenido se centra en pantallas grandes */}
      <Header currentTab={currentTab} onSelectTab={handleSelectTab} />

      <View style={tw`flex-1 w-full max-w-4xl self-center bg-slate-950`}>
        {simulating ? (
          <CinemaSimulationScreen
            key={selectedMovie?.Identificador}
            movies={movies}
            selectedMovie={selectedMovie}
            onBack={() => setSimulating(false)}
          />
        ) : (
          <>
            {currentTab === 'movies' && (
              <MoviesScreen
                movies={movies}
                categories={categorias}
                loading={loading}
                onRefresh={loadData}
                onSelectMovie={handleOpenDetail}
                onSimulateCinema={handleSimulateCinema}
              />
            )}

            {currentTab === 'addMovie' && (
              <AddMovieScreen
                movies={movies}
                directores={directores}
                categorias={categorias}
                onRefreshAll={loadData}
              />
            )}

            {currentTab === 'directors' && (
              <CatalogScreen
                singular="director"
                plural="Directores"
                icon="🎥"
                items={directores.map((d) => ({ id: d.IDDirector, name: d.Director, total: d.totalPeliculas }))}
                onCreate={createDirectorApi}
                onDelete={deleteDirectorApi}
                onRefreshAll={loadData}
              />
            )}

            {currentTab === 'categories' && (
              <CatalogScreen
                singular="categoría"
                plural="Categorías"
                icon="🏷️"
                items={categorias.map((c) => ({ id: c.Identificador, name: c.Categoria, total: c.totalPeliculas }))}
                onCreate={createCategoriaApi}
                onDelete={deleteCategoriaApi}
                onRefreshAll={loadData}
              />
            )}
          </>
        )}

        <MovieDetailModal
          movie={selectedMovie}
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          onOpenCinemaSimulation={handleSimulateCinema}
        />
      </View>

      {/* En celular las pestañas van en una barra inferior */}
      <BottomTabBar currentTab={currentTab} onSelectTab={handleSelectTab} />
    </SafeAreaView>
  );
}
