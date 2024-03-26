import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { NativeEventEmitter } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

const BODefaultPage = () => {
    const [name, setName] = useState("");
    const navigation = useNavigation();
    const [sponsorship, setSponsorship] = useState("");

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
        { text: "Privacy Policy", img: require("../../../assets/bo-privacy-policy.png"), onPress: () => { navigation.navigate('Logout') } },
        { text: "Logout", img: require("../../../assets/logout.png"), onPress: () => { eventEmitter.emit('logout') } },
    ]

    useFocusEffect(
        React.useCallback(() => {
            getName();

            console.log("Sponsorship is: " + sponsorship)
        }, [])
    );
    useEffect(() => {
        getName();
        getSponsorship();
        updateAccess();


    }, []);

    const updateAccess = () => {
        //Update colour of badge
        /*
        switch (sponsorship) {
            case "null":
                setColour ("#5A5A5A");
            case "bronze":
                setColour ("#C0492E");
            case "silver":
                setColour ("#A4A4A4");
            case "gold":
                setColour ("#FFB628");
            case "ruby":
                setColour ("#FF0000");
            //default: 
              //  setColour ("#5A5A5A");
        }
        */
        //console.log("sponsoship in update: " + sponsorship)
        if (sponsorship == "null") {
            setColour("#5A5A5A");
        } else if (sponsorship == "bronze") {
            setColour("#C0492E");
        } else if (sponsorship == "silver") {
            setColour("#A4A4A4");
        } else if (sponsorship == "gold") {
            setColour("#FFB628");
        } else if (sponsorship == "ruby") {
            setColour("#FF0000");
        }

        

    }

    const getName = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`http://100.101.31.8:4000/businessowner/getName`, {
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
        try {
            const response = await fetch(`http://100.101.31.8:4000/businessowner/getSponsorship`, {
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
            const sponsorship = data.response;
            setSponsorship(sponsorship);


        } catch (error) {
            console.error("Error:" + error);
            return;
        }
    }

    if (!fontsLoaded && !fontError) {
        return null;
    }

    /*
                <Text style={styles.welcomeText}>Welcome,{"\n"}</Text>

            <View style={styles.imgContainer}>
                <Text style={styles.nameText}>{name}</Text>
                <Image style={[{ tintColor: `${colour}` }, styles.img]} source={require("../../../assets/navbar-sponsorships.png")} />
            </View>
    */
    return (
        <View style={styles.container}>


            {buttons.map((btn, index) => (
                <TouchableOpacity key={index} style={styles.buttonContainer} onPress={btn.onPress}>
                    <View style={styles.imagetext}>
                        <Image style={styles.picture} source={btn.img} />
                        <Text style={styles.text}>{btn.text}</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                        <AntDesign name="right" size={20} color="black" />
                    </View>
                </TouchableOpacity>
            ))}
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
        //alignContent: 'left',
        // marginTop: 15
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
});
export default BODefaultPage;
