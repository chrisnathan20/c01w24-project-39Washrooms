import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import Applications from './Applications';
import BusinessApplications from './BusinessApplications';
import PublicApplications from './PublicApplications';
import MoreInfo from './MoreInfo';


const Stack = createStackNavigator();

const ApplicationScreen = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
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
        <Stack.Navigator initialRouteName="Applications">
        <Stack.Screen 
            name="Applications" 
            component={Applications} 
            options={commonOptions} />
        <Stack.Screen 
            name="Business" 
            component={BusinessApplications} 
            options={commonOptions} />
        <Stack.Screen 
            name="Public" 
            component={PublicApplications} 
            options={commonOptions} />
        <Stack.Screen 
            name="More Info" 
            component={MoreInfo} 
            options={commonOptions} />
        </Stack.Navigator>
    </NavigationContainer>
    );
};

export default ApplicationScreen;