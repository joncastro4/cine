import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import tw from '../lib/tailwind';
import { notify, confirmAction } from '../lib/dialog';
import { Pelicula, Director, Categoria } from '../types';
import {
  createPeliculaApi,
  deletePeliculaApi,
  getApiUrl,
  setApiUrl,
} from '../services/api';

interface AddMovieScreenProps {
  movies: Pelicula[];
  directores: Director[];
  categorias: Categoria[];
  onRefreshAll: () => void;
}

export const AddMovieScreen: React.FC<AddMovieScreenProps> = ({
  movies,
  directores,
  categorias,
  onRefreshAll,
}) => {
  // Configuración de API
  const [apiUrlInput, setApiUrlInput] = useState<string>(getApiUrl());

  // Formulario de nueva película
  const [titulo, setTitulo] = useState<string>('');
  const [idDirector, setIdDirector] = useState<number>(directores[0]?.IDDirector || 1);
  const [duracion, setDuracion] = useState<string>('120');
  const [idCategoria, setIdCategoria] = useState<number>(categorias[0]?.Identificador || 1);
  const [sinopsis, setSinopsis] = useState<string>('');
  const [imagenUrl, setImagenUrl] = useState<string>('');
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

  const handleSaveApiUrl = () => {
    setApiUrl(apiUrlInput.trim());
    notify('Configuración Guardada', `URL de la API actualizada a: ${apiUrlInput}`);
    onRefreshAll();
  };

  const handleCreateMovie = async () => {
    if (!titulo.trim() || !sinopsis.trim()) {
      notify('Campos Incompletos', 'Por favor ingresa al menos el Título y la Sinopsis.');
      return;
    }

    const duracionNum = parseInt(duracion, 10);
    if (isNaN(duracionNum) || duracionNum <= 0) {
      notify('Duración Inválida', 'La duración debe ser un número entero mayor a cero.');
      return;
    }

    setLoadingCreate(true);
    const success = await createPeliculaApi({
      Titulo: titulo.trim(),
      IDDirector: Number(idDirector),
      Duracion: duracionNum,
      IDCategoria: Number(idCategoria),
      Sinopsis: sinopsis.trim(),
      ImagenUrl: imagenUrl.trim() || undefined,
    });
    setLoadingCreate(false);

    if (success) {
      notify('Éxito', `Película "${titulo}" creada correctamente en la base de datos.`);
      setTitulo('');
      setSinopsis('');
      setImagenUrl('');
      setDuracion('120');
      onRefreshAll();
    } else {
      notify(
        'Aviso',
        'No se pudo conectar a la API o falló la creación. Revisa que el backend esté corriendo en la URL configurada.'
      );
    }
  };

  const handleDeleteMovie = async (id: number, title: string) => {
    confirmAction(
      'Confirmar Eliminación',
      `¿Deseas eliminar la película "${title}" (ID #${id}) de la base de datos?`,
      async () => {
        const success = await deletePeliculaApi(id);
        if (success) {
          notify('Eliminado', 'Película eliminada con éxito.');
          onRefreshAll();
        } else {
          notify('Error', 'No se pudo eliminar la película en el servidor.');
        }
      }
    );
  };

  return (
    <ScrollView style={tw`flex-1 bg-slate-950`} contentContainerStyle={tw`p-4 pb-20`}>
      {/* 1. Configuración de Conexión a la API */}
      <View style={tw`bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 shadow-xl`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-lg mr-2`}>🌐</Text>
          <Text style={tw`text-white font-extrabold text-base`}>Conexión con el Backend</Text>
        </View>
        <Text style={tw`text-slate-400 text-xs mb-3 leading-relaxed`}>
          Si pruebas desde tu teléfono real en la misma red Wi-Fi, pon la IP de tu computadora (ej: http://192.168.1.50:3000).
        </Text>

        <View style={tw`flex-row gap-2`}>
          <TextInput
            value={apiUrlInput}
            onChangeText={setApiUrlInput}
            autoCapitalize="none"
            style={tw`flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono`}
          />
          <TouchableOpacity
            onPress={handleSaveApiUrl}
            style={tw`bg-rose-600 px-4 py-2 rounded-xl justify-center shadow-md shadow-rose-600/30`}
          >
            <Text style={tw`text-white font-bold text-xs`}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Formulario para agregar película (POST /api/peliculas) */}
      <View style={tw`bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 shadow-xl`}>
        <View style={tw`flex-row items-center mb-1`}>
          <Text style={tw`text-lg mr-2`}>➕</Text>
          <Text style={tw`text-white font-extrabold text-lg`}>Registrar Nueva Película</Text>
        </View>
        <Text style={tw`text-slate-400 text-xs mb-4`}>
          Guarda directamente en la tabla Películas de MySQL vía Prisma.
        </Text>

        {/* Campo Título */}
        <Text style={tw`text-slate-300 text-xs font-bold mb-1.5`}>Título:</Text>
        <TextInput
          placeholder="Ej: Inception, Gladiator II, Avatar 3..."
          placeholderTextColor="#64748b"
          value={titulo}
          onChangeText={setTitulo}
          style={tw`bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm mb-3`}
        />

        {/* Fila Director y Categoría */}
        <View style={tw`flex-row gap-3 mb-3`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-slate-300 text-xs font-bold mb-1.5`}>Director:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
              {directores.map((d) => (
                <TouchableOpacity
                  key={d.IDDirector}
                  onPress={() => setIdDirector(d.IDDirector)}
                  style={tw`mr-2 px-3 py-2 rounded-xl border ${
                    idDirector === d.IDDirector ? 'bg-cyan-600 border-cyan-400' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <Text style={tw`text-xs font-bold ${idDirector === d.IDDirector ? 'text-white' : 'text-slate-400'}`}>
                    {d.Director}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={tw`mb-3`}>
          <Text style={tw`text-slate-300 text-xs font-bold mb-1.5`}>Categoría:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
            {categorias.map((c) => (
              <TouchableOpacity
                key={c.Identificador}
                onPress={() => setIdCategoria(c.Identificador)}
                style={tw`mr-2 px-3 py-2 rounded-xl border ${
                  idCategoria === c.Identificador ? 'bg-amber-600 border-amber-400' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <Text style={tw`text-xs font-bold ${idCategoria === c.Identificador ? 'text-white' : 'text-slate-400'}`}>
                  {c.Categoria}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Duración */}
        <Text style={tw`text-slate-300 text-xs font-bold mb-1.5`}>Duración (en minutos):</Text>
        <TextInput
          placeholder="Ej: 148"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={duracion}
          onChangeText={setDuracion}
          style={tw`bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm mb-3`}
        />

        {/* URL de Póster */}
        <Text style={tw`text-slate-300 text-xs font-bold mb-1.5`}>URL de Imagen / Póster (opcional):</Text>
        <TextInput
          placeholder="https://images.unsplash.com/..."
          placeholderTextColor="#64748b"
          value={imagenUrl}
          onChangeText={setImagenUrl}
          autoCapitalize="none"
          style={tw`bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm mb-3`}
        />

        {/* Sinopsis */}
        <Text style={tw`text-slate-300 text-xs font-bold mb-1.5`}>Sinopsis:</Text>
        <TextInput
          placeholder="Describe la trama de la película..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={3}
          value={sinopsis}
          onChangeText={setSinopsis}
          style={tw`bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm mb-4 min-h-[70px] text-top`}
        />

        <TouchableOpacity
          disabled={loadingCreate}
          onPress={handleCreateMovie}
          style={tw`bg-rose-600 py-3.5 rounded-xl items-center shadow-lg shadow-rose-600/40`}
        >
          <Text style={tw`text-white font-extrabold text-sm`}>
            {loadingCreate ? 'Guardando en Base de Datos...' : 'Guardar Película en MySQL'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Lista de Películas para Gestión / Eliminación */}
      <View style={tw`bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl`}>
        <Text style={tw`text-white font-extrabold text-lg mb-1`}>Películas en la Base de Datos</Text>
        <Text style={tw`text-slate-400 text-xs mb-4`}>
          Puedes eliminar películas existentes para probar la reactividad del backend.
        </Text>

        {movies.map((m) => (
          <View
            key={m.Identificador}
            style={tw`flex-row items-center justify-between py-3 border-b border-slate-800/80`}
          >
            <View style={tw`flex-1 pr-2`}>
              <Text style={tw`text-white font-bold text-sm`} numberOfLines={1}>
                #{m.Identificador} - {m.Titulo}
              </Text>
              <Text style={tw`text-slate-400 text-xs`}>
                {m.Categoria || 'Sin Cat.'} • {m.Duracion} min • {m.Director || 'Sin Dir.'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleDeleteMovie(m.Identificador, m.Titulo)}
              style={tw`bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30`}
            >
              <Text style={tw`text-red-400 font-bold text-xs`}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

