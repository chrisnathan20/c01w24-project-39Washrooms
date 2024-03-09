import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

const EnterAddressForm = () => {
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
    
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.content}>
                        <Text style={styles.label}>Name of Place<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={name}
                            value={setName}
                        />
                        <Text style={styles.label}>Address<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAddress}
                            value={address}
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
                            onChangeText={setZipcode}
                            value={zipcode}
                        />
                        <Text style={styles.label}>City<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCity}
                            value={city}
                        />
                        <Text style={styles.label}>Province<Text style={styles.required}>*</Text></Text>
                        <Picker
                            selectedValue={province}
                            onValueChange={(itemValue, itemIndex) => setProvince(itemValue)}
                            mode="dropdown" // or "dropdown", depending on your preference
                            style={styles.pickerStyle}>
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
                    <TouchableOpacity style={styles.nextButton} onPress={handleConfirm}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
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
