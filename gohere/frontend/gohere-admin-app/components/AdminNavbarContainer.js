import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

//importing all the screens. If screen file name changes change the ./<new_file_name>
//if screen is not in the BOScreens directory then its ../<new_file_name>



import AdminNewsScreen from './AdminNewsScreens/AdminNewsScreen';
import WashroomScreen from './Washrooms/WashroomScreen';
import ReportScreen from './Reports/ReportScreen';
import ApplicationScreen from './Applications/ApplicationScreen';


//importing icons template
import NavbarIcons from './NavbarIcons'; 

const Tab = createBottomTabNavigator();

let applicationName = "Applications";
let washroomName = "Washrooms";
let reportName = "Reports";
let newsName = "News";


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

                <Tab.Screen name={applicationName} component={ApplicationScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={washroomName} component={WashroomScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={reportName} component={ReportScreen} options={{ headerShown: false }}/>
                <Tab.Screen name={newsName} component={AdminNewsScreen} options={{ headerShown: false }}/>
                

            </Tab.Navigator>
        </NavigationContainer>

    );

}

export default NavbarContainer;