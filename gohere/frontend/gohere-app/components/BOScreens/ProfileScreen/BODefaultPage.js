import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { NativeEventEmitter } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { GOHERE_SERVER_URL } from '../../../env.js';
const BODefaultPage = () => {
    const [name, setName] = useState("");
    const navigation = useNavigation();
    const [sponsorship, setSponsorship] = useState("null");

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    const [colour, setColour] = useState("#5A5A5A");

    const eventEmitter = new NativeEventEmitter();
    //When creating other pages:
    //Make a <Stack.Screen name='exampleName' component={YourComponent}/> in MoreScreen.js
    //Add something like () => { navigation.navigate('YourScreenName') } to the onPress below
    const buttons = [
        { text: "Manage Profile", img: require("../../../assets/bo-manage-profile.png"), onPress: () => { navigation.navigate('Manage Profile') } },
        { text: "Manage Images", img: require("../../../assets/manage-images.png"), onPress: () => { navigation.navigate('Manage Images') } },
        { text: "Manage Banner", img: require("../../../assets/manage-banner.png"), onPress: () => { navigation.navigate('Manage Banner') } },
        { text: "Privacy Policy", img: require("../../../assets/bo-privacy-policy.png"), onPress: () => { navigation.navigate('Privacy Policy') } },
        { text: "Logout", img: require("../../../assets/logout.png"), onPress: () => { eventEmitter.emit('logout') } },
    ]

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                //await getName();
                await getSponsorship();
            }
            fetchData();

        }, [])
    );
    useEffect(() => {
        async function fetchData() {
            //await getName();
            //await getSponsorship();
        }
        fetchData();

    }, []);


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

        } catch (error) {
            console.error("Error:" + error);
            return;
        }
    }
    const getName = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getName`, {
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
            const name = data.response.rows[0].businessname;
            setName(name);
        } catch (error) {
            console.error("Error:" + error);
            return;
        }

    }

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={styles.container}>
            {buttons.map((btn, index) => {

                const disabled = (sponsorship != "ruby" && btn.text == "Manage Banner") || (sponsorship == "null" || sponsorship == "bronze") && btn.text == "Manage Images";
                return (
                    <View>

                        <TouchableOpacity key={index} style={styles.buttonContainer}
                            onPress={disabled ? null : btn.onPress}
                            disabled={disabled}>

                            <View style={styles.imagetext}>
                                <Image style={[styles.picture, { tintColor: disabled ? "#9D9D9D" : "#5A5A5A" }]} source={btn.img} />
                                <Text style={[styles.text, { color: disabled ? "#9D9D9D" : "#5A5A5A" }]}>{btn.text}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={disabled ? null : btn.onPress}
                            disabled={disabled}>
                            <View style={styles.arrowContainer}>
                                <AntDesign name="right" size={20} color="black" style={{ position: 'absolute', bottom: 15, left: 330 }} />
                            </View>
                        </TouchableOpacity>
                    </View>

                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexBasis: '50%',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    img: {
        height: 30,
        width: 30,
    },
    buttonContainer: {
        //flexDirection: 'row', // Align items horizontally
    //alignItems: 'center', // Center items vertically
        //justifyContent: 'space-between',
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    icon: {
        width: 70,
        height: 70,
        marginBottom: 5,
        alignSelf: 'center'
    },
    imagetext: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    picture: {
        marginRight: 20,
        height: 30,
        width: 30,
        //tintColor: '#9D9D9D'
    },
    arrowContainer: {
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    text: {
        paddingTop: 15,
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        lineHeight: 27,
        marginBottom: 15,
        fontWeight: 'bold',
        marginRight: 50,

    },
    welcomeText: {
        paddingTop: 15,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#DA5C59'
    },
    nameText: {
        paddingTop: 5,
        lineHeight: 27,
        marginBottom: 15,
        fontWeight: 'bold',
        marginRight: 25,
        fontStyle: 'normal',
        fontSize: 30,
        color: '#DA5C59'
    },
    imgContainer: {
        flexDirection: 'row',
    },
});
export default BODefaultPage;
