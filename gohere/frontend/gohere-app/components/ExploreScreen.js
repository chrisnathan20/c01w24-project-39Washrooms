import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import * as Location from 'expo-location';

import { GOHERE_SERVER_URL } from '@env'; // Import the server URL from the .env file
import markerIcon from '../assets/default-marker.png'; // Default marker icon


const CustomMarker = ({ coordinate, title, icon }) => {
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
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      });

      // fetch markers from db every 100 meters covered
      fetchWatcher.current = Location.watchPositionAsync(
        { distanceInterval: 5},
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
          displayDistance: marker.distance < 1000 ? `${marker.distance}m` : `${(marker.distance / 1000).toFixed(1)}km`
        })));
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  return (
    <View style={styles.container}>
      {initialRegion && markers? (
        <ClusteredMapView
          key={markers.length}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          radius={35} // Adjust the cluster radius as needed
          showsUserLocation
          showsMyLocationButton
          showsCompass
          clusterColor="#DA5C59"
          clusterTextColor="white"
        >
          {markers.map((marker) => (
            <CustomMarker
              key={marker.washroomid}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.washroomname}
              icon={markerIcon}
            />
          ))}
        </ClusteredMapView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
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
});

export default App;
