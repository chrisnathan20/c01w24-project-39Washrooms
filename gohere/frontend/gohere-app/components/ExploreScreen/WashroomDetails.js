import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import calculateDistance from './CalculateDistance';

const WashroomDetails = ({ location, data, setShowDetails }) => {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const formatTime = (time) => {
    return time.toString().slice(0, 5);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <View style={styles.container}>
      <View style={styles.closeButtonHolder}>
        <TouchableOpacity onPress={() => { setShowDetails(false) }} style={styles.closeButton}>
          <View style={styles.circle}>
            <Image style={styles.closeIcon} source={require('../../assets/closebutton.png')} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.title}>{data.washroomname}</Text>
        {location !== null && (
          <Text style={styles.lightText}>{(calculateDistance(location.coords.latitude, location.coords.longitude, data.latitude, data.longitude) / 1000).toFixed(1)} km</Text>
        )}
      </View>

      <Text style={styles.lightText}>{data.address1}</Text>
      {data.address2 !== null && data.address2 !== "" && (
        <Text style={styles.lightText}>{data.address2}</Text>
      )}
      <Text style={styles.lightText}>{data.city},  {data.province}, {data.postalcode}, Canada</Text>

      <Text style={styles.header}>HOURS</Text>
      <View style={styles.hours}>
        {data.openinghours.map((openingHour, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.lightText}>{days[index]}</Text>
            <Text style={styles.time}>{`${formatTime(openingHour)} - ${formatTime(data.closinghours[index])}`}</Text>
          </View>
        ))}
      </View>

      {data.email !== null && data.email !== "" && (
        <>
          <Text style={styles.header}>CONTACT</Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }}>{data.email}</Text>
        </>
      )}

      <Text style={styles.header}>PHOTOS</Text>
      {/* Update to pull images from database */}
      <Image style={styles.image} source={require('../../assets/exampleloc.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingTop: 35,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FFFFFF'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    width: '70%',
  },
  lightText: {
    fontFamily: 'Poppins-Regular',
    color: '#404040',
    marginBottom: 2
  },
  header: {
    color: '#DA5C59',
    fontFamily: 'Poppins-Bold',
    fontWeight: '500',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5
  },
  time: {
    fontFamily: 'Poppins-Regular',
  },
  image: {
    borderRadius: 10
  },
  closeButtonHolder: {
    marginBottom: 50
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 5,
  },
  closeIcon: {
    width: 10,
    height: 10
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default WashroomDetails;