import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyApplications = ( {navigation} )=>{
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });
    const [selectedFilter, setSelectedFilter] = useState('Accepted');
    // const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const handleSelectFilter = (filter) => {
        setSelectedFilter(filter);
        // applyFilter(filter); // Apply the filter to your list
    };

    const handleNewApp = async () => {
        console.log("hello");
        navigation.navigate('Add public washroom');
    };

    // renderItem function for FlatList
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.topLine}>
                <Text style={ {color: "#000", fontFamily: 'Poppins-SemiBold', fontSize: 18} }>{item.name}</Text>
                <TouchableOpacity style={styles.moreInfoButton}>
                    <Text style={ {color: "#DA5C59", fontFamily: 'Poppins-SemiBold', fontSize: 11} }>More info</Text>
                </TouchableOpacity>
            </View>
            <Text style={ {fontFamily: 'Poppins-Medium', fontSize: 11, color: "#9D9D9D"} }>{item.address1}</Text>
            <View style={styles.bottomLine}>
                <Text style={ {fontFamily: 'Poppins-Medium', fontSize: 11, color: "#9D9D9D"} }>{item.address2}</Text>
                <Text style={ {fontFamily: 'Poppins-Bold', fontSize: 11, color: "#9D9D9D"} }><Text>Last Updated: </Text>{item.lastUpdated}</Text>
            </View>
        </View>
    );

    const renderEmptyComponent = () => {
        return (
            <View style={styles.emptyContainer}>
                <Image style={{width: 200, height: 195,resizeMode: 'contain'}}source={require("../../../assets/no-app.png")}/>
                <Text style={{fontFamily: 'Poppins-Medium', fontSize: 20, color: "#9D9D9D"}}>No applications found.</Text>   
            </View>
        );
    };

    const filters = ['Accepted', 'Pending', 'Pre-screening', 'On-site review', 'Final review', 'Rejected'];
    const applications = []
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
                    {filters.map((filter) => (
                        <TouchableOpacity
                        key={filter}
                        onPress={() => handleSelectFilter(filter)}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.filterButtonActive,
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
            data={applications}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={renderEmptyComponent}
            style={styles.list}
            />
        </SafeAreaView>
    )
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    topHeading:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginHorizontal: 10
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
        // paddingHorizontal: 10,
        height: 24,
    },
    filterButton: {
        borderRadius: 20, 
        backgroundColor: '#F3F3F3',
        paddingHorizontal: 16, 
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        marginLeft: 10,
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
        backgroundColor: '#F6F6F6',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        margin: 15
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    moreInfoButton: {
        borderWidth: 1.1,
        borderColor: '#DA5C59',
        padding: 1,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomLine: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
  });

export default MyApplications;