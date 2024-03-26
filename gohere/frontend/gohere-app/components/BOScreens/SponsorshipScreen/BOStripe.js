import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Image, Button, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StripeProvider, CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { GOHERE_SERVER_URL } from '../../../env.js';
import { useFonts } from 'expo-font';
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useIsFocused, useRoute  } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';




console.log(GOHERE_SERVER_URL);

const BOStripe = () => {
const navigation = useNavigation();
const route = useRoute();

const [amount, setAmount] = useState('00');
const [cardDetails, setCardDetails] = useState();
const { confirmPayment, loading } = useConfirmPayment();
const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
const [bottomSheetIndex, setBottomSheetIndex] = useState(0);
const isInitialMount = useRef(true);
const isFocused = useIsFocused();
const cardFieldRef = useRef(null);
const {toNextTier, myTier} = route.params;

const sponsorTier = {
    0: "Basic",
    1: "Bronze",
    2: "Silver",
    3: "Gold",
    4: "Ruby",
}

//When first mounted, wipe out every input
useEffect(() => {
if (isFocused && !isInitialMount.current) {

    console.log(myTier);
    setBottomSheetVisible(false);
    setSelectedButtonIndex(5);
    setAmount('00');

}
isInitialMount.current = false;
}, [isFocused]);

//autofocus on card when bottom sheet is up
useEffect(() => {
if (bottomSheetVisible) {
    cardFieldRef.current?.focus();
}
}, [bottomSheetVisible]);


//Send payment intent to backend
const fetchPaymentIntentClientSecret = async () => {
const response = await fetch(`${GOHERE_SERVER_URL}/create-payment-intent`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amount }),
});

const { clientSecret, error } = await response.json();
return { clientSecret, error };

};

const updateDonationDatabase = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
    console.log('No token found');
        return;
    }
    const requestBody = {amount: amount/100};
    try {
        const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/donate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)});

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Donation updated in database");
    }catch(error){
        console.error("Error updating donation in database:", error);
    }
};

const handleConfirmPress = async () => {
console.log("Donation amount:", amount);
console.log("Card Details:", cardDetails);

if (!cardDetails?.complete || !amount) {
    Alert.alert("Please enter amount and complete card detail");
    return;
}

try {
    const { clientSecret, error } = await fetchPaymentIntentClientSecret();
    if (error) {
    console.log("Unable to process payment: ", error);
    alert(`Unable to process payment`);
    } else {

    const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
    });

    if (error) {
        alert(`Payment confirmation error: ${error.message}`);
    } else if (paymentIntent) {
        updateDonationDatabase();
        console.log('payment successful');
        navigation.navigate('BOThankYou');
    }
    }
} catch (e) {
    console.log("error at donate press");
    console.log(e);
}
}


//When custom amount is changed, unselect all button, modify amount to be in cents and remove $ sign
const handleAmountChange = (text) => {
setSelectedButtonIndex(5)
text = text.replace('$', '');
text = text + '00';
//console.log("amount raw:", text);
setAmount(text);
};


const handleButtonPress = (index) => {
setSelectedButtonIndex(index);
if (index == 0) {
    setAmount("200");
} else if (index == 1) {
    setAmount("500");
} else if (index == 2) {
    setAmount("1000");
} else if (index == 3) {
    setAmount("1500");
} else if (index == 5) {
    setAmount("00");
}
};

//Bottom sheet only appear when amount is set
const openBottomSheet = () => {
if (amount != "00") {
    setBottomSheetVisible(true);
    setBottomSheetIndex(1);
    console.log(myTier);
}
};


const closeBottomSheet = () => {
setBottomSheetVisible(false);
setBottomSheetIndex(-1);
};



  return (
    <StripeProvider publishableKey="pk_test_51Osv0FILaeH045jx2v6duOwIm87GQaAvPdgSqFUtT1CRxrQkugMOeCubolzbfsS6rDW1Tvht1ZInSeOkYQwZL9Lb00vd1nr2dO">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <GestureHandlerRootView style={styles.gestureHandler}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>

            <View style={styles.headerContainer}>
              <Image source={require('../../../assets/heart.png')} style={styles.heartIcon} />
              <Text style={styles.headerText}>Support the GoHere program!</Text>
            </View>

            <View style={styles.buttonContainer}>
                {myTier<3 ? (<Text style={styles.nextTierText}>${toNextTier} more to become a {sponsorTier[myTier+1]} Sponsor</Text>): null}
            </View>

            <View style={styles.customContainer}>
              <View style={styles.customAmount}>
                <View style={styles.predefinedTextContainer}>
                  <Text style={styles.predefinedText}>Custom Amount</Text>
                </View>
                <TextInput
                  style={styles.input}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  value={(amount != '00') ? `$${amount.slice(0, -2)}` : ''}
                />
              </View>
            </View>



            <TouchableOpacity
              onPress={openBottomSheet}
              style={{
                backgroundColor: loading ? 'grey' : '#DA5C59',
                padding: 10,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                height: 45,
              }}
              disabled={loading}
            >
              <Text style={styles.predefinedText}>Donate</Text>
            </TouchableOpacity>
          </View>



          {/* Render BottomSheet only when visible */}
          {bottomSheetVisible && (
            <BottomSheet
              onClose={closeBottomSheet}
              height={300} // Adjust the height as needed
              snapPoints={['100%', '100%']}
              index={bottomSheetIndex}
            //enablePanDownToClose={true}


            >
              <View style={styles.bottomSheetContent}>
                <View style={styles.headerContainer}>
                  <Image source={require('../../../assets/creditCard.png')} style={styles.cardIcon} />
                  <Text style={styles.headerText}>Confirm Payment</Text>
                </View>
                <TouchableOpacity
                  onPress={closeBottomSheet}
                  style={{

                    position: 'absolute',
                    top: 0,
                    right: 10,
                    zIndex: 1,

                  }}
                >
                  <Image source={require('../../../assets/xButton.png')} style={styles.backButton} />
                </TouchableOpacity>

                <CardField
                  ref={cardFieldRef}
                  postalCodeEnabled={false}
                  cardStyle={styles.card}
                  style={styles.cardContainer}
                  onCardChange={cardDetails => setCardDetails(cardDetails)}
                />
                <TouchableOpacity
                  onPress={handleConfirmPress}
                  style={{
                    backgroundColor: (loading || cardDetails?.complete !== true || amount == "00") ? 'grey' : '#DA5C59',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 50,

                  }}
                  disabled={loading || cardDetails?.complete !== true || amount == "00"}
                >
                  <Text style={styles.predefinedText}>CONFIRM AMOUNT - ${amount.slice(0, -2)}</Text>
                </TouchableOpacity>


              </View>
            </BottomSheet>)}

        </View>
      </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </StripeProvider>
  );
};




export default BOStripe;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 160,


  },

  card: {
    backgroundColor: "#eeeeee",
    borderRadius: 10,
  },
  cardContainer: {
    //backgroundColor: 'red',
    height: 50,
    marginVertical: 30,
    width: "100%",

  },
  predefinedTextContainer: {
    backgroundColor: '#DA5C59', // Background color for the predefined text
    paddingHorizontal: 30, // Add padding to the container
    borderTopLeftRadius: 15, // Rounded top-left corner
    borderBottomLeftRadius: 15, // Rounded bottom-left corner
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
  },

  predefinedText: {
    color: 'white', // Text color for the predefined text
    //fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },

  input: {
    //backgroundColor: 'pink',
    flex: 1, // Take remaining space
    paddingTop: 5, // Add vertical padding to align with predefined text
    paddingHorizontal: 5, // Add horizontal padding for input field
    color: '#DA5C59',
    borderTopRightRadius: 5, // Rounded top-right corner
    borderBottomRightRadius: 5, // Rounded bottom-right corner
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
    textAlign: 'center',



  },
  customAmount: {

    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, // Add border for visual separation
    borderColor: '#DA5C59', // Border color
    borderRadius: 15, // Rounded corners for the container
    backgroundColor: 'white',
    height: 40,
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    //marginHorizontal: 40,
  },

  headerContainer: {
    //flex:1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  headerText: {
    color: 'black', // Text color for the predefined text
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    paddingBottom: 20,
  },

  customContainer: {
    paddingBottom: 35,
    //paddingHorizontal:40,
  },

  bottomSheetContent: {
    paddingHorizontal: 35,
    flexDirection: 'column',
    alignItems: 'center',
  },

  gestureHandler: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",

  },
  contentContainer: {
    paddingHorizontal: 40,

  },

  heartIcon: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  backButton: {
    height: 30,
    width: 30,
    resizeMode: 'contain',

  },
  cardIcon: {
    width: 60,
    height: 60,
    marginTop: 50,
  },

  nextTierText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    width: 300,
  },

});


