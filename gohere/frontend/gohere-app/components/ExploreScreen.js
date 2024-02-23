import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import * as Location from 'expo-location';

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
  const [markers, setMarkers] = useState([]);

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

      // Example: Adding a few markers
      setMarkers([
        { id: 1, title: 'Washroom 1', latitude: location.coords.latitude + 0.001, longitude: location.coords.longitude + 0.001 },
        { id: 2, title: 'Washroom 2', latitude: location.coords.latitude - 0.001, longitude: location.coords.longitude - 0.001 },
        { id: 3, title: 'Washroom 3', latitude: location.coords.latitude + 0.001, longitude: location.coords.longitude - 0.001 },
      ]);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {initialRegion ? (
        <ClusteredMapView
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
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
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
