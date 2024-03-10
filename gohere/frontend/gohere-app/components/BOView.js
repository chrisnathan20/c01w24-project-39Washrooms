import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '@env';

const BOView = () => {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    useEffect(() => {
        getEmail();
    }, []);

    const getEmail = async () => {
        try {
            const test = await AsyncStorage.getItem('token')
            setToken(test);
            console.log("Retrived token: ", token);

            const data = await fetch(`${GOHERE_SERVER_URL}/businessowner/whoami`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!data.ok) {
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
        } catch (error) {
            console.error('Error removing disease key from AsyncStorage:', error);
        }
    };

    const handleLogout = async () => {
        const resetTokenKey = async () => {
            try {
                await AsyncStorage.removeItem('token');
            } catch (error) {
                console.error('Error removing disease key from AsyncStorage:', error);
            }
        };
        resetTokenKey();
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
        paddingVertical: 40,
        paddingHorizontal: 15,
    },

    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 27,
        marginBottom: 15
    },

    logoutButton: {
        //flex: 1,
        // marginBottom: 30,
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