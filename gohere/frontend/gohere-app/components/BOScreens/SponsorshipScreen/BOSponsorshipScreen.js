import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BOPreDonation from './BOPreDonation';
import BOStripe from './BOStripe';
import BOThankYou from './BOThankYou';

const Stack = createStackNavigator();

const BOSponsorshipScreen = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="BOPreDonation">
        <Stack.Screen name="BOPreDonation" component={BOPreDonation} options={{ title: 'BOPreDonation', headerShown: false }} />
        <Stack.Screen name="BOStripe" component={BOStripe} 
            options={{ title: 'Donate', headerShown: true, headerTintColor:'#DA5C59',cardStyle: { backgroundColor: '#FFFFFF' },headerShadowVisible: false, headerTitleStyle: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 30,
            color: '#DA5C59',
        }}} />
        <Stack.Screen name="BOThankYou" component={BOThankYou} options={{ title: 'BOThankYou', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default BOSponsorshipScreen;