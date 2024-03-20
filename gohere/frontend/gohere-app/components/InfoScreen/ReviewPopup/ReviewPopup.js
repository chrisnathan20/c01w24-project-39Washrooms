import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, Linking, Platform, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

/*
HOW TO USE:

- Add import statement:
import ReviewPopup from './ReviewPopup';

- Add variable declaration:
const [isReviewPopupVisible, setReviewPopupVisible] = useState(false);

- Add following line where you want to bring up the popup:
setReviewPopupVisible(true);

example: 
    const handlePopup = () => {
        setReviewPopupVisible(true);
    }

- Add the following to the return statement:
<ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />
{isReviewPopupVisible && <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />}

NOTE: ReviewPopup should be the first component in <View>

Example: 
 <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
    <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />
    <Text>Card Screen</Text>
    <Button
        onPress={handlePopup}
        title="View Popup"
    />
        
    {isReviewPopupVisible && <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />}
</View>
*/


const ReviewPopup = ({ visible, onClose }) => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const [isVisible, setIsVisible] = useState(false);
    let review_site = "https://play.google.com/store/apps/details?id=com.GoHere.GoHere&hl=en&gl=US&showAllReviews=true";

    if (Platform.OS == 'ios') {
        review_site = "https://apps.apple.com/ca/app/gohere-washroom-locator/id1011069090?action=write-review";
    }

    const handleSubmitReview = () => {
        // Handle submission of review (e.g., send feedback to server)
        Linking.openURL(review_site);
        setIsVisible(false); // Close the modal after submission
        onClose();
    };

    const handleCancelReview = () => {
        setIsVisible(false); // Close the modal without taking further action
        onClose();
    };

    useEffect(() => {
        setIsVisible(visible)
    }, [visible])

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <View style={styles.text}>
                        <Text style={styles.title}>Enjoying GoHere?</Text>
                        <Text style={styles.review}>Leave a Review</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleSubmitReview} style={[styles.submitButton]}>
                                <Text style={styles.submitText}>Submit Review</Text>
                            </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelReview} style={[styles.cancelButton]}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({


    container: {
        width: width,
        height: height,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#DA5C59',
    },

    text: {
        horizontalPadding: 20,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },

    title: {
        marginBottom: 0,
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        //fontWeight: 'bold',
        color: '#DA5C59',
        paddingHorizontal: 30,
        paddingTop: 10,
    },

    review: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#DA5C59',
    },  

    submitButton: {
        paddingHorizontal: 18,
        padding: 7,
        marginTop: 15,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
        //margin: 15,
    },

    cancelButton: {
        paddingHorizontal: 45,
        padding: 7,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: '#FFF',
        borderColor: '#DA5C59',
        margin: 15,
    },
    

    cancelText: {
        marginTop: 0,
        color: '#ff0000', // Set text color to red
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
    },

    submitText: {
        //marginTop: 10,
        color: '#FFF',
        //alignItems: 'center',


        fontFamily: 'Poppins-Medium',
        fontSize: 15,

    },

    buttonContainer: {
        marginTop: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        //flexDirection: 'row',
    },
    button: {
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'

    },

});
/*
    loginButton: {
        padding: 10,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
    },
    loginButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
*/
export default ReviewPopup;

