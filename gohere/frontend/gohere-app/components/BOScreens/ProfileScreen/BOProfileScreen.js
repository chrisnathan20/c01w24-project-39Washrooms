import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '../../../env.js';
import { NativeEventEmitter } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';
import BODefaultPage from './BODefaultPage.js';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BOManageProfile from './BOManageProfile.js';
import BOPrivacyPolicy from './BOPrivacyPolicy.js';

const BOProfileScreen = () => {
    const [name, setName] = useState("");
    const eventEmitter = new NativeEventEmitter();
    const clickable = "#5A5A5A";
    const notClickable = "#9D9D9D";

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    const [email, setEmail] = useState("");
    const [colour, setColour] = useState("");
    const [sponsorship, setSponsorship] = useState("null");
    const [disableImages, setDisableImages] = useState(true);
    const Stack = createStackNavigator();

    const pageOptions = {
        headerTitleStyle: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 30,
            color: '#DA5C59',
        },
        headerTintColor: '#DA5C59',
        headerShadowVisible: false,
        cardStyle: { backgroundColor: '#FFFFFF' }
    }


    useFocusEffect(
        React.useCallback(() => {

            async function fetchData() {
                await getName();
                await getSponsorship();
            }
            fetchData();


        }, [])
    );

    useEffect(() => {

    }, []);


    const updateAccess = (sponsor) => {
        //Change colour based on sponsor
        if (sponsor == "null") {
            setColour("#5A5A5A");
        } else if (sponsor == "bronze") {
            setColour("#C0492E");
        } else if (sponsor == "silver") {
            setColour("#A4A4A4");
        } else if (sponsor == "gold") {
            setColour("#FFB628");
        } else if (sponsor == "ruby") {
            setColour("#FF0000");
        }

        //Enable/Disable features based on sponsor level

        //If bronze/null -> no images or banners or details
        //If silver -> details + 1 pic
        //If gold -> details + 3 pics
        //Ruby -> details + 3 pics + banner
    }

    const getName = async () => {
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
            const name = data.response.rows[0].businessname;
            setName(name);
        } catch (error) {
            console.error("Error:" + error);
            return;
        }

    }

    const getSponsorship = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log()
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

            updateAccess(sponsor);

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

            <NavigationContainer independent={true}>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Welcome,"
                        component={BODefaultPage}
                        options={{
                            header: ({ navigation }) => (
                                <View>
                                    <Text style={styles.welcomeText}>Welcome,</Text>

                                    <View style={styles.imgContainer}>
                                        <Text style={styles.nameText}>{name}</Text>
                                        <Image style={[{ tintColor: `${colour}` }, styles.img]} source={require("../../../assets/navbar-sponsorships.png")} />
                                    </View>
                                </View>
                            ),
                            headerShadowVisible: false,
                            cardStyle: { backgroundColor: '#FFFFFF' },
                            //headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='Manage Profile'
                        component={BOManageProfile}
                        options={pageOptions}
                    />
                    <Stack.Screen
                        name='Manage Images'
                        component={BOManageProfile}
                        options={pageOptions}
                    />
                    <Stack.Screen
                        name='Manage Banners'
                        component={BOManageProfile}
                        //options={pageOptions}
                        options={pageOptions}
                    />
                    <Stack.Screen
                        name='Privacy Policy'
                        component={BOPrivacyPolicy}
                        options={pageOptions}
                    />

                    {/* Add a new <Stack.Screen> here when making new page. Also add onPress to MoreDefaultPage.js */}
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 50,
    },
    arrowContainer: {
        marginRight: 10,
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

    logoutText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    touchablestyle: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', // Distribute items evenly along the row
        //paddingVertical: 10, // Add padding vertically to adjust the touchable area
    },
    imagetext: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    picture: {
        marginRight: 20,
        height: 30,
        width: 30,
        tintColor: '#9D9D9D'
    },
    headerContainer: {
        paddingTop: 100,
    },

    img: {
        //tintColor: `${colour}`
        height: 30,
        width: 30,
    },
    buttonContainer: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Center items vertically
        //justifyContent: 'space-between',
        justifyContent: 'flex-end',
        //display: 'flex',
        //width: 300
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
        // marginRight: 'auto',
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Center items vertically
        //justifyContent: 'space-between',
        justifyContent: 'flex-end',
    },
    picture: {
        marginRight: 20,
        height: 30,
        width: 30,
        tintColor: '#9D9D9D'
    },
    arrowContainer: {
        marginRight: 10,
        // alignItems: 'right',
        flexDirection: 'row', // Align items horizontally // Center items vertically
        //justifyContent: 'space-between',
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
        //fontFamily: 'Poppins-Bold',
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

})

export default BOProfileScreen;
