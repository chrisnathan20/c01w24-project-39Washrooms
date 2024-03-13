import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GOHERE_SERVER_URL } from '@env'; // Import the server URL from the .env file

import markerIcon from '../assets/default-marker.png'; // Default marker icon
import bronzeMarkerIcon from '../assets/bronze-marker.png';
import silverMarkerIcon from '../assets/silver-marker.png';
import goldMarkerIcon from '../assets/gold-marker.png';
import rubyMarkerIcon from '../assets/ruby-marker.png';



const CustomMarker = ({ coordinate, title, sponsorship }) => {
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
        style={{ width: 50, height: 50 }} // Adjust the size as needed
        resizeMode="contain"
      />
    </Marker>
  );
};

const App = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [markers, setMarkers] = useState(null);
  const fetchWatcher = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude - 0.0005,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0045,
        longitudeDelta: 0.0045,
      });

      // fetch markers from db every 100 meters covered
      fetchWatcher.current = Location.watchPositionAsync(
        { distanceInterval: 5,
          timeInterval: 1000},
        (location) => {
          console.log('fetching new markers');
          fetchMarkers(location.coords);
        }
      );

      return () => {
        if (fetchWatcher.current) {
          fetchWatcher.current.remove();
        }
      };

    })();
  }, []);

  const fetchMarkers = async (coords) => {
    try {
      const response = await fetch(`${GOHERE_SERVER_URL}/nearbywashrooms?latitude=${coords.latitude}&longitude=${coords.longitude}&_=${new Date().getTime()}`);
      const data = await response.json();
      if (data){
        setMarkers(data.map(marker => ({
          ...marker,
          latitude: parseFloat(marker.latitude),
          longitude: parseFloat(marker.longitude),
          displayDistance: marker.distance < 1000 ? `${marker.distance} m` : `${(marker.distance / 1000).toFixed(1)} km`
        })));
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  const snapPoints = useMemo(() => [80, 230, '87.5%'], []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {initialRegion && markers? (
        <><ClusteredMapView
          key={markers.length}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          radius={35} // Adjust the cluster radius as needed
          showsUserLocation
          mapPadding={ { top: StatusBar.currentHeight } }
          showsCompass
          clusterColor="#DA5C59"
          clusterTextColor="white"
        >
          {markers.map((marker) => (
            <CustomMarker
              key={marker.washroomid}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.washroomname}
              sponsorship={marker.sponsorship}/>
          ))}
        </ClusteredMapView>
        <BottomSheet index={1} snapPoints={snapPoints}>
          <View style={styles.searchBarSavedContainer}>
            <View style={styles.searchBarContainer}>
              <Image 
                source={require('../assets/material-symbols_search.png')}
                style={{ width: 25, height: 25}}  
              />
              <TextInput
                style={styles.searchBar}
                placeholder="Search for place or address"
                placeholderTextColor='#5A5A5A'
              />
            </View>
            <View style={styles.savedButton}>
              <TouchableOpacity onPress={() => {}}>
                <Image source={require('../assets/SavedButton.png')} style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.WashroomsNearbyText}>Washrooms Nearby</Text>
          <BottomSheetScrollView>
          {markers.map((item, index) => (
            <View key={index}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 1 }}>
                <View style={{ backgroundColor: '#EFEFEF', height: '100%', width: '95%', borderRadius: 25 }}></View>
              </View>
              <View style={styles.washroomsNearbyContainer}>
                <View style={styles.distanceContainer}>
                  <Image
                    source={require('../assets/distanceIcon.png')}
                    style={{ width: 36, height: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  />
                  <Text style={styles.distance}>{item.displayDistance}</Text>
                </View>
                <View style={styles.nameAddressContainer}>
                  <Text style={styles.name}>{item.washroomname}</Text>
                  <Text style={styles.address}>{item.address1}{item.address2 ? ` ${item.address2}` : ''}</Text>
                  <Text style={styles.address}>{item.postalcode}, {item.city}, {item.province}</Text>
                </View>
              </View>
            </View>
          ))}
        </BottomSheetScrollView >
          <View style={{ display: 'flex', flexDirection:'row', justifyContent:'center' ,height: 1}}>
            <View style={{backgroundColor: '#EFEFEF', height: '100%', width: '95%', borderRadius: 25}}></View>
          </View>
        </BottomSheet></>
      ) : (
        <Text>Loading...</Text>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  searchBarSavedContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  searchBarContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 25,
    height: 40,
    paddingLeft: 15,
    marginHorizontal: 10,
    width: 335,
  },
  searchBar: {
    fontSize: 16,
    paddingLeft: 10,
  },
  savedButton: {
    borderRadius: 10,
    borderWidth: 1, // Set the border width to 1
    borderColor: '#EFEFEF',
    height: 40,
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonIcon: {
    width: 19,
    height: 26,
  },
  WashroomsNearbyText: {
    fontSize: 20,
    marginLeft: 15,
    marginTop: 25,
    color: '#DA5C59',
    fontWeight: 'bold', // change this to medium once font is imported
    marginBottom: 10,
  },
  distance: {
    marginTop: 2,
    fontSize: 14,
    color: '#767C7E',
    fontWeight: 'medium',
  },
  distanceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  washroomsNearbyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 100,
    paddingLeft: 5,
  },
  nameAddressContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 5,
  },
  name : {
    fontSize: 18,
    marginBottom: 2,
    fontWeight: 'bold',
    color: '#000000',
  },
  address : {
    fontSize: 14,
    fontWeight: 'medium',
    color: '#767C7E',
  },
});

export default App;
