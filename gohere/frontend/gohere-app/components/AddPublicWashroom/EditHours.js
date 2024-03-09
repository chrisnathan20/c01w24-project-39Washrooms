import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

const EditHours = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const handleConfirm = async () => {
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
        <ScrollView style={styles.container}>

        </ScrollView>
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
    pickerStyle: {
        padding: 10,
        marginBottom: 30,
        fontSize: 16,
        backgroundColor: '#fff', // Assuming you want a white background
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

export default EditHours;
