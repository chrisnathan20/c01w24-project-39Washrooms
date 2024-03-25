import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { NativeEventEmitter } from 'react-native';

const BODefaultPage = () => {

    const navigation = useNavigation();
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

    return (
        <View style={styles.container}>
            {buttons.map((btn, index) => (
                <TouchableOpacity key={index} style={styles.button} onPress={btn.onPress}>
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
        justifyContent: 'space-evenly',
        alignContent: 'space-evenly',
        marginTop: 15
    },
    button: {
        /*
        width: 150,
        height: 150,
        padding: 10,
        aspectRatio: 1,
        borderRadius: 10,
        marginTop: '5%',
        marginBottom: '5%',
        marginLeft: '5%',
        marginRight: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 2, width: 0 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 2, //IOS
        elevation: 8, // Android
        */
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between',
    },
    content: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        color: '#DA5C59',
        fontWeight: '500',
        fontSize: 15
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
    },
    picture: {
        marginRight: 20,
        height: 30,
        width: 30,
        tintColor: '#9D9D9D'
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
});
export default BODefaultPage;
