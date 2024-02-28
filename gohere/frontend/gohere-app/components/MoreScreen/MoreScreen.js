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
              paddingTop: 20,
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
  );
};

export default MoreScreen;
