import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

//importing all the screens. If screen file name changes change the ./<new_file_name>
import ExploreScreen from './ExploreScreen'; 
import CardScreen from './CardScreen';
import DonateScreen from './DonateScreen';
import InfoScreen from './InfoScreen';
import MoreScreen from './MoreScreen/MoreScreen';



//importing icons template
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
        
                    tabBarIcon: ({focused, size, color})=>{

                        let iconName;
                        let routeName = route.name;
                        let iconSize = size;   

                        if (routeName === exploreName){
                            iconName = require('../assets/navbar-explore.png');
                        }else if (routeName === cardName){
                            iconName = require('../assets/navbar-card.png');
                        }else if (routeName === donateName){
                            iconName = require('../assets/navbar-donate.png');
                        }else if (routeName === infoName){
                            iconName = require('../assets/navbar-info.png');
                        }else if (routeName === moreName){
                            iconName = require('../assets/navbar-more.png');
                        }
                        
                        iconSize = size+5;
                        iconSize = focused ? (iconSize*1.2) : iconSize;
                        color = focused ? '#DA5C59' : '#5A5A5A'

                        return (
                        <View style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                            <NavbarIcons source={iconName} size={iconSize}  color={color}/> 
                        </View>
                        );
                        
                    },


                    tabBarLabelPosition: 'below-icon',
                    
                    tabBarLabelStyle: {
                        display:'none', //if want to bring back label, comment out this line
                        marginTop: 20, 
                        fontSize: 10,
                        fontWeight: 'bold',                      
                    },


                    tabBarStyle: 
                        {
                            flexDirection: 'row', 
                            justifyContent: 'space-around', 
                            alignItems: 'centre', //if want to bring back label, change this to flex-end
                            height: 65,
                            tabBarTouchable: true,
   
                        },

                })}
                >

                <Tab.Screen name={exploreName} component={ExploreScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={cardName} component={CardScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={donateName} component={DonateScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={infoName} component={InfoScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={moreName} component={MoreScreen} options={{ headerShown: false }}/>

            </Tab.Navigator>
        </NavigationContainer>

    );

}

export default NavbarContainer;