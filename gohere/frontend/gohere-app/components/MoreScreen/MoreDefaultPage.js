import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MoreDefaultPage = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <Pressable style={styles.button}>
          <View >
           <Text>Manage My Profile</Text>
          </View>
        </Pressable>

        <Pressable style={styles.button}>
          <View>
           <Text>Add Public Washroom</Text>
          </View>    
        </Pressable>

        <Pressable style={styles.button}>
          <View>
            <Text>Sign Up as a Business</Text>
          </View>
        </Pressable>

        <Pressable style={styles.button}>
          <View>
            <Text>Log In as a Business</Text>
          </View>
        </Pressable>

        <Pressable style={styles.button}>
          <View>
            <Text>Location Permission</Text>
          </View>
        </Pressable>

        <Pressable style={styles.button}>
          <View>
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
    width: '30%', 
    aspectRatio: 1, 
    backgroundColor: 'white',
    borderRadius: 10, 
    marginBottom: 30,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MoreDefaultPage;
