import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import MyWashrooms from './MyWashrooms';
import MoreInfo from './MoreInfo';

const Stack = createStackNavigator();

const WashroomScreen = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const commonOptions = {
        headerTitleStyle: {
          fontSize: 27,
          fontFamily: 'Poppins-Bold',
          color: '#DA5C59'
        },
        headerTintColor: '#DA5C59',
    };
    return (
    <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="My Washrooms">
        <Stack.Screen 
            name="My Washrooms" 
            component={MyWashrooms} 
            options={commonOptions} />
        <Stack.Screen 
            name="More Info" 
            component={MoreInfo} 
            options={commonOptions} />
        </Stack.Navigator>
    </NavigationContainer>
    );
};

export default WashroomScreen;