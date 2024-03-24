import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { GOHERE_SERVER_URL } from '../../env.js';

const Applications = ({ navigation }) => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    });
    if (!fontsLoaded && !fontError) {
        return null;
    }
  const handleBusinessPress = () => {
    navigation.navigate('Business Applications');
  };

  const handlePublicPress = () => {
    navigation.navigate('Public Applications');
  };

  const[bApplications, setBApplications] = useState([]);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleBusinessPress}>
        <Text style={styles.cardHeader}>Business Applications</Text>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.cardImage} source={require('../../assets/business-apps.png')} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pending</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pre-screening</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> on-site review</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> final review</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handlePublicPress}>
        <Text style={styles.cardHeader}>Public Applications</Text>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.cardImage} source={require('../../assets/public-apps.png')} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pending</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pre-screening</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> on-site review</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> final review</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },

  card:{
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    margin: 20,
    marginVertical: 10,
},

cardHeader: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
},

contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},

imageContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1
},

cardImage: {
    height: 150,
    width: 60, 
    resizeMode: 'contain',
},

textContainer: {
    flex: 0.9,
},

categoryLine: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
},

highlightedText: {
    color: '#DA5C59',
    fontSize: 20
},
});

export default Applications;