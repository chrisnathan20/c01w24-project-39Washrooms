import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MoreDefaultPage = () => {

  const navigation = useNavigation();

  const buttons = [
    { text: "Manage My Profile", img: require('../../assets/manage-profile.png'), onPress: {} },
    { text: "Add Public Washroom", img: require('../../assets/public-washroom.png'), onPress: {} },
    { text: "Sign Up as a Business", img: require('../../assets/sign-up-business.png'), onPress: {} },
    { text: "Log In as a Business", img: require('../../assets/log-in-business.png'), onPress: {} },
    { text: "Location Permission", img: require('../../assets/location-permission.png'), onPress: {} },
    { text: "Privacy Policy", img: require('../../assets/privacy-policy.png'), onPress: {} }
  ]

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={btn.onPress}>
          <View>
            <Text style={styles.text}>
              <Image
                source={btn.img}
                style={styles.icon}
              />
              {"\n"}{btn.text}
            </Text>
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
  },
  button: {
    width: 120,
    height: 120,
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: '5%',
    marginBottom: '5%',
    marginLeft: '5%',
    marginRight: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 2, width: 0 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 2, //IOS
    elevation: 2, // Android
  },
  text: {
    display: 'flex',
    flex: 1,
    flexBasis: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    textAlign: 'center',
    color: '#DA5C59'
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 5,
    alignSelf: 'center'
  }
});

export default MoreDefaultPage;