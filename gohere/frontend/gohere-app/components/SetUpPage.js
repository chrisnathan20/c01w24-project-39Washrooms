import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';

const SetUpPage = ()=>{
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    });

    const [selectedOption, setSelectedOption] = useState('None');

    if (!fontsLoaded && !fontError) {
        return null;
    }


    // Function to handle option selection
    const handlePress = (option) => {
        setSelectedOption(option); 
    };

    // Determine button style based on whether it's selected
    const getButtonStyle = (option) => [
        styles.button,
        selectedOption === option && styles.selectedButton
    ];

    // Determine text style based on whether it's selected
    const getTextStyle = (option) => [
        styles.buttonText,
        selectedOption === option && styles.selectedButtonText
    ]

    const options = ['Crohn\'s disease', 'Ulcerative colitis', 'None'];
    return(
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Setup</Text>
                <Image style={styles.indicator} source={require("../assets/indicator1.png")}/>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    style={styles.image} 
                    source={require("../assets/setup1.png")} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.text}>Please select which type of IBD you have. This will allow us to personalize your experience.</Text>
                <Text style={styles.text}>You can always change this later in the Settings.</Text>
            </View>

            <View>
                {options.map((option) => (
                    <Pressable
                        key={option}
                        onPress={() => handlePress(option)}
                        style={[getButtonStyle(option) ]}
                        >
                        <Text style={[getTextStyle(option)]}>
                            {option}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headingContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    indicator:{
        width: width*0.15,
        height: height*0.02,
        resizeMode: 'contain',
    },
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#DA5C59',
    },
    image: {
        width: width, // Take up all width
        height: height / 3.4, // Take up one-third of the screen height
        resizeMode: 'contain'
    },
    imageContainer: {
        alignItems: "center"
    },
    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 27,
        marginBottom: 15
    },
    button: {
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#5E6366',
    },
    selectedButton: {
        backgroundColor: '#DA5C59', 
        borderColor: '#DA5C59', 
    },
    buttonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'black'
    },
    selectedButtonText:{
        color: 'white'
    },
  });

export default SetUpPage;