import React, { useState } from 'react';
import { View, Text, StyleSheet,  Image, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';

const SetUpPage3 = ()=>{
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
                <Text style={styles.heading}>Business Owner?</Text>
                <Image style={styles.indicator} source={require("../../assets/indicator3.png")}/>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image} 
                    source={require("../../assets/setup3.png")} />
            </View>
            <View>
                <Text style={styles.text}>
                If you would like to contribute to the GoHere program and 
                reap the benefits of the sponsorship program, head to “More” and 
                sign up as a business to start volunteering and learning more about the various sponsorship tiers offered.
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
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#DA5C59',
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
  });

export default SetUpPage3;