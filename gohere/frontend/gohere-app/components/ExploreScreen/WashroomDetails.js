import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import calculateDistance from './CalculateDistance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WashroomDetails = ({ location, data, setShowDetails }) => {
  const [saved, setSaved] = React.useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
  });

  const isWashroomSaved = async (washroomid) => {
    const storedSavedWashrooms = await AsyncStorage.getItem('savedWashroomsIds');
    const savedArr = JSON.parse(storedSavedWashrooms);
    setSaved(savedArr.includes(washroomid));
  };

  const saveWashroom = async (washroomid) => {
    const storedSavedWashrooms = await AsyncStorage.getItem('savedWashroomsIds');
    let savedArr = JSON.parse(storedSavedWashrooms);
    if(savedArr === null){
      savedArr = [];
    }
    savedArr.push(washroomid);
    await AsyncStorage.setItem('savedWashroomsIds', JSON.stringify(savedArr));
    setSaved(true);
  };

  const unsaveWashroom = async (washroomid) => {
    const storedSavedWashrooms = await AsyncStorage.getItem('savedWashroomsIds');
    let savedArr = JSON.parse(storedSavedWashrooms);
    const index = savedArr.indexOf(washroomid);
    if (index > -1) {
      savedArr.splice(index, 1);
    }
    await AsyncStorage.setItem('savedWashroomsIds', JSON.stringify(savedArr));
    setSaved(false);
  };
  
  useEffect(() => {
    if(data){
      isWashroomSaved(data.washroomid);
    }
  }, [data]);

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
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.row}>
        <Text style={styles.title}>{data.washroomname}</Text>
        {location !== null && calculateDistance(location.coords.latitude, location.coords.longitude, data.latitude, data.longitude) >= 1000 && (
          <View style={styles.distanceContainer}>
            <Image source={require('../../assets/gps.png')} style={styles.gpsIcon} />
            <Text style={styles.lightText}>{(calculateDistance(location.coords.latitude, location.coords.longitude, data.latitude, data.longitude) / 1000).toFixed(1)} km</Text>
          </View>
        )}
        {location !== null && calculateDistance(location.coords.latitude, location.coords.longitude, data.latitude, data.longitude) < 1000 && (
          <View style={styles.distanceContainer}>
            <Image source={require('../../assets/gps.png')} style={styles.gpsIcon} />
            <Text style={styles.lightText}>{calculateDistance(location.coords.latitude, location.coords.longitude, data.latitude, data.longitude)} m</Text>
          </View>
        )}
      </View>

      <Text style={styles.lightText}>{data.address1}</Text>
      {data.address2 !== null && data.address2 !== "" && (
        <Text style={styles.lightText}>{data.address2}</Text>
      )}
      <Text style={styles.lightText}>{data.city},  {data.province}, {data.postalcode}, Canada</Text>
      {saved ? 
        <TouchableOpacity onPress={() => {unsaveWashroom(data.washroomid)}} style={styles.savedButtonContainer}>
          <Image source={require('../../assets/SavedButton.png')} style={styles.savedIcon}/>
          <Text style={styles.savedText}>Saved</Text>
        </TouchableOpacity> : 
        <TouchableOpacity onPress={() => {saveWashroom(data.washroomid)}} style={styles.notSavedButtonContainer}>
          <Image source={require('../../assets/notsaved.png')} style={styles.notSavedIcon}/>
          <Text style={styles.notSavedText}>Save</Text>
        </TouchableOpacity>}
      <Text style={styles.header}>Hours</Text>
      <View style={styles.hours}>
        {data.openinghours ? (
          data.openinghours.map((openingHour, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.lightText}>{days[index]}</Text>
            <Text style={styles.time}>{`${formatTime(openingHour)} - ${formatTime(data.closinghours[index])}`}</Text>
          </View>
        ))) : <Text style={styles.lightText}>Closed</Text>
        }
      </View>

      {data.email !== null && data.email !== "" && (
        <>
          <Text style={styles.header}>Contact</Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }}>{data.email}</Text>
        </>
      )}

      <Text style={styles.header}>Photos</Text>
      {/* Update to pull images from database */}
      <Image style={styles.image} source={require('../../assets/exampleloc.png')} />
      </ScrollView>
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
  },
  savedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    width: 90,
    height: 35,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#DA5C59',
    backgroundColor: '#DA5C59',
  },
  savedIcon: {
    width: 15,
    height: 20,
    tintColor: '#FFFFFF',
  },
  savedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#FFFFFF',
    paddingRight: 2,
  },
  notSavedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    width: 90,
    height: 35,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#DA5C59',
    backgroundColor: '#FFFFFF',
  },
  notSavedIcon: {
    width: 15,
    height: 20,
  },
  notSavedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#DA5C59',
    paddingRight: 6,
  },
  gpsIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
    tintColor: '#5A5A5A',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 20,
    marginTop: 8,
  },
});

export default WashroomDetails;