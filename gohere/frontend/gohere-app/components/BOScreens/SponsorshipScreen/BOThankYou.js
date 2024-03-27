import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BOThankYou = () => {
  const navigation = useNavigation();


  useEffect(() => {
    // Automatically navigate back to the donation page after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('BOPreDonation');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  

  const handleTap = () => {
    // Navigate back to the donation page when user taps anywhere on the screen
    navigation.navigate('BOPreDonation');
  };

  return (
    <TouchableOpacity onPress={handleTap} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topText}>
            <Text  style={styles.successText}>Your Donation is Successful</Text>
            <Image source={require('../../../assets/check.png')} style={styles.image1} />
        </View>
        <View style={styles.bottomText}>
            <Image source={require('../../../assets/thankyou.png')} style={styles.image2} />
            <Text  style={styles.thanksText}>Thank you for your support!</Text>
            <Text style={styles.redirectText}></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BOThankYou;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        
  
    },

    successText: {
        //fle:1,
        fontFamily: 'Poppins-Medium',
        color: "#00851D",
        fontSize: 24,

    },

    image1: {
        display: 'flex',
        width: 60,
        height:60,
        tintColor: "#00851D"
 

  
    },
    image2: {
        display: 'flex',
        width: 333,
        height: 361,


  
    },

    thanksText: {
        fontFamily: 'Poppins-Bold',
        fontSize:30,
        textAlign: 'center',
        width: 210,
        lineHeight:37,
        marginVertical:25,

    },

    redirectText: {
        margin:10, 

    },

    bottomText: {
        flex:1,
        justifyContent: 'flex-end',
        alignItems:'center',


    },

    topText: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems:'center',
        paddingTop: 70,


    },



})