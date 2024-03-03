import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccessCard() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [disease, setDisease] = useState('None');

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
                    setDisease(storedDisease);
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        
    }, []);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image style={styles.cardImage} source={require('../assets/card-image.png')} resizeMode="cover"/>
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.subheading_text, {fontSize: 17, fontWeight: 500}]}>Washroom</Text>
                <Text style={[styles.heading_text]}>Access Card</Text>
                <View style={styles.outerBorder}>
                    <Text style={[styles.paragraph_text, styles.borderedText]}>{disease}</Text>
                </View>
                <Text style={[styles.subheading_text, {fontSize: 20}]}>{firstName} {lastName}</Text>
                <Text style={styles.paragraph_text}>Please help. I require urgent access to a washroom.</Text>
            </View>
        </View>
    );
}

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
    },
    textContainer: {
        flex: 1,
        //justifyContent:'center',
        padding: 15,
    },
    borderedText: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        margin: 10,
        marginBottom: 5,
        padding: 10,
        fontWeight: 500,
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
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    paragraph_text: {
        fontSize: 14,
        color: 'white',
        textAlign: 'left',
    },
    subheading_text: {
        fontSize: 15,
        color: 'white',
        textAlign: 'left',
        marginTop: 5,
        marginBottom: 5,
    },

});

