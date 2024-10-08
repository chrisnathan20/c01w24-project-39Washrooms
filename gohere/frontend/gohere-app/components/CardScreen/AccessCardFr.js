import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function AccessCard({navigation}) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [disease, setDisease] = useState('None');
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    });

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
                setDisease(storedDisease);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const renderDiseaseText = () => {
        if (disease === "Crohn's disease") {
            return 'Maladie de Crohn';
        } else if (disease === "Ulcerative colitis") {
            return 'Colite ulcéreuse';
        } else {
            return disease
        }
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image style={styles.cardImage} source={require('../../assets/card-image.png')} resizeMode="cover"/>
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.subheading_text, {fontSize: 15, marginTop: disease === 'None' ? 12 : 5}]}>Toilette</Text>
                <Text style={[styles.heading_text, {marginTop: disease === 'None' ? 5 : 0}]}>Carte d'accès</Text>
               {/* if disease if not none show the disease */}
               {disease !== 'None' && (
                    <View style={styles.outerBorder}>
                        <Text style={[styles.paragraph_text, styles.borderedText]}>{renderDiseaseText()}</Text>
                    </View>
                )}
                <Text style={[styles.subheading_text, {fontSize: 16, marginTop: disease === 'None' ? 20 : 5}]}>{firstName} {lastName}</Text>
                <Text style={[styles.paragraph_text,  {marginTop: disease === 'None' ? 5 : 0}]}>Veuilliez m'aider. Je nécessite un accés urgent aux toilettes.</Text>
            </View>
        </View>
    );
}

// Toilette
// Carte d'accès
// Veuilliez m'aider. Je nécessite un accés urgent aux toilettes.

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#DA5C59',
        flexDirection: 'row',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 5, 
        height: 200,
        elevation: 5, 
        height: 200,
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: "column",
        justifyContent:"center"
    },
    borderedText: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 5,
        paddingTop: 8,
        paddingBottom: 5,
        paddingLeft: 18,
        paddingRight: 18,
        //unknown padding on bottom
        fontWeight: 500,
        fontSize: 13,
    },

    outerBorder: {
        alignSelf: 'flex-start',
    },
    cardImage: {
        height: '100%',
        width: 100,
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
    },
    heading_text: {
        fontSize: 22,
        fontFamily: 'Poppins-Medium',
        color: 'white',
        textAlign: 'left',
        lineHeight: 25,
    },
    subheading_text: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: 'white',
        textAlign: 'left',
        lineHeight: 23,
    },
    paragraph_text: {
        fontSize: 11.5,
        fontFamily: 'Poppins-Medium',
        color: 'white',
        textAlign: 'left',
    }

});


