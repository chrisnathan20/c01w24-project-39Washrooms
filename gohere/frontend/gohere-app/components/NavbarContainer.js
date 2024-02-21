import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text} from 'react-native';
import ExploreScreenTest from './ExploreScreenTest'; 
import CardScreenTest from './CardScreenTest';
import DonateScreenTest from './DonateScreenTest';
import InfoScreenTest from './InfoScreenTest';
import MoreScreenTest from './MoreScreenTest';

import NavbarIcons from './NavbarIcons'; 

const Tab = createBottomTabNavigator();

let exploreName = "Explore";
let cardName = "Card";
let infoName = "Info";
let donateName = "Donate";
let moreName = "More";

const NavbarContainer = ()=>{
    
    return(
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName = {exploreName}
                
                screenOptions= {({route}) => ({
        
                    tabBarIcon: ({focused, size})=>{
                        let iconName;
                        let routeName = route.name;
                        

                        if (routeName === exploreName){
                            iconName = focused ? require('../assets/navbar-exploreF.png') : require('../assets/navbar-explore.png');
                        }else if (routeName === cardName){
                            iconName = focused ? require('../assets/navbar-cardF.png') : require('../assets/navbar-card.png');
                        }else if (routeName === donateName){
                            iconName = focused ? require('../assets/navbar-donateF.png') : require('../assets/navbar-donate.png');
                        }else if (routeName === infoName){
                            iconName = focused ? require('../assets/navbar-infoF.png') : require('../assets/navbar-info.png');
                        }else if (routeName === moreName){
                            iconName = focused ? require('../assets/navbar-moreF.png') : require('../assets/navbar-more.png');
                        }

                        return (
                        
                        <View style={{ alignItems: 'center' }}>
                            <NavbarIcons source={iconName} size={size} /> 
                        </View>
                      
                      );
                        
                    },

                    tabBarLabelPosition: 'below-icon',

                    tabBarActiveTintColor: "red",
                    
                    tabBarLabelStyle: {
                        marginTop: 24,
                        fontSize: 10,
                    },


                    tabBarStyle: 
                        {
                            flexDirection: 'row', 
                            justifyContent: 'space-around', 
                            alignItems: 'center', 
                            height: 60,
                             
                        },

                })}
                >

                <Tab.Screen name={exploreName} component={ExploreScreenTest} options={{ headerShown: false }}/>
                <Tab.Screen name={cardName} component={CardScreenTest} options={{ headerShown: false }}/>
                <Tab.Screen name={donateName} component={DonateScreenTest} options={{ headerShown: false }}/>
                <Tab.Screen name={infoName} component={InfoScreenTest} options={{ headerShown: false }}/>
                <Tab.Screen name={moreName} component={MoreScreenTest} options={{ headerShown: false }}/>

            </Tab.Navigator>
        </NavigationContainer>

    );

}

export default NavbarContainer;