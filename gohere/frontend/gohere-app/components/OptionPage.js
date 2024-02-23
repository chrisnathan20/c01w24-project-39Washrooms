import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OptionPage = () => {
  const options = [
    {text: "Manage My Profile", destination: ""},
    {text: "Add Publc Washroom", destination: ""},
    {text: "Sign Up as a Business", destination: ""},
    {text: "Log In as a Business", destination: ""},
    {text: "Location Permission", destination: ""},
    {text: "Privacy Policy", destination: ""},
  ]
  
  const navigation = useNavigation();
  
  const handlePress = (dest) => {
    if (dest != "") {
      navigation.navigate(dest);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((el) => (
        <Pressable onPress={handlePress(el.destination)}>
          <Text>{el.text}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  responseText: {
    fontSize: 18,
    color: '#333',
  },
});

export default OptionPage;
