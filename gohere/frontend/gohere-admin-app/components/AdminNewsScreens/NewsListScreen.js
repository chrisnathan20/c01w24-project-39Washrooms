
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Linking, FlatList } from 'react-native';
import CardImage from './adminNewsCardImage.js';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        navigation.navigate('Add News');
    };

    //  A separator for spacing out news items
    const newsItemSeparator = () => {
        return <View style={styles.separator} />;
    };

    //Rendering the news list
    const renderItem_newsScroll = ({ item }) => {
        const handleNewsClick = () => {
            navigation.navigate('Edit News', {
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

    const renderEmptyComponent = () => {
        return (
            <View>
                <Image style={{width: 201, height: 197, resizeMode: 'contain', marginBottom: 10}}source={require('../../assets/noNewsAdmin.png')}/>
                <Text style={{fontFamily: 'Poppins-Medium', fontSize: 20, color: "#000"}}>No news items found</Text>   
            </View>
        );
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topHeading}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 28, color: '#DA5C59', flex: 1}}>Manage News</Text>
                <TouchableOpacity style={styles.newButton} onPress={handleAddNews}>
                    <Image style={styles.image} source={require('../../assets/newNews.png')}/>
                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: '#fff'}}>New</Text>
                </TouchableOpacity>
            </View>    
            <FlatList
                style={styles.flatlistContainer}
                data={data_news}
                renderItem={renderItem_newsScroll}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyComponent}
                ItemSeparatorComponent={newsItemSeparator}
                ListFooterComponent={newsItemSeparator}
                contentContainerStyle={data_news.error && data_news.error === "No News Found." ? { alignItems: 'center', flex: 1, justifyContent: 'center' } : null}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
    },
    flatlistContainer: {
        flex: 1
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
        left:13
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
        fontSize: 27,
        color: '#DA5C59',
        textAlign: 'left',
        paddingTop: 35,
        paddingHorizontal: 20,
        paddingBottom: 30,
        right:53,
    },

    cardImageStyle:{
        width: 110, height: 110, bottom: 73, borderRadius: 15, marginLeft: 128,
    }
});

export default NewsListScreen;
