import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const MoreDefaultPage = () => {

  const navigation = useNavigation();

  //When creating other pages:
  //Make a <Stack.Screen name='exampleName' component={YourComponent}/> in MoreScreen.js
  //Add something like () => { navigation.navigate('YourScreenName') } to the onPress below
  const buttons = [
    { text: "Manage My Profile", img: require('../../assets/manage-profile.png'), onPress: () => { navigation.navigate('Manage Profile') } },
    { text: "Add Public Washroom", img: require('../../assets/public-washroom.png'), onPress: {} },
    { text: "Sign Up as a Business", img: require('../../assets/sign-up-business.png'), onPress: () => { navigation.navigate('Business Sign Up') } },
    { text: "Log In as a Business", img: require('../../assets/log-in-business.png'), onPress: () => {navigation.navigate('Business Login')}},
    { text: "Location Permission", img: require('../../assets/location-permission.png'), onPress: () => { Linking.openSettings() } },
    { text: "Privacy Policy", img: require('../../assets/privacy-policy.png'), onPress: () => {navigation.navigate('Privacy Policy')} }
  ]

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={btn.onPress}>
          <View style={styles.content}>
            <Image
              source={btn.img}
              style={styles.icon}
            />
            <Text style={styles.text}>{btn.text}</Text>
          </View>
        </TouchableOpacity>
      ))}
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

export default MoreDefaultPage;