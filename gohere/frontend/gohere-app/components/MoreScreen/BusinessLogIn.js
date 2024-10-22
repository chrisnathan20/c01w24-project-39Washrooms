import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '../../env.js'; // Import the server URL from the .env file
import { NativeEventEmitter } from 'react-native';



const BusinessLogin = () => {
    const eventEmitter = new NativeEventEmitter();

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    });


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (email == "") {
            setEmailError("Field required");
            if (password == "") {
                setError("Field required");
            }
            return;
        } else if (password == "") {
            setError("Field required");
            return;
        }


        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/login?_=${new Date().getTime()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            if (!response.ok) {
                if (response.status == 400) {
                    setError("Incorrect email or password");
                }
                console.log(`Response not okay: ${response.status}`);
                return;
            }

            if (response.status == 200) {
                const body = await response.json();
                const token = body.token;

                try {
                    await AsyncStorage.setItem('token', token);
                } catch (error) {
                    console.error("Error with saving token: " + error);
                }

                //Triggers login in App.js
                eventEmitter.emit('login');
            }
        } catch (error) {
            console.error("Error logging in: " + error.message)
        }
    }

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Image style={styles.picture} source={require("../../assets/business-login-page.png")} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={styles.innerContainer}>
                    <View style={styles.content}>

                        <Text style={styles.label}>Email<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            autoCapitalize="none"
                        />
                        <Text style={styles.errorText}>{emailError}</Text>

                        <Text style={styles.label}>Password<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize="none"
                            secureTextEntry={true}
                        />
                        <Text style={styles.errorText}>{error}</Text>

                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    innerContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,

    },
    input: {
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 8,
        //marginBottom: 25,
        fontSize: 16,
        borderRadius: 8,
        height: 44
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        marginBottom: 2
    },
    required: {
        color: 'red'
    },
    loginButton: {
        padding: 10,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
        height: 48
    },
    loginButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    picture: {
        width: 209,
        height: 225,
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'center'
    },
    errorText: {
        color: 'red',
        marginBottom: 15
    },
});

export default BusinessLogin;
