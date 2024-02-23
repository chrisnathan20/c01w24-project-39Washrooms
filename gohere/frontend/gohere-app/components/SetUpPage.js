import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useFonts } from 'expo-font';

const SetUpPage = ()=>{
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }
    return(
        <SafeAreaView style={styles.container}>
            <Image 
                source={require("../assets/setup1.png")} />
            <Text style={styles.text}>Please select which type of IBD you have. This will allow us to personalize your experience.</Text>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
    text: {
        fontFamily: 'Poppins-Regular'
    },
    image: {
        width: 200,
        height: 300
    }
  });

export default SetUpPage;