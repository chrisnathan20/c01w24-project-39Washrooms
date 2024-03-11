import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '@env'; // Import the server URL from the .env file
import { NavigationContainer, useNavigation } from '@react-navigation/native';



const BusinessSignUp = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }


    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async () => {


        try {
            console.log(GOHERE_SERVER_URL);
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

                console.log("It is working lol")
                console.log("token is:", token);
                try {
                    await AsyncStorage.setItem('token', token);
                    console.log("we save token");
                } catch (error) {
                    console.error("Error with saving token: " + error);
                }
            }
        } catch (error) {
            console.error("Error logging in: " + error.message)
        }
    }

    return (
        <View style={styles.container}>
            <Image style={styles.picture} source={require("../assets/business-login-page.png")} />
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
                        <Text style={styles.errorText}></Text>

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
                    <TouchableOpacity style={styles.confirmButton} onPress={handleLogin}>
                        <Text style={styles.confirmButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>

        </View>
    );
};

const { width, height } = Dimensions.get('window');
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
    content: {
        flex: 1
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20
    },
    back: {
        width: width * 0.08,
        height: width * 0.08,
        resizeMode: 'contain',
        marginRight: 20
    },
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#DA5C59',
    },
    input: {
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 8,
        //marginBottom: 25,
        fontSize: 16,
        borderRadius: 8,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        marginBottom: 5
    },
    required: {
        color: 'red'
    },
    button: {
        marginVertical: 10,
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#5E6366',
    },
    selectedButton: {
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
    },
    buttonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'black'
    },
    selectedButtonText: {
        color: 'white'
    },
    confirmButton: {
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
    confirmButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    picture: {
        //width: width/2,
        //height: height/2,
        width: 209,
        height: 225,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'center'
    },
    errorText: {
        color: 'red',
        marginBottom: 0
    },
});

export default BusinessSignUp;
