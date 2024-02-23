import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TestConnection from './components/TestConnection'; //replace NavbarContainer with <TestConnection/> if you want to test connection
import NavbarContainer from './components/NavbarContainer'
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1,  backgroundColor: "white"}}>
       <NavbarContainer />
      </SafeAreaView>
      
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
