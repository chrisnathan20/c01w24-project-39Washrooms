import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NewsListScreen from './NewsListScreen';
import AddNews from './AddNews';
import UpdateNews from './UpdateNews';

//Stack screen for navigation within news pages
const Stack = createStackNavigator();

const AdminNewsScreen = () => {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="NewsListScreen">
        <Stack.Screen name="NewsList" component={NewsListScreen} options={{ title: 'NewsListScreen', headerShown: false }} />
        <Stack.Screen name="Add" component={AddNews} options={{ title: 'AddNews', headerShown: false }} />
        <Stack.Screen name="Update" component={UpdateNews} options={{ title: 'UpdateNews', headerShown: false }} />      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AdminNewsScreen;
