import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import TestConnection from './components/TestConnection';
import NavbarContainer from './components/Navbar/NavbarContainer'
import SetUpPager from './components/SetUpScreen/SetUpPager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ManageProfile from './components/MoreScreen/ManageProfile';
import BOView from './components/BusinessOwner/BOView';
import { NativeEventEmitter } from 'react-native';


export default function App() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [businessOwner, setBusinessOwner] = useState(false);
  //change to true to avoid signing in

  const eventEmitter = new NativeEventEmitter();


  // To actually check the setup status of user
  // useEffect(() => {
  //   checkSetupStatus();
  // }, []);

  // dummy useEffect to delete local storage first for testing purposes
  // setup status will always be false on launch/refresh
  useEffect(() => {
    const loginListener = eventEmitter.addListener('login', event => {
      setBusinessOwner(true);
    });

    const logoutListener = eventEmitter.addListener('logout', event => {
      setBusinessOwner(false);
    });

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

    //here
    const resetTokenKey = async () => {
      try {
        await AsyncStorage.removeItem('token');
      } catch (error) {
        console.error('Error removing disease key from AsyncStorage:', error);
      }
    };

    resetTokenKey().then(() => {
      checkBusinessOwner();
    });

    checkSetupStatus();
    checkBusinessOwner();
    //to here

    return () => {
      loginListener.remove();
      logoutListener.remove();
    }
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

  const checkBusinessOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setBusinessOwner(true);
        //console.log("We get token")
      } else {
        setBusinessOwner(false);
        //console.log("we don't get token")
      }
    } catch (error) {
      console.error('Error reading data from AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      {(() => {
        switch (true) {
          case !setupComplete:
            return <SetUpPager onComplete={handleSetupComplete} />;
          case businessOwner:
            return <BOView />;
          case setupComplete && !businessOwner:
            return <NavbarContainer />;
          default:
            return null; // Handle other cases if necessary
        }
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});