//Info screen backup
/*

banner over news array
just hardcode the image to newsImage_1.png for now
if index 1 then next
try to fix banner issue

get endpoint for ruby images -- work with hardcoded
get endpoint for news

cardimage is item 4
bannerimage is item 5
url is item 1

*/
import ReviewPopup from './ReviewPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
// export default function InfoScreenTest() {
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, Button,TouchableOpacity,Linking,ScrollView,FlatList, Animated } from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel-new';
import newsImage1 from '../assets/newsImage_1.png';
import BannerImage from './newsBannerImage'
import { GOHERE_SERVER_URL } from '@env';

const InfoScreen = () => {
  
    const [isReviewPopupVisible, setReviewPopupVisible] = useState(false);
    const [bannerImages, setBannerImages] = useState([]);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // For testing by wiping stored date to prompt another review popup 
    //const resetDateKey = async () => {
    //    try {
    //        await AsyncStorage.removeItem('date');
    //    } catch (error) {
    //        console.error('Error removing disease key from AsyncStorage:', error);
    //    }
    //};
    
    
    useEffect(() => {
        handleCalculatePopup();
        // Call the function to check popup status
        const fetchBImageUrls = async () => {
            try {
                console.log("hello");
                const newsBannerResponse = await fetch(`${GOHERE_SERVER_URL}/allNewsBannerImages`);
                const newsURLResponse = await fetch(`${GOHERE_SERVER_URL}/allNewsURL`);

                const rubyBannerResponse = await fetch(`${GOHERE_SERVER_URL}/allRubyBusinessBanners`);
                //console.log("hello2");
                //console.log(newsBannerResponse);
      
                //if (!newsBannerResponse.ok) {
                if (!newsBannerResponse.ok || !rubyBannerResponse.ok) {
                    throw new Error('One or more requests failed.');
                }
        
                const newsImages = await newsBannerResponse.json();
                const rubyBusinessImages = await rubyBannerResponse.json();
                const newsURL = await newsURLResponse.json();
                console.log("HELLO");
                console.log(newsURL);
                const allImages = [];

                let i = 0;
                let j = 0;
                let n = 0

                //while (i < newsImages.length) {
                while (i < newsImages.length || j < rubyBusinessImages.length) {
                    if (i < newsImages.length) {
                      //allImages.push(image:newsImages[i]);
                      allImages.push({
                        im: `${GOHERE_SERVER_URL}/${newsImages[i]}`,
                        source: 'news',
                        link: newsURL[n],
                      });
                      n++;
                    }
          
                    if (j < rubyBusinessImages.length) {
                      //allImages.push(rubyBusinessImages[j]);
                      allImages.push({
                        im: `${GOHERE_SERVER_URL}/${rubyBusinessImages[j]}`,
                        source: 'ruby',
                      });
                    }
          
                    i++;
                    j++;
                }
                // console.log("this is all images");
                // console.log(allImages); 

                //const imageUrls = allImages.map(imagePath => `${GOHERE_SERVER_URL}/${imagePath}`);
                //imageUrls = allImages[0];
                //setBannerImages(imageUrls);
                setBannerImages(allImages);
                console.log(allImages);

                //console.log("this is imageURLS");
                //console.log(imageUrls);
        
      
            } catch (error) {
              console.error('Error fetching image URLs:', error);
              setError(error.message);
            }
        }
      
        fetchBImageUrls();
        setIsInitialized(true);
        
    }, [isInitialized]);


    handleCalculatePopup = async () => {
        const DAYS_BETWEEN_POPUPS = -1;
        //Uncomment to wipe stored date
        //resetDateKey();

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
 

    // Array of image sources for the partners carousel
    const data = [
        require('../assets/Partners/takeda_icon.jpg'),
        require('../assets/Partners/scotties_icon.jpg'),
        require('../assets/Partners/merck_icon.jpg'),
        require('../assets/Partners/gutsy-walk_icon.jpg')
    ];

    // Array of image sources for the news scroll.
    const data_news = [
        [1, 'https://crohnsandcolitis.ca/News-Events/News-Releases/Fostering-Excellence-in-IBD-Research-Insights-from',
         'Fostering Excellence in IBD Research: Insights from the Meeting of the Minds Conference', 
         '12-12-2023', newsImage1],
        [2, 'mock_url_2', 'Headline', 'mock_date_2', newsImage1],
        [3, 'mock_url_3', 'mock_headline_3', 'mock_date_3', newsImage1],

    ];



    const newsItemSeparator = () => {
        return <View style={styles.separator} />;
    };

      // Function to render each item (image) in the news banner carousel.
    const renderItem_newsBanner = ({ index }) => {
        const isActive = index === activeSlide_newsBanner;

        
        const handleItemClick = () => {
            const currentItem = bannerImages[index];
            if (currentItem && currentItem.source === "news" && currentItem.link) {
              Linking.openURL(currentItem.link)
                .catch((err) => console.error('A linking error occurred', err));
            }
            console.log(`Clicked item at index ${index}`);
          };

        //console.log(`Item at index ${index} is active: ${isActive}`);

        // Ensure imageUrls is available before rendering
        if (!bannerImages || bannerImages.length === 0) {
            console.log(`imageUrls is empty`);
            return null;
        }
        console.log(bannerImages);
        // Banner Carousel
        return (
            <TouchableOpacity onPress={handleItemClick}>
                <View style={[styles.imageContainer_newsBanner]}>
                    <Image
                        source={{ uri: bannerImages[index].im }}
                        style={[styles.image_newsBanner, {marginLeft: -12,
                        width: isActive ? 220: 200,
                        height: isActive ? 140: 120,
                        }]}
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
            <Image source={item} style={[styles.image_partners]} />
        </View>
    );

    const renderItem_newsScroll = ({ item }) => {
        console.log('Rendering item:', item[2]);
        const handleNewsClick = () => {
            const url = item[1];
            Linking.openURL(url)
                .catch((err) => console.error('A linking error occurred', err));

        };

        return(
            <TouchableOpacity style={styles.newsItem} onPress={handleNewsClick}>
                <Image source={item[4]} style={{ width: 110, height: 110, marginTop:15, borderRadius:15, marginLeft:195,}}/>
                <Text style={styles.newsHeadline}>{item[2]}</Text>
                <Text style={styles.newsDate}>{item[3]}</Text>
            
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />
              {isReviewPopupVisible && <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />}
            </View>
            
            <FlatList style={{ left: 20, zIndex:1, paddingLeft:13, }}
                data={data_news}
                renderItem={renderItem_newsScroll}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={newsItemSeparator}
                ListHeaderComponent={
                    <View style={[styles.container, { paddingHorizontal:20}]}>
                        {/* Banner Carousel */}
                        <View style={[styles.Carouselcontainer, {paddingTop:60, paddingRight:30, marginRight:10}]}>
                            
                            <Carousel
                                data={bannerImages}
                                renderItem={renderItem_newsBanner}
                                sliderWidth={360}
                                itemWidth={190}
                                onSnapToItem={(index) => setActiveSlide_newsBanner(index)}
                                inactiveSlideScale={0.7}
                                inactiveSlideOpacity={1}
                                enableSnap={true}
                                //loop={true}
                            />
                        </View>
                        {/* Banner Carousel Ends */}
                
                        <View >
                            <Text style={[styles.heading_text, {right:40}]}>About GoHere</Text>
                            <Text style={[styles.paragraph_text, {right: 40}]}>Crohn's and Colitis Canada's GoHere program 
                                helps create understanding, supportive and accessible
                                communities by improving washroom access.
                            </Text>
                            <Text style={[styles.heading_text,{right:40}]}>Our Partners</Text>
                        </View>
                
                        <View style={[styles.Carouselcontainer, {right:30}]}>
                            <Carousel
                                data={data}
                                renderItem={renderItem_partners}
                                sliderWidth={400}
                                itemWidth={230}
                                onSnapToItem={(index) => setActiveSlide_partners(index)}
                                //slideStyle={{ marginLeft: -10, marginRight: -10 }}
                                inactiveSlideScale={0.7}
                                inactiveSlideOpacity={1}
                                //loop={true}
                            />
                
                            <View style={styles.paginationContainer}>    
                                <Pagination
                                    dotsLength={data.length}
                                    activeDotIndex={activeSlide_partners}
                                    dotStyle={styles.dot}
                                    />
                            </View>
                        </View>
                        <Text style={[styles.subheading_text,{right:40}]}>Latest News</Text>
                    </View>
                }
              
            />

        </View>       
    );
};

//Stylesheet for styling the component's UI
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    Carouselcontainer: {
        //flexGrow: 1,
        justifyContent: 'center',
        //paddingTop: 7,
        alignItems: 'center',
        //backgroundColor:'white',
        //position:''
        //left:0
        
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
        //elevation: 5, 
        //marginHorizontal: 20,
    },

    imageContainer_newsBanner: {
        //height: 110,
        //backgroundColor: 'white',
        //borderRadius: 10,
        // borderWidth: 1,
        //     shadowColor: '#000',
        //     shadowOffset: {
        //         width: 0,
        //         height: 2,
        //     },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.5,
        //elevation: 5, 
        // //borderColor: '#afb3b0',
        // borderColor: 'red',
    },
    image_newsBanner: {
        width: 218,
        height: 138,
        borderRadius: 15, 
        borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5, 
        borderColor: '#afb3b0',
        //borderColor: 'red', 
    },
    activeImage_newsBanner: {
        // zIndex: 1 
    },
    image_partners: {
        width: 228,
        height: 130,
        borderRadius: 15,  
    },
    heading_text: {
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#DA5C59',
        textAlign: 'left',
        paddingTop: 17,
        paddingHorizontal: 20

    },

    paragraph_text: {
        justifyContent: 'center',
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
        paddingTop: 7,
        paddingHorizontal: 21,
        marginRight: 20,
        lineHeight: 20

    },

    subheading_text: {
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#DA5C59',
        textAlign: 'left',
        //paddingBottom: 7,
        paddingHorizontal: 20,
        bottom:25

    },

    paginationContainer: {
        bottom: 17,
      },

      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DA5C59',
        marginHorizontal:-4 ,
        alignItems: 'center',
      },

      newsItem:{
        width:325,
        height: 145,
        backgroundColor: '#E6E6E6',
        //justifyContent:'center',
        //alignItems:'center',
        borderColor:'black',
        borderWidth:2,
        borderRadius:12,
        flexGrow:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        
        
      },
      newsHeadline:{
        //justifyContent:'flex-start',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
        paddingTop: 10,
        //paddingHorizontal: 1,
        right:290,
        marginRight:150,
        zIndex:1
      },
      newsDate:{
        fontSize: 11,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'left',
        //paddingTop: 35,
        paddingHorizontal: 10,
        marginTop:113,
        //paddingBottom:13,
        //right:290,
        //marginRight:,
        marginLeft:4,
        position:'absolute'
      },
      separator: {
        height: 10,
        backgroundColor: 'white',
      },
      
});

export default InfoScreen;

/*import React, { useState, useEffect } from 'react';
import { View,Text,Image} from 'react-native';
import { GOHERE_SERVER_URL } from '@env'; // Import the server URL from the .env file
//import { baseGestureHandlerWithMonitorProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';

const NewsImage = ({ newsId }) => {
  //const [imageUrl, setImageUrl] = useState('');
  const [base64String, setBase64String] = useState('');
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardImage = async () => {
      try {
        const response = await fetch(`${GOHERE_SERVER_URL}/newsCardImage/1`);
        if (!response.ok) {
          //throw new Error('Image fetch failed');
          throw new Error(`Image fetch failed with status ${response.status}`);
        }
        console.log(response);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result;
          console.log(base64Data);
          setBase64String(base64Data);
        };
        reader.readAsDataURL(blob);
        //console.log(base64String);
      } catch (error) {
        console.error('Failed to fetch image:', error);
      }
    };

    fetchCardImage();
  }, [newsId]); // Re-fetch if newsId changes

  if (base64String == null) return <View><Text>Loading image...</Text></View>;

  return <Image source={{uri: base64String}} alt="Binary Data" />;
};

export default NewsImage;*/
