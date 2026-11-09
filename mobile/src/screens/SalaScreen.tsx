import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../colors';
import { getPeliculas } from '../services/api';
import { Pelicula } from '../types';

type Props = {
  onOpenDetail: (id: number) => void;
  onAgregar: () => void;
};

export function SalaScreen({ onOpenDetail, onAgregar }: Props) {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [enPantalla, setEnPantalla] = useState<Pelicula | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargar() {
    setCargando(true);
    setError('');

    try {
      const data = await getPeliculas();
      setPeliculas(data);
      setEnPantalla(data[0] ?? null);
    } catch {
      setPeliculas([]);
      setEnPantalla(null);
      setError('No se pudieron cargar las películas. Revisa que MySQL y la API estén encendidos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.titulo}>Cinetopia</Text>
          <Text style={styles.sala}>Sala 1</Text>
        </View>
        <Pressable onPress={onAgregar}>
          <Text style={styles.agregar}>Agregar</Text>
        </Pressable>
      </View>

      <View style={styles.pantalla}>
        <Text style={styles.etiqueta}>Pantalla</Text>
        {enPantalla ? (
          <>
            <Text style={styles.enTurno}>{enPantalla.Titulo}</Text>
            <Text style={styles.metaPantalla}>
              {enPantalla.Categoria} · {enPantalla.Duracion} min
            </Text>
          </>
        ) : (
          <Text style={styles.metaPantalla}>Nada en pantalla</Text>
        )}
      </View>

      <View style={styles.butacas}>
        {[0, 1, 2, 3].map((fila) => (
          <View key={fila} style={styles.filaButacas}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
              <View key={col} style={styles.butaca} />
            ))}
          </View>
        ))}
      </View>

      {enPantalla && (
        <Pressable style={styles.boton} onPress={() => onOpenDetail(enPantalla.Identificador)}>
          <Text style={styles.botonTexto}>Ver detalle</Text>
        </Pressable>
      )}

      <Text style={styles.seccion}>Películas</Text>

      {cargando ? (
        <ActivityIndicator color={colors.acento} style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>{error}</Text>
          <Pressable onPress={cargar}>
            <Text style={styles.reintentar}>Reintentar</Text>
          </Pressable>
        </View>
      ) : peliculas.length === 0 ? (
        <Text style={styles.avisoTexto}>La cartelera está vacía.</Text>
      ) : (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => String(item.Identificador)}
          style={styles.lista}
          contentContainerStyle={{ paddingBottom: 28 }}
          renderItem={({ item }) => {
            const activa = item.Identificador === enPantalla?.Identificador;
            return (
              <Pressable
                onPress={() => setEnPantalla(item)}
                style={[styles.fila, activa && styles.filaActiva]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.nombre}>{item.Titulo}</Text>
                  <Text style={styles.director}>{item.Director}</Text>
                </View>
                <Text style={styles.minutos}>{item.Duracion} min</Text>
              </Pressable>
            );
          }}
        />
      )}
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
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  titulo: {
    color: colors.texto,
    fontSize: 28,
    fontWeight: '700',
  },
  sala: {
    color: colors.suave,
  },
  agregar: {
    color: colors.acento,
    fontWeight: '700',
    paddingVertical: 6,
    paddingLeft: 12,
  },
  pantalla: {
    backgroundColor: colors.pantalla,
    borderWidth: 2,
    borderColor: '#cfc6b8',
    borderRadius: 8,
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  etiqueta: {
    color: '#8d887e',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  enTurno: {
    color: colors.texto,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  metaPantalla: {
    color: colors.suave,
    marginTop: 4,
  },
  butacas: {
    marginTop: 14,
    gap: 6,
  },
  filaButacas: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  butaca: {
    width: 18,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#3c342c',
  },
  boton: {
    marginTop: 14,
    backgroundColor: colors.acento,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#1a120c',
    fontWeight: '700',
  },
  seccion: {
    color: colors.texto,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  lista: {
    flex: 1,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tarjeta,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.linea,
  },
  filaActiva: {
    borderColor: colors.acento,
  },
  nombre: {
    color: colors.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  director: {
    color: colors.suave,
    marginTop: 2,
    fontSize: 13,
  },
  minutos: {
    color: colors.suave,
    marginLeft: 12,
  },
  aviso: {
    marginTop: 12,
  },
  avisoTexto: {
    color: colors.suave,
    lineHeight: 20,
  },
  reintentar: {
    color: colors.acento,
    marginTop: 10,
    fontWeight: '700',
  },
});
