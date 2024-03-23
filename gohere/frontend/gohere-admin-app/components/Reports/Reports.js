import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, RefreshControl } from 'react-native';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { GOHERE_SERVER_URL } from '../../env.js';

const Reports = ( {navigation} )=>{
    const [selectedFilter, setSelectedFilter] = useState('Past 3 hours');
    const [refreshing, setRefreshing] = useState(false);
    const [washrooms, setWashrooms] = useState([]);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const fetchWashrooms = async () => {
        try {
          const response = await fetch(`${GOHERE_SERVER_URL}/admin/reports`, {
            method: 'GET'
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          setWashrooms(data.reports);
        } catch (error) {
          console.error("Error fetching washrooms:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
          fetchWashrooms();
          return () => {};
        }, [])
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchWashrooms();
        setRefreshing(false);
    }, []);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const filterMapping = {
        'Past 3 hours': 'reports_past_3_hours',
        'Past 48 hours': 'reports_past_48_hours',
        'Past week': 'reports_past_week',
        'Past month': 'reports_past_month',
        'Past year': 'reports_past_year',
        'All time': 'reports_all_time'
    };
    
    const filteredWashrooms = washrooms.filter(washroom => {
        const filterKey = filterMapping[selectedFilter];
        return washroom[filterKey] > 0;
    });
    
    const handleSelectFilter = (filter) => {
        setSelectedFilter(filter);
    };

    // renderItem function for FlatList
    const renderItem = ({ item }) => {

        return(
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('More Info', { washroomId: item.washroomid })}>
                <View style={{backgroundColor: '#DA5C59', alignItems: 'center', justifyContent: 'center', padding: 15, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, width: 110}}>
                    <Text style={ {color: "#fff", fontFamily: 'Poppins-Bold', fontSize: 11} }>{item[filterMapping[selectedFilter]]} reports</Text>
                    <Text style={ {color: "#fff", fontFamily: 'Poppins-Bold', fontSize: 11} }>{selectedFilter}</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, padding: 15}}>
                    <View style={{marginRight: 20, flex: 1}}>
                        <Text style={ {color: "#000", fontFamily: 'Poppins-SemiBold', fontSize: 18} }>{item.washroomname}</Text>
                        <Text style={ {fontFamily: 'Poppins-Medium', fontSize: 11, color: "#9D9D9D"} }>{item.address1} {item.address2}</Text>
                        <Text style={ {fontFamily: 'Poppins-Medium', fontSize: 11, color: "#9D9D9D"} }>{item.city} {item.province} {item.postalcode}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Image style={{ width: 25, height: 25}} source={require("../../assets/more-info.png")}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyComponent = () => {
        return (
            <View style={styles.emptyContainer}>
                <Image style={{width: 201, height: 197, resizeMode: 'contain', marginBottom: 10}}source={require("../../assets/no-app.png")}/>
                <Text style={{fontFamily: 'Poppins-Medium', fontSize: 20, color: "#000", textAlign: 'center' }}>No reports found</Text>   
            </View>
        );
    };

    const filters = ['Past 3 hours', 'Past 48 hours', 'Past week', 'Past month', 'Past year', 'All time'];
    return(
        <View style={styles.container}>
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
            data={filteredWashrooms}
            renderItem={renderItem}
            keyExtractor={item => item.washroomid.toString()}
            ListEmptyComponent={renderEmptyComponent}
            style={styles.list}
            contentContainerStyle={filteredWashrooms.length === 0 ? { alignItems: 'center', flex: 1, justifyContent: 'center' } : null}
            refreshControl={
                <RefreshControl
                  refreshing={refreshing} // This should be a state variable indicating whether the list is being refreshed
                  onRefresh={onRefresh} // This should be the function that handles the refresh logic
                />
            }
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
  });

export default Reports;