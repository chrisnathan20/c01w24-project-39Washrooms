import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import NavbarContainer from './components/NavbarContainer';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <NavbarContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Set the background color to black
  },
});
