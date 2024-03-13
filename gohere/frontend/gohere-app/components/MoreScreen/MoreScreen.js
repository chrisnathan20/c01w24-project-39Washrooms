import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MoreDefaultPage from './MoreDefaultPage';
import ManageProfile from '../ManageProfile';
import BusinessSignUp from '../BusinessSignUp';
import BusinessLogin from '../BusinessLogIn';
import BOView from '../BOView';

const MoreScreen = () => {
  const Stack = createStackNavigator();

  return (
    <View style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="More Options..."
            component={MoreDefaultPage}
            options={{
              headerTitleStyle: {
                fontStyle: 'normal',
                fontWeight: 700,
                paddingLeft: 10,
                fontSize: 30,
                color: '#DA5C59'
              },
              headerShadowVisible: false,
              cardStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="Manage Profile"
            component={ManageProfile}
            options={{
              headerTitleStyle: {
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 30,
                color: '#DA5C59',
              },
              headerTintColor: '#DA5C59',
              headerShadowVisible: false,
              cardStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="Business Account Sign Up"
            component={BusinessSignUp}
            options={{
              headerTitleStyle: {
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 27, //Max font size before text disappears
                color: '#DA5C59',
              },
              headerTintColor: '#DA5C59',
              headerShadowVisible: false,
              cardStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="Business Account Login"
            component={BusinessLogin}
            options={{
              headerTitleStyle: {
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 29,
                color: '#DA5C59',
              },
              headerTintColor: '#DA5C59',
              headerShadowVisible: false,
              cardStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="BOView"
            component={BOView}
            options={{
              headerTitleStyle: {
                fontStyle: 'normal',
                fontWeight: 700,
                paddingLeft: 10,
                fontSize: 30,
                color: '#DA5C59'
              },
              headerShadowVisible: false,
              cardStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          {/* Add a new <Stack.Screen> here when making new page. Also add onPress to MoreDefaultPage.js */}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // this fixes gap in Padding Issue fix
    paddingTop: 10
  },
});

export default MoreScreen;
