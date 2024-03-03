//Info screen backup
import { View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';

import ReviewPopup from './ReviewPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InfoScreenTest() {
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

 
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />
            {isReviewPopupVisible && <ReviewPopup isVisible={isReviewPopupVisible} onClose={() => setReviewPopupVisible(false)} />}

        </View>
    );
}
