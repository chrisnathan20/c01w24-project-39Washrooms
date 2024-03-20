import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

//importing all the screens. If screen file name changes change the ./<new_file_name>
//if screen is not in the BOScreens directory then its ../<new_file_name>

// import BOProfileScreen from './BOProfileScreen';
// import BOSponsorshipScreen from './BOSponsorshipScreen';
// import BOApplicationScreen from './BOApplicationScreen';
// import BOWashroomScreen from './BOWashroomScreen';

import AdminApplicationScreen from './AdminApplicationScreen';
import AdminWashroomScreen from './AdminWashroomScreen';
import AdminReportScreen from './AdminReportScreen';
import AdminNewsScreen from './AdminNewsScreen';
import AdminSponsorScreen from './AdminSponsorScreen';


//importing icons template
import NavbarIcons from './NavbarIcons'; 

const Tab = createBottomTabNavigator();

let applicationName = "Applications";
let washroomName = "Washrooms";
let reportName = "Reports";
let newsName = "News";
let sponsorName = "Sponsors";

const NavbarContainer = ()=>{
    
    return(
        <NavigationContainer>
            <Tab.Navigator

                initialRouteName = {applicationName}
                screenOptions= {({route}) => ({
        
                    tabBarIcon: ({focused, size, color})=>{

                        let iconName;
                        let routeName = route.name;
                        let iconSize = size;   

                        if (routeName === reportName){
                            iconName = require('../assets/navbar-report.png');
                        }else if (routeName === sponsorName){
                            iconName = require('../assets/navbar-sponsorships.png');
                        }else if (routeName === applicationName){
                            iconName = require('../assets/navbar-applications.png');
                        }else if (routeName === washroomName){
                            iconName = require('../assets/navbar-washrooms.png');
                        }else if (routeName === newsName){
                            iconName = require('../assets/navbar-info.png');
                        }

                        iconSize = size+3;
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

                <Tab.Screen name={applicationName} component={AdminApplicationScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={washroomName} component={AdminWashroomScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={reportName} component={AdminReportScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={newsName} component={AdminNewsScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={sponsorName} component={AdminSponsorScreen} options={{ headerShown: false }}/>

            </Tab.Navigator>
        </NavigationContainer>

    );

}

export default NavbarContainer;