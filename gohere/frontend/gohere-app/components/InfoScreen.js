//Info screen backup
import ReviewPopup from './ReviewPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
// export default function InfoScreenTest() {
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, Button } from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel-new';

const InfoScreen = () => {
  
    const [isReviewPopupVisible, setReviewPopupVisible] = useState(false);

    // For testing by wiping stored date to prompt another review popup 
    /*
    const resetDateKey = async () => {
        try {
            await AsyncStorage.removeItem('date');
        } catch (error) {
            console.error('Error removing disease key from AsyncStorage:', error);
        }
    };
    */
    
    useEffect(() => {

        handleCalculatePopup();
  // Call the function to check popup status
    }, []);


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
    const [activeSlide, setActiveSlide] = React.useState(0);

    // Array of image sources for the carousel.
    const data = [
        require('../assets/Partners/takeda_icon.jpg'),
        require('../assets/Partners/scotties_icon.jpg'),
        require('../assets/Partners/merck_icon.jpg'),
        require('../assets/Partners/gutsy-walk_icon.jpg')
    ];

    // Function to render each item (image) in the carousel.
    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />
              {isReviewPopupVisible && <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />}
            </View>
            <View style={{flexShrink: 1}}>
                <Text style={styles.heading_text}>About GoHere</Text>
                <Text style={styles.paragraph_text}>Crohn's and Colitis Canada's GoHere program 
                helps create understanding, supportive and accessible
                communities by improving washroom access.
                </Text>
                <Text style={styles.subheading_text}>Our Partners</Text>
            </View>
            <View style={styles.Carouselcontainer}>
                <Carousel
                    data={data}
                    renderItem={renderItem}
                    sliderWidth={360}
                    itemWidth={322}
                    onSnapToItem={(index) => setActiveSlide(index)}
                />
            </View>
            <View style={styles.paginationContainer}>    
                <Pagination
                    dotsLength={data.length}
                    activeDotIndex={activeSlide}
                    dotStyle={styles.dot}
                    />
            </View>
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
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 20,
        alignItems: 'center'
        
    },
    imageContainer: {
        borderRadius: 15,
        borderColor: '#afb3b0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5, 
        marginHorizontal: 20,
    },
    image: {
        width: 280,
        height: 160,
        borderRadius: 15,
        
        
    },
    heading_text: {
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#DA5C59',
        textAlign: 'left',
        paddingTop: 50,
        paddingHorizontal: 20

    },

    paragraph_text: {
        justifyContent: 'center',
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
        paddingTop: 10,
        paddingHorizontal: 21,
        marginRight: 20,
        lineHeight: 30

    },

    subheading_text: {
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#DA5C59',
        textAlign: 'left',
        paddingTop: 25,
        paddingHorizontal: 20

    },

    paginationContainer: {
        paddingBottom: 350,
      },

      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DA5C59',
        marginHorizontal:-4 ,
        alignItems: 'center',
      },
});

export default InfoScreen;
