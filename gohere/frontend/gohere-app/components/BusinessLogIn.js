import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '@env'; // Import the server URL from the .env file
import { NavigationContainer, useNavigation } from '@react-navigation/native';



const BusinessSignUp = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [storedPassword, setStoredPassword] = useState("");
    const [test, setTest] = useState("");

    const handleLogin = async () => {
        //Step One - see if email has an account
        try {
            setTest (`1`);
            const response = await fetch(`${GOHERE_SERVER_URL}/businesslogin?email=${email}&_=${new Date().getTime()}`);
            setTest (`2`);
            if (!response.ok){
                setTest (`LOGIN FAILED: ${response.status}`);
            }

            setTest (`LOGIN: ${response.status}`);
            const data = await response.json();
            //setTest (`stored password: ${data.password}`);
            setTest (`something happened`);
            if (data) {
                setStoredPassword(data.password);
            }
        } catch (error){
           //setTest (`LOGIN FAILED: ${response.status}`);
           setTest (`LOGIN:` + error.message);
           
        }
        //setTest (`test`);
        //setTest (`LOGIN: ${response.status}`);
        //setTest (`LOGIN: ${response.status}`);
        //Step Two - if valid, check if password matches
        //Step Three - Create account and go to BO View
        if (storedPassword == password){
            navigation.navigate('BOView');
        } else {
            //setTest ("LOGIN FAILED");
        }
        /*

        Questions:
        - change font size of Business Account Sign Up or all font sizes?
        - When to pop up the red *

        //Alert.alert("Profile Updated", "Your profile has been successfully updated.");
        */
    }

    /*
        const fetchMarkers = async (coords) => {
            try {
              const response = await fetch(`${GOHERE_SERVER_URL}/nearbywashrooms?latitude=${coords.latitude}&longitude=${coords.longitude}&_=${new Date().getTime()}`);
              const data = await response.json();
              if (data) {
                setMarkers(data.map(marker => ({
                  ...marker,
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                  displayDistance: marker.distance < 1000 ? `${marker.distance} m` : `${(marker.distance / 1000).toFixed(1)} km`
                })));
              }
            } catch (error) {
              console.error('Error fetching markers:', error);
            }
          };
    */
    // <Image style={styles.picture} source={require("../assets/business-login-page.png")} />
    return (
        <View style={styles.container}>
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
                        <Text style={styles.label}>Password<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize="none"
                            secureTextEntry={true}
                        />
                        <Text>Test message: {test}</Text>
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
    },
    innerContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 15
    },
    content: {
        // flex: 1
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
        padding: 10,
        marginBottom: 25,
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
        padding: 10,
        marginTop: 25,
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
    }
});

export default BusinessSignUp;