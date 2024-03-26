import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, Modal} from 'react-native';
import { GOHERE_SERVER_URL } from '../../env.js';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useFonts } from 'expo-font';

import markerIcon from '../../assets/default-marker.png'; // Default marker icon
import bronzeMarkerIcon from '../../assets/bronze-marker.png';
import silverMarkerIcon from '../../assets/silver-marker.png';
import goldMarkerIcon from '../../assets/gold-marker.png';
import rubyMarkerIcon from '../../assets/ruby-marker.gif';

const CustomMarker = ({coordinate, title, sponsorship}) => {
    let icon;
    switch (sponsorship) {
      case 1:
        icon = bronzeMarkerIcon;
        break;
      case 2:
        icon = silverMarkerIcon;
        break;
      case 3:
        icon = goldMarkerIcon;
        break;
      case 4:
        icon = rubyMarkerIcon;
        break;
      default:
        icon = markerIcon;
    }
    return (
      <Marker coordinate={coordinate} title={title}>
        <Image
          source={icon}
          style={{ width: 47.5, height: 47.5 }} // Adjust the size as needed
          resizeMode="contain"
        />
      </Marker>
    );
  };

const MoreInfo = ({ navigation, route }) => {
    const { applicationId, type } = route.params;
    const [applicationInfo, setApplicationInfo] = useState(null);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [acceptModalVisible, setAcceptModalVisible] = useState(false);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
      });

    const StatusCode = [
      'Pending',
      'Pre-screening',
      'On-site review',
      'Final review',
      'Accepted',
      'Rejected'
    ];

    useEffect(() => {
        let fetchApplicationInfo = async () => {
            try {
                if(type == "business"){
                  const response = await fetch(`${GOHERE_SERVER_URL}/application/${applicationId}`);

                  if (!response.ok) {
                      throw new Error('Server responded with an error.');
                  }

                  const applicationInfo = await response.json();
                  setApplicationInfo(applicationInfo);
                }
                else{
                  const response = await fetch(`${GOHERE_SERVER_URL}/publicapplication/${applicationId}`);

                  if (!response.ok) {
                      throw new Error('Server responded with an error.');
                  }

                  const applicationInfo = await response.json();
                  setApplicationInfo(applicationInfo);
                }
            } catch (error) {
                console.error('Error fetching application info:', error);
            }
        };

        fetchApplicationInfo();
    }, [applicationId]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const formatTime = (time) => {
        return time.toString().slice(0, 5);
      };

    const handleNextStatus = async () => {
      if(type == "public"){
        const response = await fetch(`${GOHERE_SERVER_URL}/publicapplication/setnextstatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Public');
        }
      }
      else{
        const response = await fetch(`${GOHERE_SERVER_URL}/application/setnextstatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Business');
        }
      }
    }

    const handlePrevStatus = async () => {
      if(type == "public"){
        const response = await fetch(`${GOHERE_SERVER_URL}/publicapplication/setprevstatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Public');
        }
      }
      else{
        const response = await fetch(`${GOHERE_SERVER_URL}/application/setprevstatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Business');
        }
      }
    }

    const handleReject = async () => {
      if(type == "public"){
        const response = await fetch(`${GOHERE_SERVER_URL}/publicapplication/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Public');
        }
      }
      else{
        const response = await fetch(`${GOHERE_SERVER_URL}/application/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Business');
        }
      }
    }

    const handleAccept = async () => {
      if(type == "public"){
        const response = await fetch(`${GOHERE_SERVER_URL}/publicapplication/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Public');
        }
      }
      else{
        const response = await fetch(`${GOHERE_SERVER_URL}/application/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"applicationid": applicationId}),
        });
  
        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
        else{
          navigation.navigate('Business');
        }
      }
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            {applicationInfo ?
            <> 
            <MapView
                style={{ flex: 1, width: '100%', height: '100%'}}
                initialRegion={{
                  latitude: parseFloat(applicationInfo.latitude) - 0.001,
                  longitude: parseFloat(applicationInfo.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                provider={PROVIDER_GOOGLE}
                mapPadding={ { top: StatusBar.currentHeight } }
            >
                <CustomMarker
                coordinate={{ latitude: parseFloat(applicationInfo.latitude), longitude: parseFloat(applicationInfo.longitude) }}
                title={applicationInfo.locationname}
                sponsorship={applicationInfo.sponsorship}
                />
            </MapView>
            <BottomSheet
              snapPoints={[195, "100%"]}
              index={0}
              style={styles.BottomSheet}>
                <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.title}>{applicationInfo.locationname}</Text>
                  {applicationInfo.address2 !== null && applicationInfo.address2 !== "" ? 
                      <Text style={styles.lightText}>{applicationInfo.address1} - {applicationInfo.address2}</Text>
                      : <Text style={styles.lightText}>{applicationInfo.address1}</Text>}
                  <Text style={styles.lightText}>{applicationInfo.city},  {applicationInfo.province}, {applicationInfo.postalcode}, Canada</Text>
                  { type == "business" ? <Text style={styles.lightText}>Submitted by: {applicationInfo.email}</Text> : <Text style={styles.lightText}>Public Submitted Washroom</Text> } 
                  {applicationInfo.status >= 0 && applicationInfo.status <= 3 &&
                    <View style={styles.statusContainer}>
                      <Text style={styles.statusText}>{StatusCode[applicationInfo.status]}</Text>
                    </View>
                  }

                  {applicationInfo.status == 4 &&
                    <View style={styles.statusAcceptedContainer}>
                      <Text style={styles.statusWhiteText}>{StatusCode[applicationInfo.status]}</Text>
                    </View>
                  }

                  {applicationInfo.status == 5 &&
                    <View style={styles.statusRejectedContainer}>
                    <Text style={styles.statusWhiteText}>{StatusCode[applicationInfo.status]}</Text>
                  </View>
                  }

                  <Text style={styles.header}>Hours</Text>
                  <View style={styles.hours}>
                      {applicationInfo.openinghours ? (
                      applicationInfo.openinghours.map((openingHour, index) => (
                      <View style={styles.row} key={index}>
                          <Text style={styles.lightText}>{days[index]}</Text>
                          <Text style={styles.time}>{`${formatTime(openingHour)} - ${formatTime(applicationInfo.closinghours[index])}`}</Text>
                      </View>
                      ))) : <Text style={styles.lightText}>Closed</Text>
                      }
                  </View>

                  {applicationInfo.imageone && <><Text style={styles.header}>Photos</Text>
                  <View style={styles.imageContainer}>
                      {applicationInfo.imageone && <Image style={styles.image} source={{ uri: `${GOHERE_SERVER_URL}/${applicationInfo.imageone}`}} />}
                      {applicationInfo.imagetwo && <Image style={styles.image} source={{ uri: `${GOHERE_SERVER_URL}/${applicationInfo.imagetwo}`}} />}
                      {applicationInfo.imagethree && <Image style={styles.image} source={{ uri: `${GOHERE_SERVER_URL}/${applicationInfo.imagethree}`}} />}
                  </View></>}

                  <Text style={styles.header}>Additional Details</Text>
                  <Text style={styles.additonalDetails}>{applicationInfo.additionaldetails}</Text>

                  {applicationInfo.status < 4  && <Text style={styles.header}>Manage Application Status</Text>}
                  <View style={styles.optionsContainer}>
                    {applicationInfo.status>0 && applicationInfo.status < 4 && <TouchableOpacity style={styles.regular} onPress={handlePrevStatus}>
                        <Text style={styles.regularText}>Set to '{StatusCode[applicationInfo.status-1]}'</Text>
                    </TouchableOpacity>}
                    {applicationInfo.status < 3 && <TouchableOpacity style={styles.regular} onPress={handleNextStatus}>
                        <Text style={styles.regularText}>Set to '{StatusCode[applicationInfo.status+1]}'</Text>
                    </TouchableOpacity>}
                    {applicationInfo.status == 3 && <TouchableOpacity style={styles.accept} onPress={() => setAcceptModalVisible(true)}>
                        <Text style={styles.acceptRejectText}>Accept Application</Text>
                    </TouchableOpacity>}
                    {applicationInfo.status < 4 && <TouchableOpacity style={styles.reject} onPress={() => setRejectModalVisible(true)}>
                        <Text style={styles.acceptRejectText}>Reject Application</Text>
                    </TouchableOpacity>}
                  </View>
                </BottomSheetScrollView>
            </BottomSheet>
            <Modal
            animationType="slide"
            transparent={true}
            visible={rejectModalVisible}
            onRequestClose={() => {
            setRejectModalVisible(!rejectModalVisible);
            }}>
                <View style={styles.confirmationModalOverlay}>
                    <View style={{ elevation: 5, backgroundColor: '#DA5C59', alignItems: 'center', borderRadius: 15, padding: 20, width: '60%', borderWidth: 2, borderColor: '#DA5C59' }}>
                        <Image style={{width: 100, height: 100, resizeMode: 'contain', marginBottom: 10, tintColor: "#FFFFFF"}} source={require("../../assets/confirm-delete.png")} />
                        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 20, textAlign: 'center', color: '#FFFFFF'}}>Reject Application?</Text>
                        <Text style={{fontFamily: 'Poppins-Medium', fontSize: 15, textAlign: 'center', marginBottom: 15, color: '#FFFFFF'}}>This application will be permanently rejected</Text>
                        <View style={{flexDirection: 'row'}}>                        
                          <TouchableOpacity
                          style={{ borderWidth: 1.5, borderColor: '#FFFFFF', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 5}}
                          onPress={() => {
                          setRejectModalVisible(!rejectModalVisible);
                          }}>
                              <Text style={{fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', fontSize: 14}}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                          style={{ borderWidth: 1.5, borderColor: '#FFFFFF', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 5}}
                          onPress={async() => {
                          setRejectModalVisible(!rejectModalVisible);
                          handleReject();
                          }}>
                              <Text style={{fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', fontSize: 14}}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
            animationType="slide"
            transparent={true}
            visible={acceptModalVisible}
            onRequestClose={() => {
            setAcceptModalVisible(!acceptModalVisible);
            }}>
                <View style={styles.confirmationModalOverlay}>
                    <View style={{ elevation: 5, backgroundColor: '#35C28D', alignItems: 'center', borderRadius: 15, padding: 20, width: '60%', borderWidth: 2, borderColor: '#35C28D' }}>
                        <Image style={{width: 100, height: 100, resizeMode: 'contain', marginBottom: 10, tintColor: "#FFFFFF"}} source={require("../../assets/confirm-submit.png")} />
                        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 20, textAlign: 'center', color: '#FFFFFF'}}>Accept Application?</Text>
                        <Text style={{fontFamily: 'Poppins-Medium', fontSize: 15, textAlign: 'center', marginBottom: 15, color: '#FFFFFF'}}>This application will be accepted and added as a washroom</Text>
                        <View style={{flexDirection: 'row'}}>                        
                          <TouchableOpacity
                          style={{ borderWidth: 1.5, borderColor: '#FFFFFF', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 5}}
                          onPress={() => {
                          setAcceptModalVisible(!acceptModalVisible);
                          }}>
                              <Text style={{fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', fontSize: 14}}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                          style={{ borderWidth: 1.5, borderColor: '#FFFFFF', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 5}}
                          onPress={async() => {
                          setAcceptModalVisible(!acceptModalVisible);
                          handleAccept();
                          }}>
                              <Text style={{fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', fontSize: 14}}>Accept</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            </>     
            : <Text>Loading...</Text>}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    BottomSheet: {
        borderRadius: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF'
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    title: {
      fontFamily: 'Poppins-Medium',
      fontSize: 21,
      width: '70%',
    },
    lightText: {
      fontFamily: 'Poppins-Regular',
      color: '#404040',
      marginBottom: 2,
      fontSize: 14,
    },
    additonalDetails: {
      fontFamily: 'Poppins-Regular',
      color: '#404040',
      marginBottom: 20,
      fontSize: 14,
    },
    header: {
      color: '#DA5C59',
      fontFamily: 'Poppins-Medium',
      fontWeight: '400',
      fontSize: 20,
      marginTop: 10,
      marginBottom: 5
    },
    time: {
      fontFamily: 'Poppins-Regular',
    },
    image: {
      borderRadius: 10,
      width: 120,
      height: 120,
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 15
    },
    statusContainer: {
      display: 'flex',
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      paddingVertical: 1,
      paddingHorizontal: 15,
      borderWidth: 1.5,
      borderColor: '#DA5C59',
      marginVertical: 5
    },
    statusText: {
      fontFamily: 'Poppins-Medium',
      color: '#DA5C59',
      fontSize: 14,
    },
    statusAcceptedContainer: {
      display: 'flex',
      backgroundColor: '#35C28D',
      borderRadius: 20,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      paddingVertical: 1,
      paddingHorizontal: 15,
      marginVertical: 5
    },
    statusWhiteText: {
      fontFamily: 'Poppins-Medium',
      color: '#FFFFFF',
      fontSize: 14,
    },
    statusRejectedContainer: {
      display: 'flex',
      backgroundColor: '#DA5C59',
      borderRadius: 20,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      paddingVertical: 1,
      paddingHorizontal: 15,
      marginVertical: 5
    },
    optionsContainer: {
      flexDirection: 'column',
      marginTop: 5,
      marginBottom: 25,
    },
    regular: {
      padding: 5,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 1,
      marginVertical: 5,
      backgroundColor: '#FFFFFF', 
      borderColor: '#DA5C59', 
      width: 175,
    },
    regularText: {
      fontFamily: 'Poppins-Medium',
      fontSize: 12,
      color: '#DA5C59'
    },
    accept: {
      padding: 5,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 1,
      marginVertical: 5,
      backgroundColor: '#35C28D', 
      borderColor: '#35C28D', 
      width: 175,
    },
    reject: {
      padding: 5,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 1,
      marginVertical: 5,
      backgroundColor: '#DA5C59', 
      borderColor: '#DA5C59', 
      width: 175,
    },
    acceptRejectText: {
      fontFamily: 'Poppins-Medium',
      fontSize: 12,
      color: '#FFFFFF'
    },
    confirmationModalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for the semi-transparent overlay
    },
});

export default MoreInfo;