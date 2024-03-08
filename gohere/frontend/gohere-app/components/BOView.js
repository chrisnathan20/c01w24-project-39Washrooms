import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOView = () => {


    const handleConfirm = () => {
        /*

        Questions:
        - change font size of Business Account Sign Up or all font sizes?
        - When to pop up the red *

        //Alert.alert("Profile Updated", "Your profile has been successfully updated.");
        */
    }
    

// <Image style={styles.picture} source={require("../assets/business-login-page.png")} />
    return (
        <View style={styles.container}>
            <Text>Successful login!</Text>
        </View>
    );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
container: {
    
}
});

export default BOView;