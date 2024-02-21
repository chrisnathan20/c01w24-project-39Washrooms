import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TestConnection from './components/TestConnection';
import NavbarContainer from './components/NavbarContainer'

export default function App() {
  return (
    <View style={styles.container}>
      <NavbarContainer />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },


});
