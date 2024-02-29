import React, {useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';


export default function CardScreenTest() {
    //const [rated, setRated] = useState(false);

    const showReviewPopUp = () => {
      const options = {
        AppleAppID: "1011069090",
        GooglePackageName: "com.GoHere.GoHere",
        AmazonPackageName: "com.GoHere.GoHere",
        OtherAndroidURL: "https://play.google.com/store/apps/details?id=com.GoHere.GoHere&hl=en&gl=US",
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: true,
        openAppStoreIfInAppFails: true,
        fallbackPlatformURL: "https://crohnsandcolitis.ca/",
      };
      
      Rate.rate(options, (success, errorMessage) => {
        if (success) {
          // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
          setRated(true);
        }
        if (errorMessage) {
          // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
          console.error(`Rate.rate() error: ${errorMessage}`);
        }
      });
      
    };
    
      useEffect(() => {
        // Show review pop-up only if the user hasn't rated the app yet
          showReviewPopUp();
      });



  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>Card Screen</Text>
    </View>
  );
}
