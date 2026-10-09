import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Four icons, mounted in this order. On web, with the font file held for 18 s by metro.config.js,
// the first one stays an empty box for good; the other three draw once the file lands.
const ICONS = ['today', 'assignment', 'menu_book', 'person'];

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-symbols on web: a font slower than 12 s leaves the first icon blank</Text>
      <View style={styles.row}>
        {ICONS.map((name, index) => (
          <View key={name} style={styles.cell}>
            <SymbolView name={{ ios: 'circle', android: name, web: name }} size={40} tintColor="#1f2937" />
            <Text style={styles.label}>{index === 0 ? `${name} (mounted first)` : name}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>
        metro.config.js holds the font file for 18 s. After about 20 s, icons 2 to 4 have drawn and icon 1 never does.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 24,
  },
  cell: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
  },
  note: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
  },
});
