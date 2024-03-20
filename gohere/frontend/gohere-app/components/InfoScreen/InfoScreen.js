import ReviewPopup from './ReviewPopup/ReviewPopup.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Linking, FlatList } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel-new';
import CardImage from './newsCardImage.js'
import { GOHERE_SERVER_URL, GOOGLE_API_KEY } from '../../env.js';

const InfoScreen = () => {

    const [isReviewPopupVisible, setReviewPopupVisible] = useState(false);
    const [bannerImages, setBannerImages] = useState([]);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [data_news, setDataNews] = useState("") //useState for the response of getAllNews

    // For testing by wiping stored date to prompt another review popup 


    //const resetDateKey = async () => {
    //    try {
    //        await AsyncStorage.removeItem('date');
    //    } catch (error) {
    //        console.error('Error removing disease key from AsyncStorage:', error);
    //    }
    //};

    // Function for receiving the backend response of getAllNews and storing it in data_news
    useEffect(() => {
        data_news_func = async () => {
            try {
                const response = await fetch(`${GOHERE_SERVER_URL}/getAllNews`);

                if (!response.ok) {
                    throw new Error('Server responded with an error.');
                }
                const data = await response.json(); // Assuming the response contains JSON data

                setDataNews(data); // Update state with the fetched data


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

    useEffect(() => {
        handleCalculatePopup();
        // Call the function to check popup status
        const fetchBImageUrls = async () => {
            try {
                //console.log("hello");
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
                //console.log("HELLO");
                //console.log(newsURL);
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
                //console.log(allImages);

                //console.log("this is imageURLS");
                //console.log(imageUrls);
                // Schedule the next fetch after a delay
                setTimeout(fetchBImageUrls, 7000); // Fetch data every 5 seconds        

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
        require('../../assets/Partners/takeda_icon.jpg'),
        require('../../assets/Partners/scotties_icon.jpg'),
        require('../../assets/Partners/merck_icon.jpg'),
        require('../../assets/Partners/gutsy-walk_icon.jpg')
    ];



    //design to create gap between news items
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
        };

        //console.log(`Item at index ${index} is active: ${isActive}`);

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
                        style={[styles.image_newsBanner, {
                            marginLeft: -13.5,
                            //width: isActive ? 220: 200,
                            //height: isActive ? 140: 120,
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
            <Image source={item} style={styles.image_partners} />
        </View>
    );

    const renderItem_newsScroll = ({ item }) => {

        //console.log('Rendering items:', item.headline);
        const handleNewsClick = () => {
            const url = item.url;

            Linking.openURL(url)
                .catch((err) => console.error('A linking error occurred', err));


        };
        return (<TouchableOpacity activeOpacity={0.5} onPress={handleNewsClick}>
            <View style={styles.newsItem}>
                <Text style={styles.newsHeadline}>{item.headline}</Text>
                <Text style={styles.newsDate}>{item.createdAt.slice(0, 10)}</Text>
            </View>

            {/*created a separate view for styling purposes*/}
            <View style={{ height: 1 }}>
                {/*given newsId, this component returns the cardImage*/}
                <CardImage newsId={item.id} />
            </View>
        </TouchableOpacity>);

    };

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />
                {isReviewPopupVisible && <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />}
            </View>

            <FlatList style={styles.flatlistContainer}
                data={data_news}
                renderItem={renderItem_newsScroll}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={newsItemSeparator}
                ListHeaderComponent={
                    <View style={[styles.container, { paddingHorizontal: 20 }]}>
                        {/* Banner Carousel */}
                        <View style={[styles.Carouselcontainer, { paddingTop: 60, paddingRight: 30, marginRight: 10 }]}>

                            <Carousel
                                data={bannerImages}
                                renderItem={renderItem_newsBanner}
                                sliderWidth={360}
                                itemWidth={190}
                                onSnapToItem={(index) => setActiveSlide_newsBanner(index)}
                                inactiveSlideScale={0.7}
                                inactiveSlideOpacity={1}
                                activeSlideScale={1}
                                enableSnap={true}
                            //loop={true}
                            />
                        </View>
                        {/* Banner Carousel Ends */}

                        <View >
                            <Text style={[styles.heading_text, { right: 40 }]}>About GoHere</Text>
                            <Text style={[styles.paragraph_text, { right: 40 }]}>Crohn's and Colitis Canada's GoHere program
                                helps create understanding, supportive and accessible
                                communities by improving washroom access.
                            </Text>
                            <Text style={[styles.heading_text, { right: 40 }]}>Our Partners</Text>
                        </View>

                        <View style={[styles.Carouselcontainer, { right: 30 }]}>
                            <Carousel
                                data={data}
                                renderItem={renderItem_partners}
                                sliderWidth={400}
                                itemWidth={230}
                                onSnapToItem={(index) => setActiveSlide_partners(index)}
                                inactiveSlideScale={0.7}
                                inactiveSlideOpacity={1}

                            />

                            <View style={styles.paginationContainer}>
                                <Pagination
                                    dotsLength={data.length}
                                    activeDotIndex={activeSlide_partners}
                                    dotStyle={styles.dot}
                                />
                            </View>
                        </View>
                        <Text style={[styles.subheading_text, { right: 40 }]}>Latest News</Text>
                    </View>

                }

                ListFooterComponent={newsItemSeparator}


            />



        </View>
    );
};

//Stylesheet for styling the component's UI
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
        //paddingHorizontal: 10,
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
        //shadowColor: '#000',
        //shadowOffset: {
        //         width: 0,
        //         height: 2,
        //     },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.5,
        // elevation: 5, 
        // borderColor: '#afb3b0',
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
        paddingHorizontal: 20,
        bottom: 25

    },

    paginationContainer: {
        bottom: 17,
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DA5C59',
        marginHorizontal: -4,
        alignItems: 'center',
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
        //borderColor:'black',
        //borderWidth:2,
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
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
        paddingTop: 10,

        paddingHorizontal: 1,
        marginRight: 140,
        marginLeft: 10,

    },
    newsDate: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'left',

        paddingHorizontal: 10,
        marginTop: 113,
        marginLeft: 4,
        position: 'absolute'
    },
    separator: {
        height: 10,
        backgroundColor: 'white',
    },

});

export default InfoScreen;
