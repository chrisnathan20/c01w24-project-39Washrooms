import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MoreDefaultPage from './MoreDefaultPage';
import ManageProfile from './ManageProfile';
import BusinessSignUp from './BusinessSignUp';
import BusinessLogin from './BusinessLogIn';
import PrivacyPolicy from './PrivacyPolicy';
import SpecifyLocation from './AddPublicWashroom/SpecifyLocation';
import EnterAddressForm from './AddPublicWashroom/EnterAddressForm';
import EditHours from './AddPublicWashroom/EditHours';
import ImageAndComments from './AddPublicWashroom/ImageAndComments';
import BOView from '../BusinessOwner/BOView';

const MoreScreen = () => {
  const Stack = createStackNavigator();

  const pageOptions = {
    headerTitleStyle: {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 30,
      color: '#DA5C59',
    },
    headerTintColor: '#DA5C59',
    headerShadowVisible: false,
    cardStyle: { backgroundColor: '#FFFFFF' }
  }

  return (
    <View style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="More Options..."
            component={MoreDefaultPage}
            options={{
              headerTitleStyle: {
                fontStyle: 'normal',
                fontWeight: 700,
                paddingLeft: 10,
                fontSize: 30,
                color: '#DA5C59'
              },
              headerShadowVisible: false,
              cardStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="Manage Profile"
            component={ManageProfile}
            options={pageOptions}
          />
          <Stack.Screen
            name="Business Sign Up"
            component={BusinessSignUp}
            options={pageOptions}
          />
          <Stack.Screen
            name="Business Login"
            component={BusinessLogin}
            options={pageOptions}
          />
          <Stack.Screen
            name="BOView"
            component={BOView}
            options={pageOptions}
          />
          <Stack.Screen
            name="Privacy Policy"
            component={PrivacyPolicy}
            options={pageOptions}
          />
          <Stack.Screen
            name="Add public washroom"
            component={SpecifyLocation}
            options={pageOptions}
          />
          <Stack.Screen
            name="Enter Address"
            component={EnterAddressForm}
            options={pageOptions}
          />
          <Stack.Screen
            name="Edit Hours"
            component={EditHours}
            options={pageOptions}
          />
          <Stack.Screen
            name="Info and Images"
            component={ImageAndComments}
            options={pageOptions}
          />
          {/* Add a new <Stack.Screen> here when making new page. Also add onPress to MoreDefaultPage.js */}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // this fixes gap in Padding Issue fix
    paddingTop: 10
  },
});

export default MoreScreen;
