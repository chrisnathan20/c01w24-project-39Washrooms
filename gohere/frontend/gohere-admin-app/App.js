import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TestConnection from './components/TestConnection';
import AdminNavbarContainer from './components/AdminNavbarContainer.js';

export default function App() {
  return (
    <View style={styles.container}>
        <AdminNavbarContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
