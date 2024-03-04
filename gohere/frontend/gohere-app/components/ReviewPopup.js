import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Linking, Platform, StyleSheet } from 'react-native';


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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalContent}>
                        <View style={styles.text}>
                            <Text style={styles.title}>Enjoying Go Here?</Text>
                            <Text style={styles.review}>Leave a Review</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity onPress={handleSubmitReview} style={[styles.submitButton]}>
                                    <Text style={styles.submitText}>Submit Review</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={handleCancelReview} style={[styles.cancelButton]}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: '#e1e2ed',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    text: {
        horizontalPadding: 20,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 2,

    },

    submitButton: {
        marginTop: 10,

        paddingBottom: 10, // Adjust padding to accommodate the border
        paddingHorizontal: 30,

        borderBottomWidth: 1, // Add border only to the bottom
        borderTopWidth: 1,
        borderColor: '#d8d8d8', // Choose the color of the border
        paddingBottom: 5, 
        flexDirection: 'row',
    },

    cancelButton: {
        flexDirection: 'row',

        paddingHorizontal: 55,
        paddingBottom: 10,
        borderRadius: 10,
    },

    cancelText: {
        marginTop: 10,
        color: '#ff0000', // Set text color to red
        alignItems: 'center'
    },

    submitText: {
        marginTop: 10,
        color: '#000000', // Set text color to red
        alignItems: 'center'
    },

    buttonContainer: {
        marginTop: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'

    },

});

export default ReviewPopup;

