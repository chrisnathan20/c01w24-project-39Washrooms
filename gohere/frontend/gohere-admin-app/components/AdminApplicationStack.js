import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AdminApplicationStack = ({ navigation }) => {
  const handleBusinessPress = () => {
    navigation.navigate('Business Applications');
  };

  const handlePublicPress = () => {
    navigation.navigate('Public Applications');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleBusinessPress}>
        <Text style={styles.cardHeader}>Business Applications</Text>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.cardImage} source={require('./business-apps.png')} />
          </View>
          <View style={styles.textContainer}>
            {/* You can replace 'x' with your actual counts */}
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
            <Image style={styles.cardImage} source={require('./public-apps.png')} />
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
      alignItems: 'center', // Center items horizontally
      //justifyContent: 'center', // Center items vertically
    },

  card:{
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 15,
    width: '85%',
    height: '30%',
    elevation: 10,
    marginVertical: 10,
    paddingLeft: 30,
    overflow: 'hidden', 
},

cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
},

contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},

imageContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    marginTop: -10,
},

cardImage: {
    height: '90%', 
    resizeMode: 'contain',
    alignSelf: 'flex-start', 
},

textContainer: {
    flex: 2,
    marginRight: -100,
    marginTop: -15,
},

categoryLine: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
},

highlightedText: {
    color: '#DA5C59',
},
});

export default AdminApplicationStack;
