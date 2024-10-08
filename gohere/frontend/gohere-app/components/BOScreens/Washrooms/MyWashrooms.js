import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { GOHERE_SERVER_URL } from '../../../env.js';

const MyWashrooms = ( {navigation} ) => {
    const [washrooms, setWashrooms] = useState([]);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    useFocusEffect(
        React.useCallback(() => {
          let isActive = true; // This flag is to prevent setting state on unmounted component
    
          const fetchWashrooms = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }
    
            try {
                const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/washrooms`, {
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
                  setWashrooms(data.washrooms);
                }
            } catch (error) {
                console.error("Error fetching washrooms:", error);
            }
          };
    
          fetchWashrooms();
    
          return () => {
            isActive = false; // Cleanup function to set the flag to false when component unmounts
          };
        }, [])
    );

    if (!fontsLoaded && !fontError) {
        return null;
    }

    // renderItem function for FlatList
    const renderItem = ({ item }) => {
        return(
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('More Info', { washroomId: item.washroomid })}>
                <View style={{ flexDirection: 'row', flex: 1, padding: 15}}>
                    <View style={{marginRight: 20, flex: 1}}>
                        <Text style={ {color: "#000", fontFamily: 'Poppins-SemiBold', fontSize: 18} }>{item.washroomname}</Text>
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
                <Text style={{fontFamily: 'Poppins-Medium', fontSize: 20, color: "#000"}}>No washrooms found</Text>   
            </View>
        );
    };
    return (
        <View style = {styles.container}>
            <FlatList
            data={washrooms}
            renderItem={renderItem}
            keyExtractor={item => item.washroomid.toString()}
            ListEmptyComponent={renderEmptyComponent}
            style={styles.list}
            contentContainerStyle={washrooms.length === 0 ? { alignItems: 'center', flex: 1, justifyContent: 'center' } : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        flex: 1,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        elevation: 5,
        marginVertical: 15,
        marginHorizontal: 20
    },
});

export default MyWashrooms;