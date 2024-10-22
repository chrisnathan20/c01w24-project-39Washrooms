import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, LayoutAnimation, SafeAreaView, Linking, Image } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AccessCard from './AccessCard';
import AccessCardFr from './AccessCardFr';
import { useFocusEffect } from '@react-navigation/native';

export default function CardScreenTest({ navigation }) {
    const [isFrench, setisFrench] = React.useState(false);
    const [disease, setDisease] = useState('None');

    //Loading fonts
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    });

    const activeColor = '#DA5C59';
    const inactiveColor = '#EDEDED';

    //toogle for french info
    const handleToggle = () => {
        LayoutAnimation.easeInEaseOut();
        setisFrench(!isFrench);
    };

    // Asynchronous function to retrieve the disease value stored in AsyncStorage.
    const getUserDisease = async () => {
        try {
            const storedDisease = await AsyncStorage.getItem('disease');
            if (storedDisease !== null) {
                setDisease(storedDisease);
            }
        } catch (error) {
            console.error('Error reading data from AsyncStorage:', error);
        }
    };

    // Effect hook to call the getUserDisease function when the component mounts.
    useEffect(() => {
        getUserDisease();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getUserDisease();
        }, [])
    );

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

    const renderDiseaseTextFr = () => {
        if (disease === "Crohn's disease") {
            return 'Maladie de Crohn';
        } else if (disease === "Ulcerative colitis") {
            return 'Colite ulcéreuse';
        } else {
            return disease
        }
    };

    const renderUseDiseaseName = () => {
        if (disease === "Crohn's disease") {
            return "Crohn's";
        } else if (disease === "Ulcerative colitis") {
            return "Colitis";
        }
    }

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={styles.cardPageContainer}>
            <View style={styles.cardHeader}>
                <Text style={styles.heading_text}>{isFrench ? "Carte d'accès" : 'Access Card'}</Text>

                <TouchableOpacity
                    style={styles.toggle}
                    onPress={handleToggle}
                >
                    <View
                        style={[
                            styles.toggleInView,
                            {
                                backgroundColor: isFrench ? inactiveColor : activeColor,
                                justifyContent: 'center'
                            }
                        ]}
                    >
                        <Text style={[styles.toggleLabel, { color: isFrench ? '#DA5C59' : 'white' }]}>en</Text>
                    </View>

                    <View
                        style={[
                            styles.toggleInView,
                            {
                                backgroundColor: isFrench ? activeColor : inactiveColor,
                                justifyContent: 'center'
                            }
                        ]}
                    >
                        <Text style={[styles.toggleLabel, { color: isFrench ? 'white' : '#DA5C59' }]}>fr</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {isFrench ? <AccessCardFr /> : <AccessCard />}

            {disease !== 'None' && (
                <View>
                    <Text style={styles.diseaseHeading}>{isFrench ? renderDiseaseTextFr() : disease}</Text>
                    <Text style={styles.diseaseDisclaimer}>
                        {isFrench
                            ? `Je vis avec ${renderUseDiseaseName()}, un problème de santé nécessitant une utilisation urgente des toilettes. Merci de votre compréhension et de votre coopération.`
                            : `I live with ${renderUseDiseaseName()}, a medical condition requiring urgent use of the washroom. Thank you for your understanding and cooperation.`}
                    </Text>
                </View>
            )}

            <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
            <TouchableOpacity style={[styles.button1Container, { bottom: disease === 'None' ? -150 : 0 }]} onPress={handleCCCPress}>
                <View style={styles.buttonContent}>
                    <Image source={require('../../assets/CCC_logo.png')} style={styles.button1Image} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button2Container, { bottom: disease === 'None' ? -150 : 0 }]} onPress={handleProgramPress}>
                <View style={styles.buttonContent}>
                    <Image source={require('../../assets/GoHereProgram.png')} style={styles.button2Image1} />
                </View>
                <View>
                    <Image source={require('../../assets/GoHere_logo.png')} style={styles.button2Image2} />
                </View>
            </TouchableOpacity>
            </View>
        </View>
    );
}

//Stylesheet to style the component's UI
const styles = StyleSheet.create({
    cardPageContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },

    heading_text: {
        fontFamily: 'Poppins-Bold',
        fontSize: 25,
        color: '#DA5C59',
        textAlign: 'left',
        marginTop: 25,
        marginBottom: 25,
    },

    button1Container: {
        marginTop: 20,
        width: 300,
        height: 63,
        backgroundColor: 'white',
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
    },

    button2Container: {
        marginTop: 20,
        width: 300,
        height: 63,
        backgroundColor: 'white',
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
        marginLeft: 228
    },

    diseaseHeading: {
        justifyContent: 'center',
        fontSize: 20,
        color: 'black',
        textAlign: 'left',
        paddingTop: 50,
        fontFamily:'Poppins-Medium'
    },

    diseaseDisclaimer: {
        justifyContent: 'center',
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
        paddingTop: 5,
        fontFamily:'Poppins-Regular'

    },

    toggle: {
        height: 40,
        width: 120,
        borderRadius: 5,
        borderWidth: 5,
        borderColor: '#EDEDED',
        backgroundColor: '#EDEDED',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'stretch', 
    },

    toggleInView: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    toggleLabel: {
        marginTop: 1,
        fontSize: 16,
        fontFamily:'Poppins-Bold'
    },
});

