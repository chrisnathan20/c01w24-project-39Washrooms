import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StripeApp from './StripeApp';
import ThankYou from './ThankYou';

const Stack = createStackNavigator();

const DonateScreen = () => {
    return (
      <NavigationContainer  independent={true}>
        <Stack.Navigator initialRouteName="StripeApp">
          <Stack.Screen name="StripeApp" component={StripeApp} options={{ title: 'StripeApp', headerShown: false }} />
          <Stack.Screen name="ThankYou" component={ThankYou} options={{ title: 'ThankYou', headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  export default DonateScreen;