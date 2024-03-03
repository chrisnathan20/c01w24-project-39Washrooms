// Import necessary React, React Native components, and AsyncStorage for local storage.
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, StyleSheet, SafeAreaView, Linking, TouchableOpacity, Image } from 'react-native';

function CardScreenTest() {

    // State to store the disease value
    const [disease, setDisease] = useState('');

    // Asynchronous function to retrieve the disease value stored in AsyncStorage.
        const getUserDisease = async () => {
            try {
                const storedDisease = await AsyncStorage.getItem('disease');
                if (storedDisease !== null) {
                    setDisease(storedDisease);
                }
                else{
                    setDisease("Crohn's Disease");
                }
            } catch (error) {
                console.error('Error reading data from AsyncStorage:', error);
            }
        };

    // Effect hook to call the getUserDisease function when the component mounts.
    useEffect(() => {
        getUserDisease();
    }, []);

    // Function to handle press on the CCC (Crohn's and Colitis Canada) button/link.
    const handleCCCPress = () => {
        const url = 'https://crohnsandcolitis.ca/About-Us';

        Linking.openURL(url)
            .catch((err) => console.error('A linking error occurred', err));

    }

    // Function to handle press on the Program button/link.
    const handleProgramPress = () => {
        const url = 'https://crohnsandcolitis.ca/gohere';

        Linking.openURL(url)
            .catch((err) => console.error('A linking error occurred', err));
        
    }


    var disclaimerHeading = "";
    var disclaimerEng = "";
    //If the disease state is not null then storing the corresponding disease name and disclaimer
    //to print in the return function
    if(disease !== null){
        const diseaseName = disease.split(' '); 
        var useDiseaseName = "Crohn's";
        if(diseaseName[0] !== "Crohn's"){
            useDiseaseName = diseaseName[1];
        }

        disclaimerHeading = <Text style={styles.diseaseHeading}>{disease}</Text>;
        disclaimerEng = <Text style={styles.diseaseDisclaimer}>I live with {useDiseaseName}, a medical condition requiring urgent use of the washroom.
        Thank you for your understanding and cooperation.</Text>;

    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
            {disclaimerHeading}
            {disclaimerEng}
            </View>

            <TouchableOpacity style={styles.button1Container} onPress={handleCCCPress}>
                <View style={styles.buttonContent}>
                    <Image source={require('../assets/CCC_logo.png')} style={styles.button1Image} />      
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2Container} onPress={handleProgramPress}>
                <View style={styles.buttonContent}>
                    <Image source={require('../assets/GoHereProgram.png')} style={styles.button2Image1} />
                </View>
                <View>
                    <Image source={require('../assets/GoHere_logo.png')} style={styles.button2Image2} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProgramPress}>
                
            </TouchableOpacity>
        </SafeAreaView>
    );
};

//Stylesheet to style the component's UI
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexGrow: 1
    },

    button1Container: {
        marginTop: 50,
        width: 300,
        height: 63,
        backgroundColor: 'white',
        marginLeft: 45,
        marginRight: 50,
        borderRadius: 7,
        borderColor: '#afb3b0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5, 
        marginHorizontal: 20,

    },

    button2Container: {
        marginTop: 20 ,
        width: 300,
        height: 63,
        backgroundColor: 'white',
        marginLeft: 45,
        marginRight: 50,
        borderRadius: 7,
        borderColor: '#afb3b0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5, 
        marginHorizontal: 20,
        

    },

    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    button1Image: {
        width: 190,
        height: 29,
        marginTop: 16,
    },
    button2Image1: {
        width: 195,
        height: 24,
        marginTop: 21,
        marginRight: 28,  
    },
    button2Image2: {
        width: 29, 
        height: 34, 
        bottom: 30,
        marginLeft:228   
    },
    diseaseHeading: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
        paddingTop: 400,
        paddingHorizontal: 26   
    },
    diseaseDisclaimer: {
        justifyContent: 'center',
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
        paddingTop: 10,
        paddingHorizontal: 28  
    },
});

export default CardScreenTest;
