import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Modal, TouchableOpacity} from 'react-native';
import { GOHERE_SERVER_URL} from '../../env.js';
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
    const { washroomId } = route.params;
    const [washroomInfo, setWashroomInfo] = useState(null);
    const [businessInfo, setBusinessInfo] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [snapOne, setSnapOne] = useState(130); // Snap point for the bottom sheet
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
      });

    useEffect(() => {
        let fetchwashroomInfo = async () => {
            try {
                const response = await fetch(`${GOHERE_SERVER_URL}/washroom/${washroomId}`);

                if (!response.ok) {
                    throw new Error('Server responded with an error.');
                }

                const washroomInfo = await response.json();
                setWashroomInfo(washroomInfo);

                if (washroomInfo.email) {
                    const response2 = await fetch(`${GOHERE_SERVER_URL}/businessowner/${washroomInfo.email}`);
                    if (!response2.ok) {
                      throw new Error('Server responded with an error.');
                    }
    
                    const businessInfo = await response2.json();
                    setBusinessInfo(businessInfo);
                    setSnapOne(155);
                }
            } catch (error) {
                console.error('Error fetching washroom info:', error);
            }
        };

        fetchwashroomInfo();
    }, [washroomId]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const formatTime = (time) => {
        return time.toString().slice(0, 5);
      };

    return (
        <GestureHandlerRootView style={styles.container}>
            {washroomInfo ?
            <> 
            <MapView
                style={{ flex: 1, width: '100%', height: '100%'}}
                initialRegion={{
                    latitude: parseFloat(washroomInfo.latitude) - 0.001,
                    longitude: parseFloat(washroomInfo.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                provider={PROVIDER_GOOGLE}
                mapPadding={ { top: StatusBar.currentHeight } }
            >
                <CustomMarker
                coordinate={{ latitude: parseFloat(washroomInfo.latitude), longitude: parseFloat(washroomInfo.longitude) }}
                title={washroomInfo.washroomname}
                sponsorship={washroomInfo.sponsorship}
                />
            </MapView>
            <BottomSheet
              snapPoints={[snapOne, "100%"]}
              index={0}
              style={styles.BottomSheet}>
                <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.title}>{washroomInfo.washroomname}</Text>
                  {washroomInfo.address2 !== null && washroomInfo.address2 !== "" ? 
                      <Text style={styles.lightText}>{washroomInfo.address1} - {washroomInfo.address2}</Text>
                      : <Text style={styles.lightText}>{washroomInfo.address1}</Text>}
                  <Text style={styles.lightText}>{washroomInfo.city},  {washroomInfo.province}, {washroomInfo.postalcode}, Canada</Text>
                  {businessInfo && <Text style={styles.lightText}>Owned by: {businessInfo.email}</Text>}
                  <Text style={styles.header}>Hours</Text>
                  <View style={styles.hours}>
                      {washroomInfo.openinghours ? (
                      washroomInfo.openinghours.map((openingHour, index) => (
                      <View style={styles.row} key={index}>
                          <Text style={styles.lightText}>{days[index]}</Text>
                          <Text style={styles.time}>{`${formatTime(openingHour)} - ${formatTime(washroomInfo.closinghours[index])}`}</Text>
                      </View>
                      ))) : <Text style={styles.lightText}>Closed</Text>
                      }
                  </View>

                  {washroomInfo.imageone && <><Text style={styles.header}>Photos</Text>
                  <View style={styles.imageContainer}>
                      {washroomInfo.imageone && <Image style={styles.image} source={{ uri: `${GOHERE_SERVER_URL}/${washroomInfo.imageone}`}} />}
                      {washroomInfo.imagetwo && <Image style={styles.image} source={{ uri: `${GOHERE_SERVER_URL}/${washroomInfo.imagetwo}`}} />}
                      {washroomInfo.imagethree && <Image style={styles.image} source={{ uri: `${GOHERE_SERVER_URL}/${washroomInfo.imagethree}`}} />}
                  </View></>}

                  {businessInfo && businessInfo.description && <><Text style={styles.header}>About {businessInfo.businessname}</Text>
                  <Text style={styles.lightText}>{businessInfo.description}</Text></>}

                  <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
                      <Text style={styles.deleteButtonText}>Delete Washroom</Text>
                  </TouchableOpacity>
                </BottomSheetScrollView>
            </BottomSheet>
            <Modal
            animationType="slide"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={() => {
            setDeleteModalVisible(!deleteModalVisible);
            }}>
                <View style={styles.confirmationModalOverlay}>
                    <View style={{ elevation: 5, backgroundColor: '#FFFFFF', alignItems: 'center', borderRadius: 15, padding: 20, width: '60%', borderWidth: 2, borderColor: '#DA5C59' }}>
                        <Image style={{width: 100, height: 100, resizeMode: 'contain', marginBottom: 10, tintColor: "#DA5C59"}} source={require("../../assets/confirm-delete.png")} />
                        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 20, textAlign: 'center', color: '#DA5C59'}}>Delete Washroom?</Text>
                        <Text style={{fontFamily: 'Poppins-Medium', fontSize: 15, textAlign: 'center', marginBottom: 15, color: '#DA5C59'}}>The washroom will be permanently deleted</Text>
                        <View style={{flexDirection: 'row'}}>                        
                          <TouchableOpacity
                          style={{ borderWidth: 1.5, borderColor: '#DA5C59', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 5}}
                          onPress={() => {
                          setDeleteModalVisible(!deleteModalVisible);
                          }}>
                              <Text style={{fontFamily: 'Poppins-SemiBold', color: '#DA5C59', fontSize: 14}}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                          style={{ borderWidth: 1.5, borderColor: '#DA5C59', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 5}}
                          onPress={async() => {
                          setDeleteModalVisible(!deleteModalVisible);
                          await fetch(`${GOHERE_SERVER_URL}/washroom/${washroomId}`, {
                              method: 'DELETE',
                          });
                          navigation.navigate('Washrooms'); // Replace with your navigation target
                          }}>
                              <Text style={{fontFamily: 'Poppins-SemiBold', color: '#DA5C59', fontSize: 14}}>Confirm</Text>
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
      marginBottom: 20
    },
    deleteButton: {
      padding: 8,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 1,
      marginTop: 55,
      marginBottom: 30,
      backgroundColor: '#FFFFFF', 
      borderColor: '#DA5C59', 
      width: 200,
    },
    deleteButtonText: {
      fontFamily: 'Poppins-Medium',
      fontSize: 16,
      color: '#DA5C59'
    },
    confirmationModalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for the semi-transparent overlay
    },
});

export default MoreInfo;