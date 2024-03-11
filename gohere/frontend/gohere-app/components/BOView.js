import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '@env';
import { NativeEventEmitter } from 'react-native';

const BOView = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    });
    if (!fontsLoaded && !fontError) {
        return null;
    }
    const [email, setEmail] = useState("");

    const eventEmitter = new NativeEventEmitter();

    useEffect(() => {
        getEmail();
    }, []);

    const getEmail = async () => {
        const token = await AsyncStorage.getItem('token')

        try {
            const data = await fetch(`${GOHERE_SERVER_URL}/businessowner/whoami`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!data.ok) { //If there is an issue with the token, delete it
                console.log(`Response not okay: ${data.status}`);
                resetTokenKey();
                return;
            }

            const response = await data.json();
            setEmail(response.response);

        } catch (error) {
            console.error("Error:" + error);
            return;
        }
    }
    const resetTokenKey = async () => {
        try {
            await AsyncStorage.removeItem('token');
            eventEmitter.emit('logout');
        } catch (error) {
            console.error('Error removing disease key from AsyncStorage:', error);
        }
    };

    const handleLogout = async () => {
        resetTokenKey(); //resetting token key triggers a log out 
    }


    return (
        <View style={styles.container}>
            <Text style={styles.text}> Sign Up Complete!</Text>
            <Text style={styles.text}> User email is: {email}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },

    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 27,
        marginBottom: 15
    },

    logoutButton: {
        padding: 10,
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
    },
    logoutText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
});

export default BOView;