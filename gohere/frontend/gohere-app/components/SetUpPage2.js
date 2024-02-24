import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';

const SetUpPage2 = ()=>{
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    });


    if (!fontsLoaded && !fontError) {
        return null;
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.heading}>Find Washrooms</Text>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image} 
                        source={require("../assets/setup2.png")} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        When you need to go, you need to go. 
                        That’s why we help you find the washrooms closest to you right when you open the app
                    </Text>
                    <Text style={styles.text}>
                        Easily see all the washrooms along the way between point A and the search location. 
                        Bookmark a few locations so you know where to go the next time you need to go
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.nextButton}>
                        <Text style={styles.nextText}>Next</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    innerContainer: {
        padding: 20,
        flex: 1,
    },
    textContainer: {
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
    },
      nextButton: {
        backgroundColor: 'black', 
        flex: 1.8,
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 13, 
        paddingHorizontal: 20, 
        borderRadius: 10, 
        marginRight: 5, 
    },
    skipButton: {
        backgroundColor: '#EFEFEF', 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius: 10,
        marginLeft: 5, 
    },
    nextText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    skipText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'black'
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
        height: height/3,
        resizeMode: 'contain',
    },
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#DA5C59',
        marginBottom: 20
    }
  });

export default SetUpPage2;