import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/colors';
import { DetalleScreen } from './src/screens/DetalleScreen';
import { FormularioScreen } from './src/screens/FormularioScreen';
import { SalaScreen } from './src/screens/SalaScreen';

type Pantalla =
  | { nombre: 'sala' }
  | { nombre: 'detalle'; id: number }
  | { nombre: 'formulario'; id?: number };

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>({ nombre: 'sala' });

  return (
    <SafeAreaView style={styles.raiz}>
      <StatusBar style="light" />

      {pantalla.nombre === 'sala' && (
        <SalaScreen
          onOpenDetail={(id) => setPantalla({ nombre: 'detalle', id })}
          onAgregar={() => setPantalla({ nombre: 'formulario' })}
        />
      )}

      {pantalla.nombre === 'detalle' && (
        <DetalleScreen
          id={pantalla.id}
          onBack={() => setPantalla({ nombre: 'sala' })}
          onEdit={(id) => setPantalla({ nombre: 'formulario', id })}
        />
      )}

      {pantalla.nombre === 'formulario' && (
        <FormularioScreen
          id={pantalla.id}
          onCancel={() => setPantalla({ nombre: 'sala' })}
          onSaved={() => setPantalla({ nombre: 'sala' })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
});
