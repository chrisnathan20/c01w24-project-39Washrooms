import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity, StatusBar, Keyboard } from 'react-native';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GOHERE_SERVER_URL, GOOGLE_API_KEY } from '../../env.js'; // Import the server URL from the .env file
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from 'react-native-maps-directions';

import markerIcon from '../../assets/default-marker.png'; // Default marker icon
import bronzeMarkerIcon from '../../assets/bronze-marker.png';
import silverMarkerIcon from '../../assets/silver-marker.png';
import goldMarkerIcon from '../../assets/gold-marker.png';
import rubyMarkerIcon from '../../assets/ruby-marker.gif';

import WashroomDetails from './WashroomDetails.js';
import startingPointDestinationMarker from '../../assets/startingpointdestinationmarker.png';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import calculateDistance from './CalculateDistance';

const CustomMarker = React.forwardRef(({ id, coordinate, title, sponsorship, onCalloutPress }, ref) => {
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
    <Marker key={id} ref={ref} coordinate={coordinate} title={title} onCalloutPress={onCalloutPress}>
      <Image
        source={icon}
        style={{ width: 47.5, height: 47.5 }} // Adjust the size as needed
        resizeMode="contain"
      />
    </Marker>
  );
});

const App = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const markerRefs = useRef({});
  const [currentLocation, setCurrentLocation] = useState({
    description: 'Current Location',
    subtext: null,
    geometry: { location: { lat: null, lng: null } },
  });
  const [markers, setMarkers] = useState(null);
  const fetchWatcher = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentDetails, setCurrentDetails] = useState(null);
  const [location, setLocation] = useState(null);

  const mapViewRef = useRef(null);

  const [activeBottomSheet, setActiveBottomSheet] = useState('main');
  const mainBottomSheetRef = useRef(null);
  const searchBottomSheetRef = useRef(null);
  const routeBottomSheetRef = useRef(null);
  const savedBottomSheetRef = useRef(null);

  const autocompleteStartingRef = useRef(null);
  const autocompleteDestinationRef = useRef(null);
  const [selectedMode, setSelectedMode] = useState('DRIVING');

  const [startingPoint, setStartingPoint] = useState(null);
  const [destinationPoint, setDestinationPoint] = useState(null);
  const [route, setRoute] = useState(null);
  const [markerDisplayMode, setMarkerDisplayMode] = useState('nearme'); //nearme, saved, route
  const [washroomsAlongRoute, setWashroomsAlongRoute] = useState([]);
  const isFirstRender = useRef(true);

  const [savedWashrooms, setSavedWashrooms] = useState([]);
  console.log(GOHERE_SERVER_URL);
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
      setCurrentLocation({
        description: 'Current Location',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        subtext: `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`,
        geometry: { location: { lat: location.coords.latitude, lng: location.coords.longitude } },
      }); 

      // fetch markers from db every 10 meters covered
      fetchWatcher.current = Location.watchPositionAsync(
        { distanceInterval: 10,
          timeInterval: 2000},
        (location) => { 
          setCurrentLocation({
            description: 'Current Location',
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            subtext: `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`,
            geometry: { location: { lat: location.coords.latitude, lng: location.coords.longitude } },
          }); 
          console.log('fetching new markers');
          fetchMarkers(location.coords);
          setLocation(location);
        }
      );

      return () => {
        if (fetchWatcher.current) {
          fetchWatcher.current.remove();
        }
      };
    })();
  }, []);

  const addDistanceToWashrooms = (washrooms) => {
    return washrooms.map(washroom => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        parseFloat(washroom.latitude),
        parseFloat(washroom.longitude)
      );
      return { ...washroom, distance };
    });
  }

  const fetchData = async () => {
    try {
      await AsyncStorage.setItem('savedWashroomsIds', "[1,2,8]"); // @martinl498 - replace this with the actual saved washrooms ids
      const storedSavedWashrooms = await AsyncStorage.getItem('savedWashroomsIds');

      if (storedSavedWashrooms !== null) {
        const response = await fetch(`${GOHERE_SERVER_URL}/washroomsbyids?ids=${storedSavedWashrooms}&_=${new Date().getTime()}`);
        const data = await response.json();
        if(data){
          let updatedWashrooms = await addDistanceToWashrooms(data);
          updatedWashrooms = updatedWashrooms.sort((a, b) => a.distance - b.distance);
          setSavedWashrooms(updatedWashrooms.map((marker) => ({
            ...marker,
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude),
            displayDistance: marker.distance < 1000 ? `${marker.distance} m` : `${(marker.distance / 1000).toFixed(1)} km`,
            onCalloutClick: () => {
              setCurrentDetails(marker)
              setShowDetails(true)
            }
          })));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      fetchData();
  }, [currentLocation]);

  useFocusEffect(
      React.useCallback(() => {
          fetchData();
      }, [])
  );

  const fetchMarkers = async (coords) => {
    try {
      console.log(`${GOHERE_SERVER_URL}/nearbywashrooms?latitude=${coords.latitude}&longitude=${coords.longitude}&_=${new Date().getTime()}`);
      const response = await fetch(`${GOHERE_SERVER_URL}/nearbywashrooms?latitude=${coords.latitude}&longitude=${coords.longitude}&_=${new Date().getTime()}`);
      const data = await response.json();
      if (data){
        setMarkers(data.map((marker) => ({
          ...marker,
          latitude: parseFloat(marker.latitude),
          longitude: parseFloat(marker.longitude),
          displayDistance: marker.distance < 1000 ? `${marker.distance} m` : `${(marker.distance / 1000).toFixed(1)} km`,
          onCalloutClick: () => {
            setCurrentDetails(marker)
            setShowDetails(true)
          }
        })));
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  //Focuses on marker when clicking entry under "Washrooms Nearby"
  const handleNearbyViewClick = async (marker) => {
    await mapViewRef.current.animateToRegion({
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.0045,
      longitudeDelta: 0.0045,
    }, 1000);
    setTimeout(() => { markerRefs.current[marker.washroomid]?.showCallout();}, 1100);
  };

  const mainSnapPoints = useMemo(() => [80, 230, '87.5%'], []);
  const searchSnapPoints = useMemo(() => [330, '87.5%'], []);
  const routeSnapPoints = useMemo(() => [75, 172, '87.5%'], []);
  const savedSnapPoints = useMemo(() => [97.5, 201, '87.5%'], []);

  const switchToSearchBottomSheet = () => {
    setActiveBottomSheet('search');
    mainBottomSheetRef.current?.close();
    searchBottomSheetRef.current?.expand();
    routeBottomSheetRef.current?.close();
  };

  const switchToMainBottomSheet = () => {
    setActiveBottomSheet('main');
    setMarkerDisplayMode('nearme');
    Keyboard.dismiss();
    mainBottomSheetRef.current?.expand();
    searchBottomSheetRef.current?.close();
    savedBottomSheetRef.current?.close();
  
    mapViewRef.current?.animateToRegion(initialRegion, 1000);
  };

  const switchToSavedBottomSheet = () => {
    setMarkerDisplayMode('saved');
    setActiveBottomSheet('saved');
    Keyboard.dismiss();
    mainBottomSheetRef.current?.close();
    savedBottomSheetRef.current?.expand();
  }
  

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setActiveBottomSheet('route');
      mainBottomSheetRef.current?.close();
      searchBottomSheetRef.current?.close();
      routeBottomSheetRef.current?.expand();
    }
  }, [washroomsAlongRoute]);

  const renderModeOption = (mode, icon) => {
    const isSelected = selectedMode === mode;
    return (
      <TouchableOpacity
        onPress={() => setSelectedMode(mode)}
        style={[
          styles.modeOption,
          isSelected ? styles.selectedModeOption : null,
        ]}
      >
        <Image
          source={icon}
          style={isSelected ? styles.selectedIcon : styles.icon}
        />
      </TouchableOpacity>
    );
  };

  const handleConfirm = () => {
    if (startingPoint && destinationPoint) {
      setMarkerDisplayMode('route');
      setRoute({
        start: startingPoint,
        end: destinationPoint,
      });
      fetchRouteSteps(startingPoint, destinationPoint, selectedMode);
    } else {
      console.log('Starting or destination place is missing');
    }
  };

  const handleRouteSteps = async (routeSteps) => {
    const newStepsArray = routeSteps.map(step => ({
      latitude: step.end_location.lat,
      longitude: step.end_location.lng,
    }));
    try {
      const response = await fetch(`${GOHERE_SERVER_URL}/nearbywashroomsalongroute?steps=${encodeURIComponent(JSON.stringify(newStepsArray))}&_=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWashroomsAlongRoute(data);
    } catch (error) {
      console.error("Error fetching washrooms along route:", error);
    }
  };
  
  const fetchRouteSteps = async (origin, destination, mode) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode.toLowerCase()}&key=${GOOGLE_API_KEY}&_=${new Date().getTime()}`
    );
    const data = await response.json();
    if (data.routes.length > 0) {
      handleRouteSteps(data.routes[0].legs[0].steps);
    } else {
      console.log('No routes found');
    }
  };

  const fitRouteToMap = () => {
    if (!route) return;
  
    const coordinates = [
      { latitude: route.start.latitude, longitude: route.start.longitude },
      { latitude: route.end.latitude, longitude: route.end.longitude },
    ];
  
    mapViewRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
      animated: true,
    });
  };

  useEffect(() => {
    if (route) {
      fitRouteToMap();
    }
  }, [route]);
  
  return (
    <GestureHandlerRootView style={styles.container}>
      {showDetails ? (
        <WashroomDetails location={location} data={currentDetails} setShowDetails={setShowDetails}/>
      ) : (
        initialRegion && markers? (
        <><ClusteredMapView
          ref={mapViewRef}
          key={markers.length}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          radius={25} // Adjust the cluster radius as needed
          showsUserLocation
          mapPadding={ { top: StatusBar.currentHeight } }
          showsCompass
          clusterColor="#DA5C59"
          clusterTextColor="white"
        >
          {markerDisplayMode == 'nearme' && markers.map((marker) => (
            <CustomMarker
              ref={ref => markerRefs.current[marker.washroomid] = ref}
              key={marker.washroomid}
              id={marker.washroomid}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.washroomname}
              sponsorship={marker.sponsorship}
              onCalloutPress={marker.onCalloutClick}
            />
          ))}
          {markerDisplayMode == 'saved' && savedWashrooms.map((marker) => (
            <CustomMarker
              ref={ref => markerRefs.current[marker.washroomid] = ref}
              key={marker.washroomid}
              id={marker.washroomid}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.washroomname}
              sponsorship={marker.sponsorship}
              onCalloutPress={marker.onCalloutClick}
            />
          ))}
          {markerDisplayMode == 'route' && washroomsAlongRoute && washroomsAlongRoute.map((marker) => (
            <CustomMarker
              key={marker.washroomid}
              coordinate={{ latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude)}}
              title={marker.washroomname}
              sponsorship={marker.sponsorship}/>
          ))}
          {markerDisplayMode == 'route' && startingPoint && (
            <Marker coordinate={startingPoint}>
              <Image
                source={startingPointDestinationMarker}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {markerDisplayMode == 'route' && destinationPoint && (
            <Marker coordinate={destinationPoint}>
              <Image
                source={startingPointDestinationMarker}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {markerDisplayMode == 'route' && route && (
            <MapViewDirections
              origin={route.start}
              destination={route.end}
              apikey={GOOGLE_API_KEY}
              strokeWidth={4}
              strokeColor="#da5c59"
              mode={selectedMode}
            />
          )}
        </ClusteredMapView>
        <BottomSheet
          ref={mainBottomSheetRef}
          index={activeBottomSheet === 'main' ? 1 : -1} // Modify this line
          snapPoints={mainSnapPoints}
        >
          <View style={styles.searchBarSavedContainer}>
            <TouchableOpacity 
              style={styles.searchBarContainer}
              onPress={switchToSearchBottomSheet}>
              <Image 
                source={require('../../assets/material-symbols_search.png')}
                style={{ width: 25, height: 25}}  
              />
              <View style={styles.searchBar}>
                <Text style={{ color: '#5A5A5A' }}>Find Washrooms Along a Route</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.cornerButton}>
              <TouchableOpacity onPress={switchToSavedBottomSheet}>
                <Image source={require('../../assets/SavedButton.png')} style={styles.savedIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.WashroomsNearbyText}>Washrooms Nearby</Text>
          <BottomSheetScrollView>
          {markers.map((item, index) => (
            <TouchableOpacity key={item.washroomid} onPress={() => handleNearbyViewClick(item)}>
              <View key={index}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 1 }}>
                  <View style={{ backgroundColor: '#EFEFEF', height: '100%', width: '95%', borderRadius: 25 }}></View>
                </View>
                <View style={styles.washroomsNearbyContainer}>
                  <View style={styles.distanceContainer}>
                    <Image
                      source={require('../../assets/distanceIcon.png')}
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
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView >
          <View style={{ display: 'flex', flexDirection:'row', justifyContent:'center' ,height: 1}}>
            <View style={{backgroundColor: '#EFEFEF', height: '100%', width: '95%', borderRadius: 25}}></View>
          </View>
        </BottomSheet>
        <BottomSheet
          ref={savedBottomSheetRef}
          index={activeBottomSheet === 'saved' ? 1 : -1} // Modify this line
          snapPoints={savedSnapPoints}
        >
          <View style={styles.searchBarSavedContainer}>
            <Text style={styles.SavedWashroomsText}>Saved Washrooms</Text>
            <View style={styles.cornerButton}>
              <TouchableOpacity onPress={switchToMainBottomSheet}>
                <Image source={require('../../assets/back.png')} style={styles.backIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <BottomSheetScrollView>
          {savedWashrooms.map((item, index) => (
            <TouchableOpacity key={item.washroomid} onPress={() => handleNearbyViewClick(item)}>
              <View key={index}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 1 }}>
                  <View style={{ backgroundColor: '#EFEFEF', height: '100%', width: '95%', borderRadius: 25 }}></View>
                </View>
                <View style={styles.washroomsNearbyContainer}>
                  <View style={styles.distanceContainer}>
                    <Image
                      source={require('../../assets/distanceIcon.png')}
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
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView >
          <View style={{ display: 'flex', flexDirection:'row', justifyContent:'center' ,height: 1}}>
            <View style={{backgroundColor: '#EFEFEF', height: '100%', width: '95%', borderRadius: 25}}></View>
          </View>
        </BottomSheet>
        <BottomSheet
        ref={searchBottomSheetRef}
        index={activeBottomSheet === 'search' ? 1 : -1}
        snapPoints={searchSnapPoints}
        >
          <View style={styles.EnterRouteHeaderContainer}>
            <View style={styles.EnterRouteHeaderTextContainer}>
              <Text style={styles.EnterRouteHeaderText}>Enter Route Details</Text>
            </View>
            <TouchableOpacity onPress={switchToMainBottomSheet}>
              <Image source={require('../../assets/close.png')} style={styles.savedIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.SetPointContainer}>
            <Text style={styles.SetPointTitle}>Starting Point</Text>
            <GooglePlacesAutocomplete
              ref={autocompleteStartingRef}
              styles={{
                textInput: styles.placesInput,
                listView: {
                  margin: 0,
                  padding: 0,
                  backgroundColor: 'transparent',
                },
                row: {
                  backgroundColor: '#efefef',
                  paddingHorizontal: 10,
                  borderRadius: 8,
                },
                separator: {
                  backgroundColor: 'transparent',
                  height: 2,
                }}}
              placeholder='Enter Starting Point'
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) {
                  setStartingPoint({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  });
                }
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: 'en',
                components: 'country:ca',
              }}
              predefinedPlaces={[currentLocation]}
              enablePoweredByContainer={false}
              renderRow={(data) => {
                // Split the description into parts
                const parts = data.description.split(', ');
                const subtext = data.subtext;
                return (
                  <View style={styles.AutoCompleteCard}>
                    <Text style={styles.AutoCompleteMain}>{parts[0]}</Text>
                    {subtext ? (
                    <Text style={styles.AutoCompleteSub}>{subtext}</Text>
                  ) : (
                    <Text style={styles.AutoCompleteSub}>{parts.slice(1).join(', ')}</Text>
                  )}
                  </View>
                );
              }}
              renderRightButton={() => (
                <TouchableOpacity
                  onPress={() => {
                    autocompleteStartingRef.current?.clear();
                  }}
                  style={styles.clearButton}
                >
                  <Image source={require('../../assets/close.png')} style={styles.clearButtonImage} />
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.SetPointContainer2}>
            <Text style={styles.SetPointTitle}>Destination</Text>
            <GooglePlacesAutocomplete
              ref={autocompleteDestinationRef}
              styles={{
                textInput: styles.placesInput,
                listView: {
                  margin: 0,
                  padding: 0,
                  backgroundColor: 'transparent',
                },
                row: {
                  backgroundColor: '#efefef',
                  paddingHorizontal: 10,
                  borderRadius: 8,
                },
                separator: {
                  backgroundColor: 'transparent',
                  height: 2,
                }}}
              placeholder='Enter Destination'
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) {
                  setDestinationPoint({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  });
                }
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: 'en',
                components: 'country:ca',
              }}
              enablePoweredByContainer={false}
              renderRow={(data) => {
                // Split the description into parts
                const parts = data.description.split(', ');
                const subtext = data.subtext;
                return (
                  <View style={styles.AutoCompleteCard}>
                    <Text style={styles.AutoCompleteMain}>{parts[0]}</Text>
                    {subtext ? (
                    <Text style={styles.AutoCompleteSub}>{subtext}</Text>
                  ) : (
                    <Text style={styles.AutoCompleteSub}>{parts.slice(1).join(', ')}</Text>
                  )}
                  </View>
                );
              }}
              renderRightButton={() => (
                <TouchableOpacity
                  onPress={() => {
                    autocompleteDestinationRef.current?.clear();
                  }}
                  style={styles.clearButton}
                >
                  <Image source={require('../../assets/close.png')} style={styles.clearButtonImage} />
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.TransportContainer}>
            <Text style={styles.SetPointTitle}>Mode of Transport</Text>
            <View style={{ marginTop:10, flexDirection: 'row', justifyContent: 'space-around',}}>
              {renderModeOption('DRIVING', require('../../assets/car.png'))}
              {renderModeOption('TRANSIT', require('../../assets/train.png'))}
              {renderModeOption('WALKING', require('../../assets/walk.png'))}
              {renderModeOption('BICYCLING', require('../../assets/bike.png'))}
            </View>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </BottomSheet>
        <BottomSheet
        ref={routeBottomSheetRef}
        index={activeBottomSheet === 'route' ? 1 : -1}
        snapPoints={routeSnapPoints}
        >
          <View style={styles.WashroomsRouteHeaderContainer}>
            <View style={styles.EnterRouteHeaderTextContainer}>
              <Text style={styles.EnterRouteHeaderText}>Washrooms Along Route</Text>
            </View>
            <TouchableOpacity onPress={switchToSearchBottomSheet}>
              <Image source={require('../../assets/pencil.png')} style={styles.savedIcon} />
            </TouchableOpacity>
          </View>
          <BottomSheetScrollView>
            {washroomsAlongRoute.map((item, index) => (
              <View key={index}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 1 }}>
                  <View style={{ backgroundColor: '#EFEFEF', height: '100%', width: '95%', borderRadius: 25 }}></View>
                </View>
                <View style={styles.washroomsNearbyRouteContainer}>
                  <View style={styles.nameAddressContainer}>
                    <Text style={styles.name}>{item.washroomname}</Text>
                    <Text style={styles.address}>{item.address1}{item.address2 ? ` ${item.address2}` : ''}</Text>
                    <Text style={styles.address}>{item.postalcode}, {item.city}, {item.province}</Text>
                  </View>
                </View>
              </View>
            ))}
          </BottomSheetScrollView>
        </BottomSheet>
        </>
      ) : (
        <Text>Loading...</Text>
      ))}
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
    fontSize: 14,
    paddingLeft: 10,
  },
  cornerButton: {
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
  savedIcon: {
    width: 19,
    height: 26,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  WashroomsNearbyText: {
    fontSize: 20,
    marginLeft: 15,
    marginTop: 25,
    color: '#DA5C59',
    fontWeight: 'bold', // change this to medium once font is imported
    marginBottom: 10,
  },
  SavedWashroomsText: {
    fontSize: 22,
    marginLeft: 15,
    marginTop: 25,
    color: '#DA5C59',
    fontWeight: 'bold', // change this to medium once font is imported
    marginBottom: 17.5,
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
    width: 50
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
  EnterRouteHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  EnterRouteHeaderTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  EnterRouteHeaderText: {
    fontSize: 22,
    color: '#DA5C59',
    fontWeight: 'bold',
  },
  xIcon: {
    width: 32,
    height: 32,
  },
  placesInput: {
    borderWidth: 1,
    borderColor: '#5E6366',
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    height: 45,
  },
  SetPointContainer: {
    position: "absolute",
    top: 50,
    left: 15,
    right: 15,
    zIndex: 2,
  },
  SetPointContainer2: {
    position: "absolute",
    top: 170,
    left: 15,
    right: 15,
    zIndex: 1,
  },
  SetPointTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  AutoCompleteCard: {
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  AutoCompleteMain: {
    fontSize: 16,
    marginBottom: 5
  },
  AutoCompleteSub: {
    fontSize: 12
  },
  clearButton: {
    // Style for the clear button container
    position: 'absolute',
    right: 10,
    top: 10,
    height: 25,
    width: 25,
    backgroundColor: '#efefef',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonImage: {
    width: 15,
    height: 15,
  },
  TransportContainer: {
    position: "absolute",
    top: 300,
    left: 15,
    right: 15,
    zIndex: 0,
  },
  modeOption: {
    padding: 14,
    borderRadius: 90,
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedModeOption: {
    backgroundColor: '#DA5C59',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: 'black',
  },
  selectedIcon: {
    width: 23,
    height: 23,
    tintColor: 'white',
  },
  confirmButton: {
    position: "absolute",
    left: 15,
    right: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#DA5C59', 
    borderColor: '#DA5C59',
    bottom: 30,
  },
  confirmButtonText: {
      fontSize: 16,
      color: 'white',
      fontWeight: 'bold',
  },
  WashroomsRouteHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  washroomsNearbyRouteContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 100,
    marginHorizontal: 15,
  },
});

export default App;
