import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import MyApplications from './MyApplications';

const Stack = createStackNavigator();

const ApplicationScreen = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
    <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="My Applications">
        <Stack.Screen 
            name="My Applications" 
            component={MyApplications} 
            options={{ title: 'My Applications', headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
    );
};

export default ApplicationScreen;