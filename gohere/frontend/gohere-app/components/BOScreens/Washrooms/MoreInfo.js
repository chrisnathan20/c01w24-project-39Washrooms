import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image} from 'react-native';
import { GOHERE_SERVER_URL, GOOGLE_API_KEY } from '../../../env.js';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useFonts } from 'expo-font';

import markerIcon from '../../../assets/default-marker.png'; // Default marker icon
import bronzeMarkerIcon from '../../../assets/bronze-marker.png';
import silverMarkerIcon from '../../../assets/silver-marker.png';
import goldMarkerIcon from '../../../assets/gold-marker.png';
import rubyMarkerIcon from '../../../assets/ruby-marker.gif';

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

const MoreInfo = ({ route }) => {
    const { washroomId } = route.params;
    const [washroomInfo, setWashroomInfo] = useState(null);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
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
                    latitude: parseFloat(washroomInfo.latitude) - 0.0005,
                    longitude: parseFloat(washroomInfo.longitude),
                    latitudeDelta: 0.0045,
                    longitudeDelta: 0.0045,
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
              snapPoints={[130, "100%"]}
              index={0}
              style={styles.BottomSheet}>
                <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.title}>{washroomInfo.washroomname}</Text>
                  {washroomInfo.address2 !== null && washroomInfo.address2 !== "" ? 
                      <Text style={styles.lightText}>{washroomInfo.address1} - {washroomInfo.address2}</Text>
                      : <Text style={styles.lightText}>{washroomInfo.address1}</Text>}
                  <Text style={styles.lightText}>{washroomInfo.city},  {washroomInfo.province}, {washroomInfo.postalcode}, Canada</Text>
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
                </BottomSheetScrollView>
            </BottomSheet>
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
      marginBottom: 15
    },
});

export default MoreInfo;