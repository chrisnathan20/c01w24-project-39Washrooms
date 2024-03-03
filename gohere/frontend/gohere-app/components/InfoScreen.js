// Import necessary React and React Native components and libraries.
import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text } from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel-new';

const InfoScreen = () => {

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
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>

        
    );
};

//Stylesheet for styling the component's UI
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
    },
    Carouselcontainer: {
        flexGrow: 1,
        justifyContent: 'center',
        top: 200,
        
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
        color: 'red',
        textAlign: 'left',
        top: 150,
        left: 20

    },

    paragraph_text: {
        justifyContent: 'center',
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
        top: 160,
        left: 18,
        marginRight: 20,
        lineHeight: 30

    },

    subheading_text: {
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'left',
        top: 180,
        left: 20

    },

    paginationContainer: {
        bottom: 172
      },
      
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        marginHorizontal:-4 ,
        alignItems: 'center'
      },
});

export default InfoScreen;
