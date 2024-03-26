import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Linking, FlatList } from 'react-native';
import CardImage from './adminNewsCardImage.js';
import { GOHERE_SERVER_URL } from '../../env.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const NewsListScreen = () => {

    //Load fonts
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    });

    const [data_news, setDataNews] = useState("");
    const navigation = useNavigation();

    //fetching all news items
    const fetchData = async () => {
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/getAllNews`);
            const data = await response.json();
            setDataNews(data);

        } catch (error) {
            console.error('Error fetching news data:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData(); // Call fetchData function when the screen gains focus
        }, [])
    );

    //When the '+New' button is clicked
    const handleAddNews = () => {
        navigation.navigate('Add');
    };

    //Screen output when there are no news items
    if (data_news.error && data_news.error === "No News Found.") {
        return (
            <View style={[styles.container, { paddingHorizontal: 50, flexDirection: 'row' }]}>
                
                <Text style={styles.heading_text}>Manage News</Text>
                <TouchableOpacity style={{ paddingTop: 70, right: 15, height:50, paddingTop:20, top:33 }} onPress={handleAddNews}>
                    <Image style={styles.addButtonStyle} source={require('../../assets/addNews.jpg')} />
                </TouchableOpacity>
                   
                <Image source={require('../../assets/noNewsAdmin.png')} style={{ width: 176, height: 205, marginTop:240, right:263}} />
                <Text style={{fontFamily: 'Poppins-Medium', fontSize:20, right:458, top:460}}>No news items found</Text>
            </View>
        );
    }

    //  A separator for spacing out news items
    const newsItemSeparator = () => {
        return <View style={styles.separator} />;
    };

    //Rendering the news list
    const renderItem_newsScroll = ({ item }) => {
        const handleNewsClick = () => {
            navigation.navigate('Update', {
                itemId: item.id,
                currHeadline: item.headline,
                currUrl: item.url
            });
        };

        return (
            <TouchableOpacity activeOpacity={0.5} onPress={handleNewsClick}>
                <View style={styles.newsItem}>
                    <Text style={styles.newsHeadline}>{item.headline}</Text>
                    <Text style={styles.newsDate}>{item.createdAt.slice(0, 10)}</Text>
                </View>
                <View style={{ height: 1 }}>
                    <CardImage newsId={item.id} givenStyle={styles.cardImageStyle} />
                </View>
            </TouchableOpacity>
        );
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatlistContainer}
                data={data_news}
                renderItem={renderItem_newsScroll}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={newsItemSeparator}
                ListHeaderComponent={
                    
                    <View style={[styles.container, { paddingHorizontal: 20, flexDirection: 'row' }]}>
                        <Text style={styles.heading_text}>Manage News</Text>
                        <TouchableOpacity style={{ paddingTop: 60, right: 15 }} onPress={handleAddNews}>
                            <Image style={styles.addButtonStyle} source={require('../../assets/addNews.jpg')} />
                        </TouchableOpacity>
                    </View>
                }
                ListFooterComponent={newsItemSeparator}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
    },
    flatlistContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        left: 20,
        zIndex: 1,
        paddingLeft: 13,
    },
    newsItem: {
        width: 325,
        height: 145,
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 2,
    },
    newsHeadline: {
        fontSize: 17,
        color: 'black',
        textAlign: 'left',
        paddingTop: 10,
        fontFamily: 'Poppins-Bold',
        paddingHorizontal: 1,
        marginRight: 140,
        marginLeft: 10,
    },
    newsDate:{
        fontSize: 11,
        color: '#9D9D9D',
        textAlign: 'left',
        fontFamily: 'Poppins-Bold',
        paddingHorizontal: 10,
        marginTop:113,
        marginLeft:4,
        position:'absolute'
    },
    separator: {
        height: 10,
        backgroundColor: 'white',
    },

    heading_text: {
        fontFamily: 'Poppins-Bold',
        justifyContent: 'center',
        fontSize: 30,
        color: '#DA5C59',
        textAlign: 'left',
        paddingTop: 45,
        paddingHorizontal: 20,
        paddingBottom: 30,
        right:40,
    },

    addButtonStyle: {
        width:63,
        height:25,    
    },
    
    cardImageStyle:{
        width: 110, height: 110, bottom: 73, borderRadius: 15, marginLeft: 128,
    }
});

export default NewsListScreen;