import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useFonts } from 'expo-font';

const SpecifyLocation = ({ navigation }) => {
    const [region, setRegion] = useState(null);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }


    useEffect(() => {
        (async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
      
            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0045,
                longitudeDelta: 0.0045,
            });
        })();
    }, []);

    const handleRegionChange = (region) => {
        setRegion(region);
    };
      
    const handleConfirm = async () => {
        console.log('Confirmed Location:', region);
        navigation.navigate('Enter Address', { 
            latitude: region.latitude, 
            longitude: region.longitude 
        }); 
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}><Text style={styles.text}>Move the map precisely to position the toilet</Text></View>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                initialRegion={region}
                onRegionChangeComplete={handleRegionChange}
            />
            <View style={styles.markerFixed}>
                <Image
                source={require('../../../assets/default-marker.png')} 
                style={styles.marker}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm position</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textContainer:{
    marginBottom: 18,
    marginTop: 10,
    marginLeft: 18
  },
  text:{
    fontSize: 16,
    fontFamily: 'Poppins-Medium'
  },
  markerFixed: {
    position: 'absolute',
    top: '50%', // Position the marker halfway down the container
    left: '50%', // Position the marker halfway across the container
    transform: [
      { translateX: -25 }, // Adjust these values so the center of the marker
      { translateY: -50 }, // lines up with the center of the map view
    ],
  },
  marker: {
    width: 50,
    height: 50,
    resizeMode: "contain"
  },
  map: {
    flex:1
  },
  confirmButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#DA5C59', 
    borderColor: '#DA5C59',
    margin: 20 
},
confirmButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'white'
},
});

export default SpecifyLocation