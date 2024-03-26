import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { GOHERE_SERVER_URL } from '../../../env.js';

const MyApplications = ( {navigation} )=>{
    const [selectedFilter, setSelectedFilter] = useState('Accepted');
    const [applications, setApplications] = useState([]);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    useFocusEffect(
        React.useCallback(() => {
          let isActive = true; // This flag is to prevent setting state on unmounted component
    
          const fetchApplications = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }
    
            try {
                const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/applications`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
    
                if (isActive) {
                  setApplications(data.applications);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
          };
    
          fetchApplications();
    
          return () => {
            isActive = false; // Cleanup function to set the flag to false when component unmounts
          };
        }, [])
      );

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const filterToStatusCode = {
        'Pending': 0,
        'Pre-screening': 1,
        'On-site review': 2,
        'Final review': 3,
        'Accepted': 4,
        'Rejected': 5
    };
    
    const filteredApplications = applications.filter(application => {
        return application.status === filterToStatusCode[selectedFilter];
    });
    
    const handleSelectFilter = (filter) => {
        setSelectedFilter(filter);
    };

    const handleNewApp = async () => {
        navigation.navigate('Add washroom');
    };

    // renderItem function for FlatList
    const renderItem = ({ item }) => {
        const formattedDate = item.lastupdated.split('T')[0];

        return(
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('More Info', { applicationId: item.applicationid })}>
                <View style={{backgroundColor: '#DA5C59', alignItems: 'center', justifyContent: 'center', padding: 15, borderBottomLeftRadius: 10, borderTopLeftRadius: 10}}>
                    <Text style={ {color: "#fff", fontFamily: 'Poppins-Bold', fontSize: 11} }>Last Updated:</Text>
                    <Text style={ {color: "#fff", fontFamily: 'Poppins-Bold', fontSize: 11} }>{formattedDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, padding: 15}}>
                    <View style={{marginRight: 20, flex: 1}}>
                        <Text style={ {color: "#000", fontFamily: 'Poppins-SemiBold', fontSize: 18} }>{item.locationname}</Text>
                        <Text style={ {fontFamily: 'Poppins-Medium', fontSize: 11, color: "#9D9D9D"} }>{item.address1} {item.address2}</Text>
                        <Text style={ {fontFamily: 'Poppins-Medium', fontSize: 11, color: "#9D9D9D"} }>{item.city} {item.province} {item.postalcode}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Image style={{ width: 25, height: 25}} source={require("../../../assets/more-info.png")}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyComponent = () => {
        return (
            <View>
                <Image style={{width: 201, height: 197, resizeMode: 'contain', marginBottom: 10}}source={require("../../../assets/no-app.png")}/>
                <Text style={{fontFamily: 'Poppins-Medium', fontSize: 20, color: "#000"}}>No applications found</Text>   
            </View>
        );
    };

    const filters = ['Accepted', 'Pending', 'Pre-screening', 'On-site review', 'Final review', 'Rejected'];
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.topHeading}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 28, color: '#DA5C59', flex: 1}}>My Applications</Text>
                <TouchableOpacity style={styles.newButton} onPress={handleNewApp}>
                    <Image style={styles.image} source={require("../../../assets/newApp.png")}/>
                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: '#fff'}}>New</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginBottom: 15, height: 24}}>
                <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
                >
                    {filters.map((filter, index) => (
                        <TouchableOpacity
                        key={filter}
                        onPress={() => handleSelectFilter(filter)}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.filterButtonActive,
                            { marginLeft: index === 0 ? 0 : 10 }
                        ]}
                        >
                        <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                            {filter}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <FlatList
            data={filteredApplications}
            renderItem={renderItem}
            keyExtractor={item => item.applicationid.toString()}
            ListEmptyComponent={renderEmptyComponent}
            style={styles.list}
            contentContainerStyle={filteredApplications.length === 0 ? { alignItems: 'center', flex: 1, justifyContent: 'center' } : null}
            />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    topHeading:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 20
    },
    newButton:{
        backgroundColor: '#DA5C59',
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 0,
        borderRadius: 20,
        height: 30,
        alignItems: 'center'
    },
    image: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    scrollContentContainer: {
        paddingHorizontal: 20,
        height: 24,
    },
    filterButton: {
        borderRadius: 20, 
        backgroundColor: '#F3F3F3',
        paddingHorizontal: 16, 
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
    },
    filterButtonActive: {
        backgroundColor: '#DA5C59',
    },
    filterText: {
        color: '#64686B',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 11,
    },
    filterTextActive: {
        color: 'white', 
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        elevation: 5,
        marginVertical: 15,
        marginHorizontal: 20
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    bottomLine: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    list: {
        flex: 1,
    },
  });

export default MyApplications;