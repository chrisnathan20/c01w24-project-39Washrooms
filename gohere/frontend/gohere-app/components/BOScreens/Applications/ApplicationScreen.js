import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import MyApplications from './MyApplications';
import SpecifyLocation from './SpecifyLocation';
import EnterAddressForm from './EnterAddressForm';
import EditHours from './EditHours';
import ImageAndComments from './ImageAndComments';
import MoreInfo from './MoreInfo';

const Stack = createStackNavigator();

const ApplicationScreen = () => {
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
        <Stack.Navigator initialRouteName="My Applications">
        <Stack.Screen 
            name="My Applications" 
            component={MyApplications} 
            options={{ title: 'My Applications', headerShown: false }} />
        <Stack.Screen 
            name="More Info" 
            component={MoreInfo} 
            options={commonOptions} />
        <Stack.Screen
            name="Add washroom"
            component={SpecifyLocation}
            options={commonOptions}/>
        <Stack.Screen
            name="Enter Address"
            component={EnterAddressForm}
            options={commonOptions}/>
        <Stack.Screen
            name="Edit Hours"
            component={EditHours}
            options={commonOptions}/>
        <Stack.Screen
            name="Info and Images"
            component={ImageAndComments}
            options={commonOptions}/>
        </Stack.Navigator>
    </NavigationContainer>
    );
};

export default ApplicationScreen;