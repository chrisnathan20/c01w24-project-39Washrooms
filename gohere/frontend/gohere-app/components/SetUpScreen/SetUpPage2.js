import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';

const SetUpPage2 = ()=>{
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    });


    if (!fontsLoaded && !fontError) {
        return null;
    }

    return(
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Find Washrooms</Text>
                <Image style={styles.indicator} source={require("../../assets/indicator2.png")}/>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image} 
                    source={require("../../assets/setup2.png")} />
            </View>
            <View>
                <Text style={styles.text}>
                    When you need to go, you need to go. 
                    That’s why we help you find the washrooms closest to you right when you open the app.
                </Text>
                <Text style={styles.text}>
                    Easily see all the washrooms along the way between point A and the search location. 
                    Bookmark a few locations so you know where to go the next time you need to go.
                </Text>
            </View>
        </View>
    )
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headingContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    indicator:{
        width: width*0.15,
        height: width*0.15,
        resizeMode: 'contain',
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },  
    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 27
    },
    image: {
        width: width,
        height: height/3.4,
        resizeMode: 'contain',
    },
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#DA5C59',
    }
  });

export default SetUpPage2;