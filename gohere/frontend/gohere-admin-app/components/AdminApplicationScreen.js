import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminApplicationStack from './AdminApplicationStack';
import BusinessApplicationScreen from './BusinessApplicationScreen'; // Import your Business Applications screen component
import PublicApplicationScreen from './PublicApplicationScreen'; // Import your Public Applications screen component

const Stack = createStackNavigator();

const AdminApplicationScreen = () => {
  return (
    // <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="Applications"
          component={AdminApplicationStack}
          options={{
            headerTitleStyle: {
              color: '#DA5C59',
              fontSize: 30,
              fontWeight: 'bold',
              marginLeft:20
            },
            headerTintColor: '#DA5C59',
            headerShadowVisible: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        />
        <Stack.Screen
          name="Business Applications"
          component={BusinessApplicationScreen}
          options={{
            headerTitleStyle: {
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 20,
              color: '#DA5C59',
            },
            headerTintColor: '#DA5C59',
            headerShadowVisible: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        />
        <Stack.Screen
          name="Public Applications"
          component={PublicApplicationScreen}
          options={{
            headerTitleStyle: {
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 20,
              color: '#DA5C59',
            },
            headerTintColor: '#DA5C59',
            headerShadowVisible: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        />
      </Stack.Navigator>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
})

export default AdminApplicationScreen;
