//import bottomSheetTextInput from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '../../../env.js';
import { useFonts } from 'expo-font';


const BOSponsorshipScreen = () => {

const navigation = useNavigation();

const [thisMonth, setThisMonth] = useState(true); // toggle button this month or last month
const [businessList, setBusinessList] = useState(['','','']); // top 3 ruby business name
const [businessEmail, setBusinessEmail] = useState(['','','']); // top 3 ruby business email
const [businessDonation, setBusinessDonation] = useState([0, 0, 0]); // top 3 ruby business amount

const [bottomSheetIndex, setBottomSheetIndex] = useState(0); // Initialize bottomSheetIndex state
const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

const [myTotalDonation, setMyTotalDonation] = useState(0); // my total donation
const [monthlyDonation, setMonthlyDonation] = useState(0); // my donation this month

const [myBusinessName, setMyBusinessName] = useState("No Name"); // my business name
const [myTier, setMyTier] = useState(0); // my tier
const [cardReady, setCardReady] = useState(false); // card ready to be displayed
const [stateReady, setStateReady] = useState(false); // state ready to be displayed
const isFocused = useIsFocused();
const [fontsLoaded, fontError] = useFonts({
    'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
});

let myTotal = Math.floor(myTotalDonation);


let threshold = [20, 40, 80];
let progress = myTotal/threshold[myTier];
let toNextTier = threshold[myTier] - myTotal;

const rubyPromotion = async () => {

        
        if(myTier != 3){
            setCardReady(true);
            return;
        }
        
        //console.log("Checking ruby");
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }
    
        try{
                const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/checkruby`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
            });
    
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            //console.log("Check Successful!");
            if (data.isRuby){
                setMyTier(4);
            }else{
                setMyTier(3);
            }
            setCardReady(true);

        }catch (error){
            console.error("Error checking ruby:", error);
        }

};

// when owner exceeds tier threshold, promote to next tier
const tierPromotion = async () => {

    const token = await AsyncStorage.getItem('token');
    if (!token) {
        console.log('No token found');
        return;
    }

    try{
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/updateSponsorship`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
        });

        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Promotion Successful!");
        setMyTier(myTier+1);
    }catch (error){
        console.error("Error patching sponsorship tier:", error);
    }
};

//To check if business is eligible for promotion. Triggers everytime total donation or tier changes
useEffect(() => {
    // Check if total donation exceeds the threshold and the sponsor index is less than 3
    // console.log("print total don: ",myTotalDonation);
    // console.log("thresh: ",threshold[myTier]);
    if (myTier < 3) {
        if (myTotalDonation >= threshold[myTier]) {
        tierPromotion();
        }
    }

}, [myTotalDonation, myTier]);


// triggered everytime tier, donation or name is updated -> which happens every focus
useEffect(() => {
    if(stateReady){
        rubyPromotion();
    } 
}, [stateReady, isFocused, myTier]);

//triggered when user press the month select button
useEffect(() => {
    if (thisMonth){
        getBusinessDonation();
    }else{
        //getPrevBusinessDonation(); //deprecated
        getPrevRubySponsor();
    }
}, [thisMonth]);

//triggered when business email is updated
useEffect(() => {
    //console.log("email: ", businessEmail);
    getBusinessList(businessEmail);

}, [businessEmail]);


//Triggered when screen is focused
useFocusEffect(
    React.useCallback(() => {
        let isActive = true; // This flag is to prevent setting state on unmounted component
        setCardReady(false); // to not display card until ready
        setThisMonth(true);
        setStateReady(false);

        //fetching total donation under the account
        const fetchDonations = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }
            try{
                    const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/donations`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                });

                if (!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (isActive){
                    setMyTotalDonation(data.totalDonation);
                    setMonthlyDonation(data.totalDonationMonth);      
                }
            }catch (error){
                console.error("Error fetching donations:", error);
            }
        };

        //get businessname and current tier of the business
        const fetchInfo = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }
            try{
                    const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getinfo`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                });
                if (!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (isActive){
                    setMyBusinessName(data.businessName);
                    setMyTier(data.sponsorshipTier);
                    setStateReady(true);
                }
                
            }catch (error){
                console.error("Error fetching info:", error);
            }
        };

        fetchDonations();
        fetchInfo();
        getBusinessDonation();
        
        return () => {      
            isActive = false; // Cleanup function to set the flag to false when component unmounts   
        };
    }, [])
);


//from the list of emails of top donators, get their business names
const getBusinessList = async (businessEmail) => {
    try{
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getnames`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({emails: businessEmail}),});
    
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const businessNames = businessEmail.map(email => {
                const business = data.find(item => item.email === email);
                return business ? business.businessname : '';
            });
            setBusinessList(businessNames);

    }catch (error){
        console.error("Error fetching business names:", error);
}}



//get this month top 3 donator donation amount
const getBusinessDonation = async () => {

    try{
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }

        const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/topdonators`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }});

        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const donationList = data.map(item => parseFloat(item.totaldonation));

        //handle case where there are less than 3 donators in the month. Will make the value 0 and the name blank
        while (donationList.length < 3) {
            donationList.push(0);
        }
        setBusinessDonation(donationList);
        const emailList = data.map(item => item.email);
        while (emailList.length < 3) {
            emailList.push('');
        }
        setBusinessEmail(emailList);
    }catch (error){
        console.error("Error fetching top donators:", error);
}}



const getPrevRubySponsor = async () => {
    try{
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }

        const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/lastmonthruby`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }});

        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const emailList = data.map(item => item.email);
        while (emailList.length < 3) {
            emailList.push('');
        }
        setBusinessEmail(emailList);

        const donationList = data.map(item => parseFloat(item.totaldonation));
        while (donationList.length < 3) {
            donationList.push(0);
        }
        setBusinessDonation(donationList);
    }catch (error){
        console.error("Error fetching previous ruby sponsors:", error);
    }
}



const tierPerks = {
    0: "Unlock many exciting perks by being a tiered sponsor!",
    1: "\u2022 Custom washroom marker",
    2: "\u2022 Custom washroom marker\n\u2022 Business description\n\u2022 1 image upload",
    3: "\u2022 Custom washroom marker\n\u2022 Business description\n\u2022 3 image uploads",
    4: "\u2022 Custom washroom marker\n\u2022 Business description\n\u2022 3 image uploads\n\u2022 Banner slot in the news page",
}

const indexColors = {
    0: '#FFFFFF', 
    1: '#FFC489',
    2: '#E2E0DE', 
    3: '#FFE5B2', 
    4: '#383838', 
  };

const imageSources = {  
0: require('../../../assets/defaultbadge.png'), 
1: require('../../../assets/bronzebadge.png'),
2: require('../../../assets/silverbadge.png'),
3: require('../../../assets/goldbadge.png'),
4: require('../../../assets/rubybadge.png'),
};


const sponsorTier = {
    0: "Basic",
    1: "Bronze",
    2: "Silver",
    3: "Gold",
    4: "Ruby",
}


const changeThisMonth = () => {
    setThisMonth(true); 
};

const changeLastMonth = () => {
    setThisMonth(false); 
};

//go to donation screen while passing the amount needed to reach the next tier
const handleDonate = () => {
    navigation.navigate('BOStripe', {toNextTier, myTier});
}

const openBottomSheet = () => {
    setBottomSheetVisible(true);
    setBottomSheetIndex(1);
};

const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    setBottomSheetIndex(-1);
};
    
if (!fontsLoaded && !fontError) {
    return null;
}
    return (
        <View style={styles.container}>
            {cardReady &&(<View style={[styles.card, {backgroundColor: indexColors[myTier]}, myTier === 4 && {borderColor: '#FF0063'}]}>

                <View style={styles.sponsorContainer}>
                    <Image source={imageSources[myTier]} style={styles.sponsorImage} />
                    <View style={styles. textContainer}>
                        <Text style={[styles.sponsorText, myTier === 4 && {color:"#FF0063"}]}>{sponsorTier[myTier]} Sponsor</Text>
                        <Text style={[styles.monthlyText, myTier === 4 && {color:"white"}]}> ${Math.floor(monthlyDonation)} donated this month</Text>
                    </View>
                    <TouchableOpacity style={[{height:25, width:25, position: 'absolute',right:20, top:0}]} onPress={openBottomSheet}>
                        <Image
                            source={require('../../../assets/questionmark.png')}
                            style={[styles.buttonImage, myTier === 4 && {tintColor:"white"}]}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.perksText, myTier === 4 && {color:"white"}]}>{tierPerks[myTier]}</Text>
                {myTier===3 && (
                    <View style={styles.bottomCard}>
                        <Text style={styles.nextText} >Be the top 3 donator of the month to be a Ruby sponsor</Text>
                    </View>
                )}
                {myTier<3 && (
                    <View style={styles.bottomCard}>
                        <Text style={styles.progressText} >${toNextTier} to be a {sponsorTier[myTier+1]} Sponsor</Text>
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                        </View>
                    </View>
                )}
                {myTier===4 && (
                    <View style={styles.bottomCard}>
                        <Text style={[styles.nextText,{color:'#FF0063'}, {fontSize: 14}]}>We can do so much more because of you!{'\n'}</Text>
                    </View>
                )}

            </View>)}

            <View style={styles.leaderboardContainer}>
                <Text style={[styles.sponsorText, {alignSelf:'center'}]}>Top Donator</Text>
                <View style={styles.monthContainer}>
                    <TouchableOpacity onPress={changeLastMonth}>
                        <Text style={[styles.buttonMonth, !thisMonth && {fontFamily: 'Poppins-Bold',borderBottomWidth:2,paddingBottom: 0, borderBottomColor: '#DA5C59',  fontSize: 16}]}>Last Month</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={changeThisMonth}>
                        <Text style={[styles.buttonMonth, thisMonth && {fontFamily: 'Poppins-Bold', borderBottomWidth:2,paddingBottom: 0, borderBottomColor: '#DA5C59', fontSize: 16}]}>This Month</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.businessText]}>{businessList[0]}</Text>
                <View style={[styles.leaderBar, {width: `${25+(businessDonation[0]* 75/businessDonation[0])}%`}]}>
                    <View style={[styles.circleRank]}>
                        <Text style={[styles.rankText]}>1st</Text>
                    </View>
                    <Text style={[styles.amountText]}>${businessDonation[0]}</Text>
                </View>
                <Text style={[styles.businessText]}>{businessList[1]}</Text>
                <View style={[styles.leaderBar, {width: `${25+(businessDonation[1]* 75/businessDonation[0])}%`}]}>
                    <View style={[styles.circleRank]}>
                        <Text style={[styles.rankText]}>2nd</Text>
                    </View>
                    <Text style={[styles.amountText]}>${businessDonation[1]}</Text>
                </View>
                <Text style={[styles.businessText]}>{businessList[2]}</Text>
                <View style={[styles.leaderBar, {width: `${25+(businessDonation[2]* 75/businessDonation[0])}%`}]}>
                    <View style={[styles.circleRank]}>
                        <Text style={[styles.rankText]}>3rd</Text>
                    </View>
                    <Text style={[styles.amountText]}>${businessDonation[2]}</Text>
                </View>

            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleDonate} >
                        <Text style={styles.confirmButtonText}>Donate</Text>
            </TouchableOpacity>

            {bottomSheetVisible && (
            <BottomSheet
              onClose={closeBottomSheet}
              height={300} // Adjust the height as needed
              backgroundColor="red"
              snapPoints={['62%', '62%']}
              index={bottomSheetIndex}
              handleStyle={{backgroundColor: '#F1F1F1', borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
              
            >
                <BottomSheetScrollView>
                <View style={{ backgroundColor: '#F1F1F1', flex: 1 }}>
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
                <View style={styles.sponsorContainer}>
                    <Image source={imageSources[1]} style={styles.sponsorImage} />
                    <View style={styles. textContainer}>
                        <Text style={[styles.sponsorText]}>Donate ${threshold[0]} to unlock</Text>
                        <Text style={[styles.perksSheetText]}>{tierPerks[1]}</Text>
                    </View>
                </View>
                <View style={styles.sponsorContainer}>
                    <Image source={imageSources[2]} style={styles.sponsorImage} />
                    <View style={styles. textContainer}>
                        <Text style={[styles.sponsorText]}>Donate ${threshold[1]} to unlock</Text>
                        <Text style={[styles.perksSheetText]}>{tierPerks[2]}</Text>
                    </View>
                </View>
                <View style={styles.sponsorContainer}>
                    <Image source={imageSources[3]} style={styles.sponsorImage} />
                    <View style={styles. textContainer}>
                        <Text style={[styles.sponsorText]}>Donate ${threshold[2]} to unlock</Text>
                        <Text style={[styles.perksSheetText]}>{tierPerks[3]}</Text>
                    </View>
                </View>
                <View style={styles.sponsorContainer}>
                    <Image source={imageSources[4]} style={styles.sponsorImage} />
                    <View style={styles. textContainerRuby}>
                        <Text style={[styles.sponsorText, {fontSize:16}]}>Be the top 3 donator for the month and a gold sponsor to unlock</Text>
                        <Text style={[styles.perksSheetText]}>{tierPerks[4]}</Text>
                    </View>
                </View>
                
                


            </View>
            </BottomSheetScrollView>
            </BottomSheet>)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card:{
        backgroundColor: '#FFE5B2',
        padding: 10,
        borderRadius: 15,
        width: '90%', // Adjust the width to span almost the entire width
        alignSelf: 'center', // Center the box horizontally
        position: 'absolute', // Position the box absolutely
        top: '8%', // Position the box at the top of the screen
        height: 219,
        shadowColor: 'black',
        elevation: 5,
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'transparent',
        },

    sponsorText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'left',
        fontFamily: 'Poppins-Medium',
        color: '#6E552D',
        },
    
    monthlyText: {
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        fontFamily: 'Poppins-Medium',
        color: '#6E552D'
        //marginLeft: "25%",
        },

    perksText:{
        //backgroundColor:'red',
        fontSize: 13,
        color: 'black',
        textAlign: 'left',
        fontFamily: 'Poppins-Medium',
        marginLeft: "25%",
        marginVertical: "3%",
        color: '#6E552D'
    },
    perksSheetText:{
        //backgroundColor:'red',
        fontSize: 13,
        color: 'black',
        textAlign: 'left',
        fontFamily: 'Poppins-Medium',
        color: '#6E552D'
    },
    sponsorImage:{
        width: 30,
        height: 51,
        marginLeft: "3%",
        marginRight: "8%",
        marginTop: "3%",
    },

    sponsorContainer:{
        //backgroundColor: 'yellow',
        flexDirection: 'row',
        marginLeft: "5%",
        width: '100%',
        position: 'relative',
    },

    bottomCard:{
        //backgroundColor: 'yellow',
        //flexDirection:'row',
        //alignItems: 'center',
        justifyContent: 'flex-end',
        width: '90%',
        height: 40,
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 10,
    },
    nextText:{
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        color: '#6E552D'
    },
    buttonImage: {
        width: 25,
        height: 25,

    },
    progressContainer: {
        width: '100%',
        height: 8,
        backgroundColor: '#6E552D',
        opacity: 0.5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#6E552D',
    },
    progressText:{
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
        fontFamily: 'Poppins-Medium',
        color: '#6E552D'
    },
    leaderboardContainer:{
        backgroundColor: '#F6F6F6',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        width: '90%', // Adjust the width to span almost the entire width
        alignSelf: 'center', // Center the box horizontally
        position: 'absolute', // Position the box absolutely
        top: '40%', // Position the box at the top of the screen
        height: 340,
        shadowColor: 'black',
        elevation: 5,
   
    },
    monthContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        paddingBottom: 10,
    },
    buttonMonth:{
        fontSize: 15,
        color: '#DA5C59',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        
    },
    businessText:{
        fontSize: 15,
        color: 'black',
        fontFamily: 'Poppins-Medium',
        color: '#6E552D',
        marginBottom: -9,
   
    },
    circleRank:{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignSelf: 'left',
        marginLeft: 1,
        justifyContent: 'center',
    },
    leaderBar:{
        flexDirection: 'row',
        //justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
        backgroundColor: '#DA5C59',
        height: 43,
        borderRadius: 20,
    },
    rankText:{
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        color: '#6E552D',
        alignSelf: 'center',        
    },
    amountText:{
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        position: 'absolute',
        right: 10,
    },

    confirmButton: {
        padding: 10,
        position: 'absolute',
        bottom: '1%',
        width: '90%', // Adjust the width to span almost the entire width
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 48,
        backgroundColor: '#DA5C59',  
    },
    confirmButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: 'white'
    },
    backButton: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    
      },
      textContainer:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 10
       
      },
      textContainerRuby:{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '70%'
      },
      

    });

export default BOSponsorshipScreen;