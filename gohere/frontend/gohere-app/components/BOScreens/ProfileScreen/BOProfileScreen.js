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
import { BOManageProfile } from './BOManageProfile.js';

const BOProfileScreen = () => {
    const [name, setName] = useState("");

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    const [email, setEmail] = useState("");

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

    const eventEmitter = new NativeEventEmitter();

    useFocusEffect(
        React.useCallback(() => {
            getName();
        }, [])
    );

    useEffect(() => {
        getName();


    }, []);

    const getName = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log("token is: " + token)
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getname`, {
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
            console.log("name is: " + name)


        } catch (error) {
            console.error("Error:" + error);
            return;
        }

    }
    const resetTokenKey = async () => {
        try {
            await AsyncStorage.removeItem('token');
            eventEmitter.emit('logout');
        } catch (error) {
            console.error('Error removing disease key from AsyncStorage:', error);
        }
    };

    const handleLogout = async () => {
        resetTokenKey(); //resetting token key triggers a log out 
    }

    const handleManageProfile = () => {

    }

    const handleManageImages = () => {

    }

    const handleManageBanner = () => {

    }

    const handlePrivacyPolicy = () => {

    }


    if (!fontsLoaded && !fontError) {
        return null;
    }
    /*
                
            <TouchableOpacity style={styles.touchablestyle}>
                <View style={styles.imagetext}>
                    <Image style={styles.picture} source={require("../../assets/bo-manage-profile.png")} />
                    <Text style={styles.text}>Manage Profile</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <AntDesign name="right" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchablestyle}>
                <View style={styles.imagetext}>
                    <Image style={styles.picture} source={require("../../assets/manage-images.png")} />
                    <Text style={styles.text}>Manage Images</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <AntDesign name="right" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchablestyle}>
                <View style={styles.imagetext}>
                    <Image style={styles.picture} source={require("../../assets/manage-banner.png")} />
                    <Text style={styles.text}>Manage Banner</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <AntDesign name="right" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchablestyle}>
                <View style={styles.imagetext}>
                    <Image style={styles.picture} source={require("../../assets/bo-privacy-policy.png")} />
                    <Text style={styles.text}>Privacy Policy</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <AntDesign name="right" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchablestyle} onPress={handleLogout}>
                <View style={styles.imagetext}>
                    <Image style={styles.picture} source={require("../../assets/logout.png")} />
                    <Text style={styles.text}>Logout</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <AntDesign name="right" size={20} color="black" />
                </View>
            </TouchableOpacity>
    */
    return (
        <View style={styles.container}>
            <Text>Welcome,</Text>
            <Text>{name}</Text>

            <NavigationContainer independent={true}>
                <Stack.Navigator>
                    <Stack.Screen
                        name="More Options..."
                        component={BODefaultPage}
                        options={{
                            headerTitleStyle: {
                                fontStyle: 'normal',
                                fontWeight: 700,
                                paddingLeft: 10,
                                fontSize: 30,
                                color: '#DA5C59'
                            },
                            headerShadowVisible: false,
                            cardStyle: { backgroundColor: '#FFFFFF' }
                        }}
                    />
                    <Stack.Screen
                        name='Manage Profile'
                        component={BOManageProfile}
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

})

export default BOProfileScreen;
