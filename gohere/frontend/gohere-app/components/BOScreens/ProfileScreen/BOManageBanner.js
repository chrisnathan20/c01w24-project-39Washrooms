import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { GOHERE_SERVER_URL } from '../../../env.js';

const BOManageBanner = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    const [bannerImage, setBannerImage] = useState([]);

    // Fetching the specific banner image depending on Ruby Business Owner

    // const fetchBanner = async () => {
    //     const token = await AsyncStorage.getItem('token');
    //     console.log("token is: " + token)

    //     try{
    //         const response = await fetch(`${GOHERE_SERVER_URL}/rubybusiness/getBanner`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (!response.ok) { 
    //             //throw new Error('Server responded with an error.');
    //             console.log(`Response not okay: ${response.status}`);
    //         }

    //         const bImage = await response.json();
    //         setBannerImage(bImage);

    //     }catch (error){
    //         console.error('Error fetching iamge URL', error);
    //         setError(error.message);
    //     }
    // }

    const fetchBanner = async () => {

        try{
            const rubyBannerResponse = await fetch(`${GOHERE_SERVER_URL}/allRubyBusinessBanners`);
            if (!rubyBannerResponse.ok) {
                console.log('response not received');
                return;
            }
            const rubyBusinessImage = await rubyBannerResponse.json();
            setBannerImage(rubyBusinessImage);
            

        } catch (error) {
            console.error('Error fetching image URL:', error);
            setError(error.message);
        }


    }

    useEffect(() => {
        fetchBanner();

    }, []);


    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={styles.container}>

            {/* <Image
                source={{uri: bannerImage}}
                style={[styles.imageBanner]}
            /> */}

            <Image
                source={{uri: `${GOHERE_SERVER_URL}/${bannerImage[0]}`}}
                style={[styles.imageBanner]}
            />
            <Image source={require("../../../assets/edit_circle.png")}/>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        marginTop: 30,
    },

    imageBanner:{
        justifyContent: 'center',
        width: 350,
        height: 200,
        borderRadius: 10,
    }

})

export default BOManageBanner;
