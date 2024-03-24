import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet,Text, TouchableOpacity,Linking,FlatList } from 'react-native';
import CardImage from './adminNewsCardImage.js'
import { GOHERE_SERVER_URL, GOOGLE_API_KEY } from '../../env.js';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
//import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import AdminApplicationScreen from './AdminApplicationScreen'c ;

const NewsListScreen = () => {

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    });

    
    const [data_news, setDataNews] = useState("") //useState for the response of getAllNews
    const navigation = useNavigation();

    // Function for receiving the backend response of getAllNews and storing it in data_news
    useEffect(() => {
        data_news_func = async () => {
            try {
             const response = await fetch(`${GOHERE_SERVER_URL}/getAllNews`);
             const data = await response.json(); // Assuming the response contains JSON data
             
             setDataNews(data);
   
           
           } catch (error) {
              console.error('Error fetching image URLs:', error);
            }

            // Schedule the next fetch after a delay
            setTimeout(data_news_func, 7000); // Fetch data every 5 seconds
          };
   
            data_news_func();

            // Clean-up function to stop fetching when the component unmounts
            return () => clearTimeout(data_news_func);
        }, []);

        

    const handleAddNews = () => {
        navigation.navigate('Add');
    };

        //design to create gap between news items
    const newsItemSeparator = () => {
        return <View style={styles.separator} />;
    };

        const renderItem_newsScroll = ({ item }) => {

            //console.log('Rendering items:', item.headline);
            const handleNewsClick = () => {
                //const url = item.url;
    
                //Linking.openURL(url)
                //.catch((err) => console.error('A linking error occurred', err));

                navigation.navigate('Update', {
                    itemId: item.id,
                    currHeadline: item.headline,
                    currUrl: item.url
                });
                  
    
    
            };

            return(<TouchableOpacity  activeOpacity={0.5} onPress={handleNewsClick} >
                <View style={styles.newsItem}>
                <Text style={styles.newsHeadline}>{item.headline}</Text>
                <Text style={styles.newsDate}>{item.createdAt.slice(0,10)}</Text>
                </View>
    
                {/*created a separate view for styling purposes*/}
                <View style={{height:1}}>
                 {/*given newsId, this component returns the cardImage*/}
                 
                <CardImage newsId={item.id} givenStyle={styles.cardImageStyle} />
                </View>
            </TouchableOpacity>);
    
        };
        if (!fontsLoaded && !fontError) {
            return null;
        }
    return (
        <View style = {styles.container}>
            <FlatList style={[styles.flatlistContainer]}
                data={data_news}
                renderItem={renderItem_newsScroll}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={newsItemSeparator}
                ListHeaderComponent={
                    <View style={[styles.container, { paddingHorizontal:20, flexDirection:'row'}]}>
                    <Text style={[styles.heading_text]}>Manage News</Text>
                    <TouchableOpacity style={{paddingTop:60, right:15}} onPress={handleAddNews}> 
                    <Image style={styles.addButtonStyle} source={require('../../assets/addNews.jpg')} />
                    </TouchableOpacity>
                    </View>}
                ListFooterComponent={newsItemSeparator}
                    />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
        //paddingHorizontal: 10,
    },
    flatlistContainer:{
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        left: 20, 
        zIndex:1, 
        paddingLeft:13, 
        

      },
      newsItem:{
        width:325,
        height: 145,
        backgroundColor: '#F6F6F6',
        //borderColor:'black',
        //borderWidth:2,
        borderRadius:12,
        flexGrow:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 2,
        
        
        
      },
      newsHeadline:{
        fontSize: 17,
        //fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
        paddingTop: 10,
        fontFamily: 'Poppins-Bold',
        paddingHorizontal: 1,
        marginRight:140,
        marginLeft:10,

      },
      newsDate:{
        fontSize: 11,
        //fontWeight: 'bold',
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
        //fontWeight: 'bold',
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
