import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MoreDefaultPage from './MoreDefaultPage';

const MoreScreen = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="More Options..."
          component={MoreDefaultPage}
          options={{
            headerTitleStyle: {
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: 26,
              color: '#DA5C59'
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MoreScreen;
