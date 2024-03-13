import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

const EnterAddressForm = ({ navigation, route }) => {
    const [locationName, setlocationName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [postalCode, setpostalCode] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const handleNext = async () => {
        // Check if any of the required fields are empty
        if (!locationName || !address1 || !postalCode || !city || !province) {
            // Show a UI alert
            alert('Please fill out all required fields');
            return;
        }
        const additionalData = {
            locationName,
            address1,
            address2,
            postalCode,
            city,
            province
        };
        console.log(route.params);
        console.log({
            ...route.params,
            ...additionalData
        });
        navigation.navigate('Edit Hours', {
            ...route.params,
            ...additionalData
        });
    };
    
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.content}>
                        <Text style={styles.label}>Name of Place<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setlocationName}
                            value={locationName}
                        />
                        <Text style={styles.label}>Address<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAddress1}
                            value={address1}
                        />
                        <Text style={styles.label}>Address 2</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAddress2}
                            value={address2}
                        />
                        <Text style={styles.label}>Zip Code<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setpostalCode}
                            value={postalCode}
                        />
                        <Text style={styles.label}>City<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCity}
                            value={city}
                        />
                        <Text style={styles.label}>Province<Text style={styles.required}>*</Text></Text>
                        <View style={{ borderWidth: 1, borderColor: '#5E6366', borderRadius: 10, padding: 2}}>
                            <Picker
                                selectedValue={province}
                                onValueChange={(itemValue, itemIndex) => setProvince(itemValue)}
                                mode="dropdown" // or "dropdown", depending on your preference
                                style={styles.pickerStyle}>
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="ON" value="ON" />
                                <Picker.Item label="QC" value="QC" />
                                <Picker.Item label="NS" value="NS" />
                                <Picker.Item label="NB" value="NB" />
                                <Picker.Item label="MB" value="MB" />
                                <Picker.Item label="BC" value="BC" />
                                <Picker.Item label="PE" value="PE" />
                                <Picker.Item label="SK" value="SK" />
                                <Picker.Item label="AB" value="AB" />
                                <Picker.Item label="NL" value="NL" />
                            </Picker>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next</Text>
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
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#DA5C59',
    },
    input: {
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        borderRadius: 8,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        marginBottom: 2
    },
    required: {
        color: 'red'
    },
    pickerStyle: {
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
    nextButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59', 
        borderColor: '#DA5C59', 
    },
    nextButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
});

export default EnterAddressForm;
