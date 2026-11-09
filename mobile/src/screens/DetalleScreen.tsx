import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../colors';
import { getPelicula } from '../services/api';
import { Pelicula } from '../types';

type Props = {
  id: number;
  onBack: () => void;
};

export function DetalleScreen({ id, onBack }: Props) {
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    setCargando(true);
    setError('');

    getPelicula(id)
      .then((data) => {
        if (activo) setPelicula(data);
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar esta película.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  return (
    <View style={styles.contenedor}>
      <Pressable onPress={onBack} style={styles.volver}>
        <Text style={styles.volverTexto}>Volver a la sala</Text>
      </Pressable>

      {cargando ? <ActivityIndicator color={colors.acento} style={{ marginTop: 24 }} /> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {pelicula && (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <Text style={styles.titulo}>{pelicula.Titulo}</Text>

          <View style={styles.ficha}>
            <Fila etiqueta="Director" valor={pelicula.Director} />
            <Fila etiqueta="Duración" valor={`${pelicula.Duracion} minutos`} />
            <Fila etiqueta="Categoría" valor={pelicula.Categoria} />
          </View>

          <Text style={styles.sinopsisTitulo}>Sinopsis</Text>
          <Text style={styles.sinopsis}>{pelicula.Sinopsis}</Text>
        </ScrollView>
      )}
    </View>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.fondo,
    paddingHorizontal: 16,
    paddingTop: 12,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  volver: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  volverTexto: {
    color: colors.acento,
    fontSize: 15,
  },
  titulo: {
    color: colors.texto,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  ficha: {
    backgroundColor: colors.tarjeta,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.linea,
    paddingHorizontal: 12,
  },
  fila: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.linea,
  },
  etiqueta: {
    color: colors.suave,
    fontSize: 12,
    marginBottom: 2,
  },
  valor: {
    color: colors.texto,
    fontSize: 16,
  },
  sinopsisTitulo: {
    color: colors.texto,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  sinopsis: {
    color: '#ddd6c8',
    fontSize: 16,
    lineHeight: 24,
  },
  error: {
    color: colors.suave,
    marginTop: 16,
  },
});
