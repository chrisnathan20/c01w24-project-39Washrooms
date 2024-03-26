import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '../../../env.js';
import { useFocusEffect } from '@react-navigation/native';
import { NativeEventEmitter } from 'react-native';


const BOManageProfile = () => {
    const eventEmitter = new NativeEventEmitter();

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });
    const [name, setName] = useState("This is test text");
    const [email, setEmail] = useState("")
    const [details, setDetails] = useState("");
    const [sponsorship, setSponsorship] = useState("null");
    const [visible, setVisible] = useState(true); //disable changing details
    
    useFocusEffect(
        React.useCallback(() => {

            async function fetchData() {
                await getDetails();
                await getSponsorship();
            }
            fetchData();

        }, [])
    );

    const getSponsorship = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getSponsorship`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) { //If there is an issue with the token, delete it
                console.log(`Response not okay: ${response.status}`);
                return;
            }

            const data = await response.json();
            const sponsor = data.response;
            setSponsorship(sponsor);
            if (sponsor == "null" || sponsor == "bronze") {
                setVisible(true);

            } else {
                setVisible(false);
            }
        } catch (error) {
            console.error("Error:" + error);
            return;
        }
    }

    const getDetails = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getData`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) { //If there is an issue with the token, delete it
                console.log(`Response not okay: ${response.status}`);
                return;
            }

            const data = await response.json();

            setName(data.response.rows[0].businessname);
            setEmail(data.response.rows[0].email);
            if (data.response.rows[0].description == null) {
                setDetails("");
            } else {
                setDetails(data.response.rows[0].description);
            }

        } catch (error) {
            console.error("Error:" + error);
            return;
        }

    }

    const handleSave = async () => {
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/description`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    details: details
                })
            });

            if (!response.ok) {
                console.log(`Response not okay: ${response.status}`);
                return;
            }
            eventEmitter.emit('updateName');
            console.log("Details saved successfully!");
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    const clearName = () => {
        setName("")
    }
    const clearDetails = () => {
        setDetails("")
    }

    if (!fontsLoaded && !fontError) {
        return null;
    }


    return (
        <View style={styles.container}>

            <View style={styles.inputContainer}>

                <Text style={styles.text}>Change Name</Text>
                <AntDesign
                    name="closecircle"
                    size={20}
                    color={name.length == 0 ? "#9D9D9D" : "#5A5A5A"}
                    onPress={clearName}
                    disabled={name.length == 0}
                />

            </View>
            <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                maxLength = {30}

            />
            <Text style={styles.counter}>{name.length}/30</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.text}>My Details</Text>
                <AntDesign
                    name="closecircle"
                    size={20}
                    color={details.length == 0 ? "#9D9D9D" : "#5A5A5A"}
                    onPress={clearDetails}
                    disabled={details.length == 0} // Disable the icon when text is empty
                />
            </View>
            <View style={styles.descriptionContainer}>
                <TextInput
                    style={styles.description}
                    //If sponsorship is not valid, don't show any description
                    value={(sponsorship == "null" || sponsorship == "bronze") ? null : details}

                    onChangeText={setDetails}
                    maxLength = {100}
                    autoCapitalize="none"
                    multiline={true}
                    editable={(sponsorship == "null" || sponsorship == "bronze") ? false : true}
                />
                
                {visible && (
                    <AntDesign
                        name="lock"
                        style={styles.lock}
                        size={20}
                        color={"#5A5A5A"}
                    />
                )}

            </View>
            {visible && (
                <Text style={styles.unlocktext}>Become a <Text style={styles.silver}>SILVER</Text> sponsor to unlock additional details.</Text>
            )}
            {!visible && (
                <Text style={styles.counter}>{details.length}/100</Text>

            )}
        
            {!visible && (
                
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

            )}




        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    silver: {
        color: "#A4A4A4",
        fontWeight: 'bold',
    },
    unlocktext: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
    },
    counter: {
        textAlign: 'right',
        paddingBottom: 10,

    },
    lock: {
        position: 'absolute'
    },
    descriptionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    description: {
        flex: 1,
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 8,
        fontSize: 16,
        borderRadius: 8,
        height: 44,
        textAlignVertical: 'top',
    },

    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        marginBottom: 2
    },
    inputContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingTop: 15,
    },

    nameInput: {
        //flex: 1,
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 8,
        fontSize: 16,
        borderRadius: 8,
        height: 44,

    },
    saveButton: {
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
    saveButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },


})

export default BOManageProfile;
