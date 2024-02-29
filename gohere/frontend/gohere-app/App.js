import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import TestConnection from './components/TestConnection';
import NavbarContainer from './components/NavbarContainer'
import SetUpPager from './components/SetUpPager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ManageProfile from './components/ManageProfile';

export default function App() {
  const [setupComplete, setSetupComplete] = useState(false);

  // To actually check the setup status of user
  // useEffect(() => {
  //   checkSetupStatus();
  // }, []);

  // dummy useEffect to delete local storage first for testing purposes
  // setup status will always be false on launch/refresh
  useEffect(() => {
    const resetDiseaseKey = async () => {
        try {
            await AsyncStorage.removeItem('disease');
        } catch (error) {
            console.error('Error removing disease key from AsyncStorage:', error);
        }
    };

    resetDiseaseKey().then(() => {
        checkSetupStatus();
    });
  }, []);

  const checkSetupStatus = async () => {
    try {
      const disease = await AsyncStorage.getItem('disease');
      if (disease) {
        setSetupComplete(true);
      }
    } catch (error) {
      console.error('Error reading data from AsyncStorage:', error);
    }
  };

  const handleSetupComplete = (isComplete) => {
    setSetupComplete(isComplete);
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black"/>
      {setupComplete ? (
        <NavbarContainer />
      ) : (
        <SetUpPager onComplete={handleSetupComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Set the background color to black
  },
});
