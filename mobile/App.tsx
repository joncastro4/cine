import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/colors';
import { DetalleScreen } from './src/screens/DetalleScreen';
import { SalaScreen } from './src/screens/SalaScreen';

export default function App() {
  const [peliculaId, setPeliculaId] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.raiz}>
      <StatusBar style="light" />
      {peliculaId == null ? (
        <SalaScreen onOpenDetail={setPeliculaId} />
      ) : (
        <DetalleScreen id={peliculaId} onBack={() => setPeliculaId(null)} />
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
