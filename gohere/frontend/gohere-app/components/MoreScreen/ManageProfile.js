import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageProfile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedOption, setSelectedOption] = useState('None');
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    });

    useEffect(() => {
        // Fetch the stored data when the component mounts
        const fetchData = async () => {
            try {
                const storedFirstName = await AsyncStorage.getItem('firstName');
                const storedLastName = await AsyncStorage.getItem('lastName');
                const storedDisease = await AsyncStorage.getItem('disease');
                
                if (storedFirstName !== null) {
                    setFirstName(storedFirstName);
                }
                if (storedLastName !== null) {
                    setLastName(storedLastName);
                }
                if (storedDisease !== null) {
                    setSelectedOption(storedDisease);
                }
            } catch (error) {
                // Error retrieving data
                console.log(error);
            }
        };
    
        fetchData();
    }, []);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const handleConfirm = async () => {
        try {
            // Save the data when the user confirms
            await AsyncStorage.setItem('firstName', firstName);
            await AsyncStorage.setItem('lastName', lastName);
            await AsyncStorage.setItem('disease', selectedOption);
            Alert.alert("Profile Updated", "Your profile has been successfully updated.");
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    };


    const handlePress = (condition) => {
        setSelectedOption(condition);
    };

    // Determine button style based on whether it's selected
    const getButtonStyle = (option) => [
        styles.button,
        selectedOption === option && styles.selectedButton
    ];

    // Determine text style based on whether it's selected
    const getTextStyle = (option) => [
        styles.buttonText,
        selectedOption === option && styles.selectedButtonText
    ]

    const options = ['Crohn\'s disease', 'Ulcerative colitis', 'None'];
    
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.content}>
                        {/* <View style={styles.headingContainer}>
                            <TouchableOpacity>
                                <Image style={styles.back} source={require("../assets/back-icon.png")}/>
                            </TouchableOpacity>
                            <Text style={styles.heading}>Manage Profile</Text>
                        </View> */}
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setFirstName}
                            value={firstName}
                        />
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setLastName}
                            value={lastName}
                        />
                        
                        <Text style={styles.label}>Health Condition</Text>
                        <View>
                            {options.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() => handlePress(option)}
                                    style={[getButtonStyle(option) ]}
                                    >
                                    <Text style={[getTextStyle(option)]}>
                                        {option}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirm</Text>
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
        flex: 1
    },
    headingContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20
    },
    back:{
        width: width*0.08,
        height: width*0.08,
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
    selectedButtonText:{
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
});

export default ManageProfile;
