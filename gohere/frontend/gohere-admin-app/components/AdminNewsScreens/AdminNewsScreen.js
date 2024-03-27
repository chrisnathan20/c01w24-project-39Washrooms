import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NewsListScreen from './NewsListScreen';
import AddNews from './AddNews';
import UpdateNews from './UpdateNews';
import { useFonts } from 'expo-font';

//Stack screen for navigation within news pages
const Stack = createStackNavigator();

const AdminNewsScreen = () => {
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
      <Stack.Navigator initialRouteName="NewsListScreen">
        <Stack.Screen name="NewsList" component={NewsListScreen} options={{ title: 'NewsListScreen', headerShown: false }} />
        <Stack.Screen name="Add News" component={AddNews} options={commonOptions}/>
        <Stack.Screen name="Edit News" component={UpdateNews} options={commonOptions} />      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AdminNewsScreen;