import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import BOView from './BOView';
import { GOHERE_SERVER_URL } from '@env'; // Import the server URL from the .env file

const BusinessSignUp = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [showPasswordInfo, setShowPasswordInfo] = useState(false);

    const [test, setTest] = useState(false);

    const navigation = useNavigation();

    const handleSignUp = () => {

        //If invalid passowrd, should the confirm password error also come up? No
        //Step One - see if email is valid
        const emailRegex = /^\S+@\S+\.\S+$/;
        const isValidEmail = emailRegex.test(email);
        setEmailError(!isValidEmail);

        //Check if password is valid
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        const isValidPassword = passwordRegex.test(password);
        setPasswordError(!isValidPassword);

        //Check if confirm password matches
        if (confirmPassword == "" || confirmPassword != password) {
            setConfirmPasswordError(true);
        }

        if (name == "") {
            setNameError(true);
        }

        //If all fields are filled in and valid
        if (isValidEmail && isValidPassword && password == confirmPassword && name != "") {
            setTest("everything is valid")
            handleValidSignUp();
        }


        //Step Two - if valid, check if account already exists with the email
        //Step Three - Create account and go to BO View

        /*

        Questions:
        - change font size of Business Account Sign Up or all font sizes?
        - When to pop up the red *

        //Alert.alert("Profile Updated", "Your profile has been successfully updated.");
        */

    }
    const handleValidSignUp = async () => {
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businesssignup?_=${new Date().getTime()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    businessName: name,
                    sponsorship: '', // Add the sponsorship field value if needed
                    icon: null, // Add the icon field value if needed
                    imageOne: null, // Add the imageOne field value if needed
                    imageTwo: null, // Add the imageTwo field value if needed
                    imageThree: null, // Add the imageThree field value if needed
                    description: '' // Add the description field value if needed
                })
            });

            if (!response.ok) {
                //setTest(`SIGN UP FAILED: ${response.status}`);
                //return; // Exit function if the request was not successful
            }

            // Proceed with navigation or other actions upon successful sign-up
            navigation.navigate('BOView');

        } catch (error) {
            if (error == 'Email already exists') {
                setTest(`email already used`);
            } else {
                setTest('SIGN UP FAILED: Internal server error');
            }
            console.error('Error signing up:', error);
        }
        //Step Two - if valid, check if password matches
        //Step Three - Create account and go to BO View

        //navigation.navigate('BOView');
    };


    const togglePasswordInfo = () => {
        setShowPasswordInfo(!showPasswordInfo);
    }


    //{emailError && <Text>Invalid email format</Text>}
    //<Image style={styles.picture} source={require("../assets/business-signup-page.png")} />
    return (
        <View style={styles.container}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.content}>
                        <Text>TEST MSG: {test}</Text>
                        <Text style={styles.label}>Email<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            autoCapitalize="none"
                        />
                        {/* Render error message if email is invalid */}
                        {emailError && <Text style={styles.errorText}>Invalid Email Format</Text>}
                        {!emailError && <Text style={styles.errorText}></Text>}

                        <Text style={styles.label}>Business Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setName}
                            value={name}
                            autoCapitalize="none"
                        />
                        {nameError && <Text style={styles.errorText}>Please fill out all fields</Text>}
                        {!nameError && <Text style={styles.errorText}></Text>}

                        <Text style={styles.label}>Password<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize="none"
                        />


                        <TouchableOpacity onPress={togglePasswordInfo}>
                            <Text style={styles.infoButton}>Password Requirements</Text>
                        </TouchableOpacity>



                        {passwordError && <Text style={styles.errorText}>Password does not meet all requirements </Text>}
                        {!passwordError && <Text style={styles.errorText}></Text>}


                        <Text style={styles.label}>Confirm Password<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            autoCapitalize="none"
                        />
                        {confirmPasswordError && <Text style={styles.errorText}>Passwords do not match</Text>}
                        {!confirmPasswordError && <Text style={styles.errorText}></Text>}
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleSignUp}>
                        <Text style={styles.confirmButtonText}>Sign Up</Text>
                    </TouchableOpacity>
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
                        <Text>- Must contain 1 uppercase and 1 lowercase</Text>
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
        //paddingTop: 4
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
        padding: 10,
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
        marginBottom: 15
    },

    infoButton: {
        textAlign: 'right',
        fontSize: 11,
        color: '#5E6366',
        textDecorationLine: 'underline'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%'
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
    }
});

export default BusinessSignUp;
