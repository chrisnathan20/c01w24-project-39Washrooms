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

//importing icons
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
                        let iconSize = size;
                        

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
                        
                        iconSize = size+5;
                        iconSize = focused ? (iconSize*1.2) : iconSize;

                        return (
                        <View style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                            <NavbarIcons source={iconName} size={iconSize} /> 
                        </View>
                        );
                    },

                    tabBarLabelPosition: 'below-icon',

                    tabBarActiveTintColor: "red",
                    
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