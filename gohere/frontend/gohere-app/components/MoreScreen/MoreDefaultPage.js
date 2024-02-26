import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MoreDefaultPage = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <View >
          <Text style={styles.text}>
            <Image
              source={require('../../assets/manage-profile.png')}
              style={styles.icon}
            />
            Manage My Profile
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <View>
          <Text style={styles.text}>
            <Image
              source={require('../../assets/public-washroom.png')}
              style={styles.icon}
            />
            Add Public Washroom
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <View>
          <Text style={styles.text}>
            <Image
              source={require('../../assets/sign-up-business.png')}
              style={styles.icon}
            />
            Sign Up as a Business
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <View>
          <Text style={styles.text}>
            <Image
              source={require('../../assets/log-in-business.png')}
              style={styles.icon}
            />
            Log In as a Business
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <View>
          <Text style={styles.text}>
            <Image
              source={require('../../assets/location-permission.png')}
              style={styles.icon}
            />
            Location Permission
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <View>

          <Text style={styles.text}>
            <Image
              source={require('../../assets/privacy-policy.png')}
              style={styles.icon}
            />
            Privacy Policy
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 10
  },
  button: {
    display: 'flex',
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: '10%',
    marginLeft: '10%',
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 100,
    textAlign: 'center',
    color: '#DA5C59'
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 5
  }
});

export default MoreDefaultPage;