import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../colors';
import {
  actualizarPelicula,
  crearCategoria,
  crearDirector,
  crearPelicula,
  getCategorias,
  getDirectores,
  getPelicula,
} from '../services/api';
import { Categoria, Director } from '../types';

type Props = {
  id?: number;
  onCancel: () => void;
  onSaved: () => void;
};

export function FormularioScreen({ id, onCancel, onSaved }: Props) {
  const editando = id != null;
  const [titulo, setTitulo] = useState('');
  const [duracion, setDuracion] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [idDirector, setIdDirector] = useState<number | null>(null);
  const [idCategoria, setIdCategoria] = useState<number | null>(null);
  const [directores, setDirectores] = useState<Director[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevoDirector, setNuevoDirector] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const [dirs, cats] = await Promise.all([getDirectores(), getCategorias()]);
        if (!activo) return;
        setDirectores(dirs);
        setCategorias(cats);

        if (id != null) {
          const pelicula = await getPelicula(id);
          if (!activo) return;
          setTitulo(pelicula.Titulo);
          setDuracion(String(pelicula.Duracion));
          setSinopsis(pelicula.Sinopsis);
          setIdDirector(pelicula.IDDirector);
          setIdCategoria(pelicula.IDCategoria);
        }
      } catch (e) {
        if (activo) setError(e instanceof Error ? e.message : 'No se pudo abrir el formulario');
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [id]);

  async function agregarDirector() {
    const nombre = nuevoDirector.trim();
    if (!nombre) return;

    try {
      const creado = await crearDirector(nombre);
      setDirectores((lista) => [...lista, creado].sort((a, b) => a.Director.localeCompare(b.Director)));
      setIdDirector(creado.IDDirector);
      setNuevoDirector('');
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo agregar el director');
    }
  }

  async function agregarCategoria() {
    const nombre = nuevaCategoria.trim();
    if (!nombre) return;

    try {
      const creada = await crearCategoria(nombre);
      setCategorias((lista) =>
        [...lista, creada].sort((a, b) => a.Categoria.localeCompare(b.Categoria))
      );
      setIdCategoria(creada.Identificador);
      setNuevaCategoria('');
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo agregar la categoría');
    }
  }

  async function guardar() {
    const minutos = Number(duracion);

    if (!titulo.trim() || !sinopsis.trim()) {
      setError('Título y sinopsis no pueden ir vacíos');
      return;
    }
    if (!Number.isInteger(minutos) || minutos <= 0) {
      setError('La duración tiene que ser un número de minutos');
      return;
    }
    if (idDirector == null || idCategoria == null) {
      setError('Elige director y categoría');
      return;
    }

    const datos = {
      Titulo: titulo.trim(),
      Duracion: minutos,
      IDDirector: idDirector,
      IDCategoria: idCategoria,
      Sinopsis: sinopsis.trim(),
    };

    setGuardando(true);
    setError('');

    try {
      if (id == null) await crearPelicula(datos);
      else await actualizarPelicula(id, datos);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      <Pressable onPress={onCancel} style={styles.volver}>
        <Text style={styles.volverTexto}>Volver a la sala</Text>
      </Pressable>

      <Text style={styles.titulo}>{editando ? 'Editar película' : 'Agregar película'}</Text>

      {cargando ? (
        <ActivityIndicator color={colors.acento} style={{ marginTop: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            style={styles.input}
            placeholder="Nombre de la película"
            placeholderTextColor="#7d786f"
          />

          <Text style={styles.label}>Duración (minutos)</Text>
          <TextInput
            value={duracion}
            onChangeText={setDuracion}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="120"
            placeholderTextColor="#7d786f"
          />

          <Text style={styles.label}>Sinopsis</Text>
          <TextInput
            value={sinopsis}
            onChangeText={setSinopsis}
            style={[styles.input, styles.sinopsis]}
            multiline
            placeholder="De qué trata"
            placeholderTextColor="#7d786f"
          />

          <Text style={styles.label}>Director</Text>
          <View style={styles.opciones}>
            {directores.map((d) => (
              <Pressable
                key={d.IDDirector}
                onPress={() => setIdDirector(d.IDDirector)}
                style={[styles.opcion, idDirector === d.IDDirector && styles.opcionActiva]}
              >
                <Text style={styles.opcionTexto}>{d.Director}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.filaNueva}>
            <TextInput
              value={nuevoDirector}
              onChangeText={setNuevoDirector}
              style={[styles.input, styles.inputChico]}
              placeholder="Otro director"
              placeholderTextColor="#7d786f"
            />
            <Pressable onPress={agregarDirector} style={styles.botonChico}>
              <Text style={styles.botonChicoTexto}>Agregar</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Categoría</Text>
          <View style={styles.opciones}>
            {categorias.map((c) => (
              <Pressable
                key={c.Identificador}
                onPress={() => setIdCategoria(c.Identificador)}
                style={[styles.opcion, idCategoria === c.Identificador && styles.opcionActiva]}
              >
                <Text style={styles.opcionTexto}>{c.Categoria}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.filaNueva}>
            <TextInput
              value={nuevaCategoria}
              onChangeText={setNuevaCategoria}
              style={[styles.input, styles.inputChico]}
              placeholder="Otra categoría"
              placeholderTextColor="#7d786f"
            />
            <Pressable onPress={agregarCategoria} style={styles.botonChico}>
              <Text style={styles.botonChicoTexto}>Agregar</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={guardar} disabled={guardando} style={styles.guardar}>
            <Text style={styles.guardarTexto}>{guardando ? 'Guardando...' : 'Guardar'}</Text>
          </Pressable>
        </ScrollView>
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
  volver: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  volverTexto: {
    color: colors.acento,
    fontSize: 15,
  },
  titulo: {
    color: colors.texto,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 14,
  },
  label: {
    color: colors.suave,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.tarjeta,
    color: colors.texto,
    borderWidth: 1,
    borderColor: colors.linea,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  sinopsis: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  opciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcion: {
    borderWidth: 1,
    borderColor: colors.linea,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: colors.tarjeta,
  },
  opcionActiva: {
    borderColor: colors.acento,
  },
  opcionTexto: {
    color: colors.texto,
    fontSize: 14,
  },
  filaNueva: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  inputChico: {
    flex: 1,
  },
  botonChico: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  botonChicoTexto: {
    color: colors.acento,
    fontWeight: '700',
  },
  error: {
    color: '#e0b4a8',
    marginTop: 14,
  },
  guardar: {
    marginTop: 18,
    backgroundColor: colors.acento,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guardarTexto: {
    color: '#1a120c',
    fontWeight: '700',
  },
});
