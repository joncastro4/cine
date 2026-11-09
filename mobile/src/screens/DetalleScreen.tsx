import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../colors';
import { eliminarPelicula, getPelicula } from '../services/api';
import { Pelicula } from '../types';

type Props = {
  id: number;
  onBack: () => void;
  onEdit: (id: number) => void;
};

export function DetalleScreen({ id, onBack, onEdit }: Props) {
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [confirmando, setConfirmando] = useState(false);

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

  async function borrar() {
    if (!pelicula) return;

    try {
      await eliminarPelicula(pelicula.Identificador);
      onBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar');
      setConfirmando(false);
    }
  }

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

          <View style={styles.acciones}>
            <Pressable onPress={() => onEdit(pelicula.Identificador)}>
              <Text style={styles.editar}>Editar</Text>
            </Pressable>
            {confirmando ? (
              <View style={styles.confirmarFila}>
                <Text style={styles.confirmar}>¿Seguro?</Text>
                <Pressable onPress={borrar}>
                  <Text style={styles.eliminar}>Sí, eliminar</Text>
                </Pressable>
                <Pressable onPress={() => setConfirmando(false)}>
                  <Text style={styles.editar}>No</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setConfirmando(true)}>
                <Text style={styles.eliminar}>Eliminar</Text>
              </Pressable>
            )}
          </View>
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
  acciones: {
    flexDirection: 'row',
    gap: 22,
    marginTop: 22,
  },
  editar: {
    color: colors.acento,
    fontWeight: '700',
    fontSize: 16,
  },
  eliminar: {
    color: '#d7a097',
    fontWeight: '700',
    fontSize: 16,
  },
  confirmar: {
    color: colors.suave,
    fontSize: 16,
  },
  confirmarFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  error: {
    color: colors.suave,
    marginTop: 16,
  },
});
