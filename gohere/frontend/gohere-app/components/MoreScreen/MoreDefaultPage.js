import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MoreDefaultPage = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <View >
          <Image
            source={require('../../assets/manage-profile.png')}
            style={styles.icon}
          />
          <Text>Manage My Profile</Text>
        </View>
      </Pressable>

      <Pressable style={styles.button}>
        <View>
          <Image
            source={require('../../assets/public-washroom.png')}
            style={styles.icon}
          />
          <Text>Add Public Washroom</Text>
        </View>
      </Pressable>

      <Pressable style={styles.button}>
        <View>
          <Image
            source={require('../../assets/sign-up-business.png')}
            style={styles.icon}
          />
          <Text>Sign Up as a Business</Text>
        </View>
      </Pressable>

      <Pressable style={styles.button}>
        <View>
          <Image
            source={require('../../assets/log-in-business.png')}
            style={styles.icon}
          />
          <Text>Log In as a Business</Text>
        </View>
      </Pressable>

      <Pressable style={styles.button}>
        <View>
          <Image 
            source={require('../../assets/location-permission.png')} 
            style={styles.icon}
          />
          <Text>Location Permission</Text>
        </View>
      </Pressable>

      <Pressable style={styles.button}>
        <View>
          <Image 
            source={require('../../assets/privacy-policy.png')} 
            style={styles.icon}
          />
          <Text>Privacy Policy</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 10,
    marginBottom: 40,
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
  },
  icon: {
    width: 60,
    height: 60
  }
});

export default MoreDefaultPage;
