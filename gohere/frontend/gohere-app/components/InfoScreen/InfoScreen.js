import ReviewPopup from './ReviewPopup/ReviewPopup.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet,Text, TouchableOpacity,Linking, Dimensions, ScrollView, FlatList } from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel-new';
import CardImage from './newsCardImage'
import { GOHERE_SERVER_URL, GOOGLE_API_KEY } from '../../env.js';
import { useFonts } from 'expo-font';

const InfoScreen = () => {
  
    const [isReviewPopupVisible, setReviewPopupVisible] = useState(false);
    const [bannerImages, setBannerImages] = useState([]);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [data_news, setDataNews] = useState([]) //useState for the response of getAllNews
    const carouselRef = useRef(null);

    //Load fonts
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    });
    
    // Function for receiving the backend response of getAllNews and storing it in data_news
      useEffect(() => {
        data_news_func = async () => {
            try {
             const response = await fetch(`${GOHERE_SERVER_URL}/getAllNews`);
             
            const data = await response.json();
            console.log(data)
            setDataNews(data);
   
           
            } catch (error) {
              console.error('Error fetching image URLs:', error);
            }

            // Schedule the next fetch after a delay
            // setTimeout(data_news_func, 7000); 
        };
   
            data_news_func();

            return () => clearTimeout(data_news_func);
        }, []);
    
    //Fetching all the banner images from the backend (news items and ruby businesses)
    useEffect(() => {
        fetchBImageUrls = async () => {
            try {
                const newsBannerResponse = await fetch(`${GOHERE_SERVER_URL}/allNewsBannerImages`);
                const newsURLResponse = await fetch(`${GOHERE_SERVER_URL}/allNewsURL`);
                const rubyBannerResponse = await fetch(`${GOHERE_SERVER_URL}/allRubyBusinessBanners`);
                
                var rubyBusinessImages = -1;
                var newsImages = -1;
                var newsURL = -1;

                if(newsBannerResponse && newsBannerResponse.ok){
                newsImages = await newsBannerResponse.json();}
                if(rubyBannerResponse && rubyBannerResponse.ok){
                rubyBusinessImages = await rubyBannerResponse.json();}
                if(newsURLResponse && newsURLResponse.ok){
                newsURL = await newsURLResponse.json();}

                const allImages = [];

                let i = 0;
                let j = 0;
                let n = 0

                while ((newsURL!= -1 && newsImages!=-1 && i < newsImages.length) || (rubyBusinessImages !=-1 && j < rubyBusinessImages.length)) {
                    if (newsURL!= -1 && newsImages!=-1 && i < newsImages.length) {
                      allImages.push({
                        im: `${GOHERE_SERVER_URL}/${newsImages[i]}`,
                        source: 'news',
                        link: newsURL[n],
                      });
                      n++;
                    }
          
                    if (rubyBusinessImages!=-1 && j < rubyBusinessImages.length) {
                      allImages.push({
                        im: `${GOHERE_SERVER_URL}/${rubyBusinessImages[j]}`,
                        source: 'ruby',
                      });
                    }
          
                    i++;
                    j++;
                }

                //set the use state with all the images for banner carousel
                setBannerImages(allImages);
                       
            } catch (error) {
              console.error('Error fetching image URLs:', error);
              setError(error.message);
            }

            // Schedule the next fetch after a delay
            setTimeout(fetchBImageUrls, 7000); 
        };
      
        fetchBImageUrls();
        setIsInitialized(true);
        
        return () => clearTimeout(fetchBImageUrls);
        
    }, [isInitialized]);

    useEffect(() => {
        handleCalculatePopup();
    }, []);


    //logic for rating popup 
    handleCalculatePopup = async () => {
        const DAYS_BETWEEN_POPUPS = -1;


        try {
            const storedDate = await AsyncStorage.getItem('date');
            const currentDate = new Date();

            if (storedDate == null) { //If there is no previous date
                //Get the currentDate and store it locally as date since last popup
                await AsyncStorage.setItem('date', currentDate.toString());

                //Change if we are showing popup
                setReviewPopupVisible(true);
            }
            //calculates difference between previous popup date and current date
            const differenceInTime = (currentDate.getTime()) - new Date(storedDate).getTime();
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
            //It is time for a new popup
            if (differenceInDays > DAYS_BETWEEN_POPUPS) {
                //Set the date since last popup to the currentDate
                await AsyncStorage.setItem('date', currentDate.toString());

                //TO NOT REPEAT FOR THE TEST, THIS IS SET HIDDEN
                //setReviewPopupVisible(true);
            } else { //Otherwise, do no show the popup
                setReviewPopupVisible(false);
            }
        } catch (error) {
            console.log('Error reading date from storage:', error);
            setReviewPopupVisible(false);
        }
    }

    // State hook to keep track of the currently active slide in the carousel.
    const [activeSlide_partners, setActiveSlide_partners] = React.useState(0);
    const [activeSlide_newsBanner, setActiveSlide_newsBanner] = React.useState(0);
    const [autoplayDirection, setAutoplayDirection] = useState('forward');
    
    // Array of image sources for the partners carousel
    const data = [
        require('../../assets/Partners/takeda_icon.jpg'),
        require('../../assets/Partners/scotties_icon.jpg'),
        require('../../assets/Partners/merck_icon.jpg'),
        require('../../assets/Partners/gutsy-walk_icon.jpg')
    ];

     //design to create gap between news items
    const newsItemSeparator = () => {
        return <View style={styles.separator} />;
    };


    //logic for autoplay of the banner carousel
    useEffect(() => {
        if(bannerImages!=null && bannerImages.length !=0){
        const autoplayInterval = setInterval(() => {
            if (autoplayDirection === 'forward') {
                // Autoplay forwards until reaching the end
                if (activeSlide_newsBanner < bannerImages.length - 1) {
                    carouselRef.current.snapToNext();
                    setActiveSlide_newsBanner((prevIndex) => prevIndex + 1);
                } else {
                    // If reached the end, switch direction to backward
                    setAutoplayDirection('backward');
                }
            } else if (autoplayDirection === 'backward') {
                // Autoplay backwards after reaching the end
                if (activeSlide_newsBanner > 0) {
                    carouselRef.current.snapToPrev();
                    setActiveSlide_newsBanner((prevIndex) => prevIndex - 1);
                } else {
                    // If reached the beginning, switch direction to forward
                    setAutoplayDirection('forward');
                }
            }
        }, 3000); 

        return () => clearInterval(autoplayInterval); 
    }
    }, [activeSlide_newsBanner, autoplayDirection, bannerImages.length]);


    // Function to render each item (image) in the news banner carousel.
    const renderItem_newsBanner = ({ index }) => {
        const isActive = index === activeSlide_newsBanner;

        const handleItemClick = () => {
            const currentItem = bannerImages[index];
            if (currentItem && currentItem.source === "news" && currentItem.link) {
              Linking.openURL(currentItem.link)
                .catch((err) => console.error('A linking error occurred', err));
            }
          };

        // Ensure imageUrls is available before rendering
        if (!bannerImages || bannerImages.length === 0) {
            console.log(`imageUrls is empty`);
            return null;
        }

        // Banner Carousel
        return (
            <TouchableOpacity onPress={handleItemClick}>
                <View style={[styles.imageContainer_newsBanner]}>
                    <Image
                        source={{ uri: bannerImages[index].im }}
                        style={styles.image_newsBanner}
                    />
                    {/* <BannerImage newsId={item.id}/> */}
                </View>
            </TouchableOpacity>
        );
        
        // Banner Carousel Ends
      };
    

    // Function to render each item (image) in the partners carousel.
    const renderItem_partners = ({ item }) => (
        <View style={styles.imageContainer_partners}>
            <Image source={item} style={styles.image_partners} />
        </View>
    );

    //Function to render each item in the latest news list
    const renderItem_newsScroll = ({ item }) => {

        const handleNewsClick = () => {
            const url = item.url;

            Linking.openURL(url)
                .catch((err) => console.error('A linking error occurred', err));


        };

        return(
            <TouchableOpacity activeOpacity={0.5} onPress={handleNewsClick} style={styles.card}>
                <View style={[styles.newsLeft, {width: '60%'}]}>
                    <Text style={{fontFamily: 'Poppins-Bold', fontSize: 16, lineHeight: 18}}>{item.headline}</Text>
                    <Text style={{fontFamily: 'Poppins-Bold', fontSize: 11, color: '#9D9D9D'}}>{item.createdAt.slice(0, 10)}</Text>
                </View>
                <View style={{width: '40%', alignItems: 'flex-end'}}>
                    <CardImage newsId={item.id}/>
                </View>
            </TouchableOpacity>
        );

    };

    // Screen output when ther are no news items 
    const renderNoNews = () => {
        return (
            <ScrollView style={[styles.container, { paddingHorizontal:30}]}>
                {/*if there are no ruby business banners to display*/}
                {!bannerImages || bannerImages.length === 0 ? (
                <View style={{right:20}}>
                    <View >
                    <Text style={[styles.heading_text, {right:40, left:12}]}>About GoHere</Text>
                    <Text style={[styles.paragraph_text, {right: 40, left:12}]}>Crohn's and Colitis Canada's GoHere program 
                    helps create understanding, supportive and accessible
                    communities by improving washroom access.
                    </Text>
                    <Text style={[styles.heading_text,{right:40, paddingBottom:12, left:12}]}>Our Partners</Text>
                    </View>
            
                    <View style={[styles.Carouselcontainer]}>
                        <Carousel
                            data={data}
                            renderItem={renderItem_partners}
                            sliderWidth={400}
                            itemWidth={230}
                            onSnapToItem={(index) => setActiveSlide_partners(index)}
                            inactiveSlideScale={0.7}
                            inactiveSlideOpacity={1}

                        />
                
                        <View style={[styles.paginationContainer, {left:42}]}>    
                        <Pagination
                            dotsLength={data.length}
                            activeDotIndex={activeSlide_partners}
                            dotStyle={styles.dot}
                            />
                        </View>
                    </View>
                    <Text style={[styles.subheading_text,{right:40, left:12}]}>Latest News</Text>
            
                    <Image source={require('../../assets/noNews.png')} style={{ width: 113, height: 130, marginLeft:135 }} />
                    <Text style={{marginHorizontal:90,textAlign:'center', marginTop:30, bottom:10, fontFamily:'Poppins-Medium', fontSize:15,left:15 }}>Check back later for new updates!</Text>
                </View>

                /*if there are no ruby business banners to display*/
                ) : (
                    <View style={{right:20}}>
                        <View style={[styles.Carouselcontainer, {marginTop:70, paddingHorizontal:30, marginLeft:40}]}>
                        
                            <Carousel
                                ref={carouselRef}
                                data={bannerImages}
                                renderItem={renderItem_newsBanner}
                                sliderWidth={360}
                                itemWidth={190}
                                onSnapToItem={(index) => setActiveSlide_newsBanner(index)}
                                inactiveSlideScale={0.7}
                                inactiveSlideOpacity={1}
                                activeSlideScale={1}
                                enableSnap={true}
                                loop={false}
                            />
                        </View>
                            
                        <View >
                            <Text style={[styles.heading_text, {right:40, left:12}]}>About GoHere</Text>
                            <Text style={[styles.paragraph_text, {right: 40, left:12}]}>Crohn's and Colitis Canada's GoHere program 
                            helps create understanding, supportive and accessible
                            communities by improving washroom access.
                            </Text>
                            <Text style={[styles.heading_text,{right:40, paddingBottom:12, left:12}]}>Our Partners</Text>
                        </View>
            
                        <View style={[styles.Carouselcontainer, {right:25,}]}>
                            <Carousel
                                data={data}
                                renderItem={renderItem_partners}
                                sliderWidth={400}
                                itemWidth={230}
                                onSnapToItem={(index) => setActiveSlide_partners(index)}
                                inactiveSlideScale={0.7}
                                inactiveSlideOpacity={1}

                            />
            
                            <View style={[styles.paginationContainer, {left:42}]}>    
                                <Pagination
                                    dotsLength={data.length}
                                    activeDotIndex={activeSlide_partners}
                                    dotStyle={styles.dot}
                                    />
                            </View>
                        </View>
                        <Text style={[styles.subheading_text,{right:40, left:12}]}>Latest News</Text>
                        
                        <Image source={require('../../assets/noNews.png')} style={{ width: 113, height: 130, marginLeft:135 }} />
                        <Text style={{marginHorizontal:95,textAlign:'center', marginTop:12, fontFamily:'Poppins-Medium', fontSize:15, left:15 }}>Check back later for new updates!</Text>
                        
                    </View>
            
            )}
            </ScrollView>
            
        );
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />
              {isReviewPopupVisible && <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />}
            </View>

            {/*if there are no news items, then renderNoNews function is called */}
                  {data_news.error && data_news.error === "No News Found." ? (
                    renderNoNews()
                  ) : (
                    <ScrollView style={styles.container}>
                        <View style={[styles.Carouselcontainer, {paddingTop: 50}]}>
                            <Carousel
                                ref={carouselRef}
                                data={bannerImages}
                                renderItem={renderItem_newsBanner}
                                sliderWidth={Dimensions.get('window').width}
                                itemWidth={220}
                                onSnapToItem={(index) => setActiveSlide_newsBanner(index)}
                                inactiveSlideScale={0.85}
                                inactiveSlideOpacity={1}
                                activeSlideScale={1.5}
                                enableSnap={true}
                                loop={false}
                            />
                        </View>
                        <View >
                        <Text style={styles.heading_text}>About GoHere</Text>
                        <Text style={styles.paragraph_text}>Crohn's and Colitis Canada's GoHere program 
                        helps create understanding, supportive and accessible
                        communities by improving washroom access.
                        </Text>
                        <Text style={[styles.heading_text]}>Our Partners</Text>
                        </View>

                        <View style={[styles.Carouselcontainer]}>
                            <Carousel
                                data={data}
                                renderItem={renderItem_partners}
                                sliderWidth={Dimensions.get('window').width}
                                itemWidth={230}
                                onSnapToItem={(index) => setActiveSlide_partners(index)}
                                inactiveSlideScale={0.7}
                                inactiveSlideOpacity={1}
                            />
                        
                            <View style={[styles.paginationContainer]}>    
                                <Pagination
                                    dotsLength={data.length}
                                    activeDotIndex={activeSlide_partners}
                                    dotStyle={styles.dot}
                                    />
                            </View>
                        </View>

                        <Text style={[styles.heading_text, {marginTop: 5}]}>Latest News</Text>
                        <View style={styles.flatlistContainer}>
                            {data_news.map((item, index) => {
                                return (
                                    <View key={item.id}>
                                        {renderItem_newsScroll({ item })}
                                        {index !== data_news.length - 1 && newsItemSeparator()}
                                    </View>
                                );
                            })}
                        </View>
                        
                    </ScrollView>
                  )}    
                </View>       
              );
            };

//Stylesheet for styling the component's UI
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
        borderRadius: 15,
        elevation: 5,
        marginVertical: 10,
        padding: 15,
        marginHorizontal: 20
    },
    newsLeft: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    Carouselcontainer: {
        justifyContent: 'center',
        alignItems: 'center',   
    },

    imageContainer_partners: {
        borderRadius: 15,
        borderColor: '#afb3b0',
        backgroundColor: 'white',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },

    imageContainer_newsBanner: {
      display: 'flex',
      width: 220,
    },

    image_newsBanner: {
        width: 220,
        height: 144,
        borderRadius: 15, 
    },

    activeImage_newsBanner: {

    },

    image_partners: {
        width: 228,
        height: 130,
        borderRadius: 15,  
    },
    heading_text: {
        justifyContent: 'center',
        fontSize: 22,
        color: '#DA5C59',
        textAlign: 'left',
        marginTop: 25,
        marginHorizontal: 20,
        marginBottom: 5,
        fontFamily: 'Poppins-Bold'
    },

    paragraph_text: {
        justifyContent: 'center',
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
        marginHorizontal: 20,
        fontFamily:'Poppins-Medium'

    },

    subheading_text: {
        justifyContent: 'center',
        fontSize: 22,
        fontFamily:'Poppins-Bold',
        color: '#DA5C59',
        textAlign: 'left',
        paddingHorizontal: 20,
        bottom:20

    },

    paginationContainer: {
        //left:42
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DA5C59',
        marginHorizontal:-4 ,
        alignItems: 'center',
    },


    flatlistContainer:{

    },

    newsItem:{
        width:325,
        height: 145,
        backgroundColor: '#F6F6F6',
        borderRadius:12,
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
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        paddingTop: 10,
        fontFamily:'Poppins-Bold',
        paddingHorizontal: 1,
        marginRight:140,
        marginLeft:10,

      },

      newsDate:{
        fontSize: 11,
        color: 'grey',
        textAlign: 'left',
        fontFamily:'Poppins-Bold',
        paddingHorizontal: 10,
        marginTop:113,
        marginLeft:4,
        position:'absolute'
      },
      
      separator: {
        height: 10,
        backgroundColor: 'white',
      },
      
});

export default InfoScreen;
