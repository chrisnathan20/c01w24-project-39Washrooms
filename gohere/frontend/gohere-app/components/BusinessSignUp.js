import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '../env.js'; // Import the server URL from the .env file
import { useFonts } from 'expo-font';
import { NativeEventEmitter } from 'react-native';


const BusinessSignUp = () => {
    const eventEmitter = new NativeEventEmitter();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    //Start as true and if info isn't valid, set to false
    const [validSignUp, setValidSignUp] = useState(true);
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    });
    
    const handleCheckSignUp = () => {
        //reset default value
        setValidSignUp(true);
        resetErrorMessage();


        if (email == "") {
            //setEmailError("Field required");
            setValidSignUp(false);
            setConfirmPasswordError("Field requirements not met");
        } else {
            //Check if valid email
            const emailRegex = /^\S+@\S+\.\S+$/;
            const isValidEmail = emailRegex.test(email);

            if (!isValidEmail) {
                //setEmailError("Invalid email");
                setValidSignUp(false);
                setConfirmPasswordError("Field requirements not met");
            }
        }

        if (password == "") {
            //setPasswordError("Field required");
            setConfirmPasswordError("Field requirements not met");
            setValidSignUp(false);
        } else {
            //Check if password is valid
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            const isValidPassword = passwordRegex.test(password);

            if (!isValidPassword) {
                //setPasswordError("Password does not meet all requirements");
                setValidSignUp(false);
                setConfirmPasswordError("Field requirements not met");
            }
        }
        //Check if confirm password matches
        if (confirmPassword == "") {
            //setConfirmPasswordError("Field required");
            setValidSignUp(false);
            setConfirmPasswordError("Field requirements not met");
        } else if (confirmPassword != password) {
            //setConfirmPasswordError("Passwords don't match");
            setValidSignUp(false);
            setConfirmPasswordError("Field requirements not met");
        }

        if (name == "") {
            //setNameError("Field required");
            setValidSignUp(false);
            setConfirmPasswordError("Field requirements not met");
        }
        
        //If all fields are filled in and valid
        if (validSignUp) {
            resetErrorMessage();
            handleValidSignUp();
        }
    }

    const handleValidSignUp = async () => {
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/signup?_=${new Date().getTime()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    businessName: name
                })
            });

            if (!response.ok) { //If we get a 400
                if (response.status == 401) {
                    setConfirmPasswordError("Field requirements not met");
                } else if (response.status==400){
                    setEmailError("Email already used");
                } else {
                    console.log(`Response not okay: ${response.status}`);
                }
                return; // Exit function if the request was not successful
            }

            if (response.status == 201) {
                //gets token and stores it in local storage
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
            console.error('Error signing up:', error);
        }
    };

    const togglePasswordInfo = () => {
        setShowPasswordInfo(!showPasswordInfo);
    }

    const resetErrorMessage = () => {
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setNameError("");
    }
    
    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (

        <View style={styles.container}>
            <Image style={styles.picture} source={require("../assets/business-signup-page.png")} />
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

                        <Text style={styles.label}>Business Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setName}
                            value={name}
                            autoCapitalize="none"
                        />
                        <Text style={styles.errorText}>{nameError}</Text>

                        <View style={styles.passwordInfo}>
                            <Text style={styles.label}>Password<Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity onPress={togglePasswordInfo} >
                                <Text style={styles.infoButton}>Password Requirements</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize="none"
                        />

                        <Text style={styles.errorText}>{passwordError}</Text>


                        <Text style={styles.label}>Confirm Password<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            autoCapitalize="none"
                        />

                        <Text style={styles.errorText}>{confirmPasswordError}</Text>

                        <TouchableOpacity style={styles.signUpButton} onPress={handleCheckSignUp}>
                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <Modal
                visible={showPasswordInfo}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Password Requirements</Text>
                        <Text>- Must be 6-16 characters long</Text>
                        <Text>- Must contain at least one character</Text>
                        <Text>- Must contain at least one digit (0-9)</Text>
                        <Text>- Must contain at least one special character (!@#$%^&*)</Text>
                        <TouchableOpacity onPress={togglePasswordInfo}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 8,
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
    signUpButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
        marginTop: 15,
        height: 48
    },
    signUpButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    picture: {
        width: 209 / 1.5,
        height: 225 / 1.5,
        marginVertical: 3,
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'center'
    },
    errorText: {
        color: 'red',
        marginBottom: 15
    },

    infoButton: {
        textAlign: 'right',
        fontSize: 11,
        color: '#5E6366',
        textDecorationLine: 'underline'
    },
    passwordInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        //backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        width: '80%',
        borderWidth: 2,
        borderColor: '#DA5C59',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    closeButton: {
        color: '#DA5C59',
        marginTop: 10,
        textAlign: 'right'
    },
});

export default BusinessSignUp;
