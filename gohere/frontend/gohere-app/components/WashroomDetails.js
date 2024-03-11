import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const WashroomDetails = ({ data, setShowDetails }) => {

  return (
    <View style={styles.container}>
      <Button onPress={() => {setShowDetails(false)}}></Button>
    </View>
  );
};

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
  }
});

export default WashroomDetails;