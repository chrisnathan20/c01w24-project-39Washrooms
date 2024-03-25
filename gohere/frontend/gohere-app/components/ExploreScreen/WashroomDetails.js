import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import calculateDistance from './CalculateDistance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '../../env.js';

const WashroomDetails = ({ location, data, setShowDetails }) => {
  const [saved, setSaved] = React.useState(false);
  const [reported, setReported] = React.useState(false);
  const [unavailable, setUnavailable] = React.useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
  });

  const isRecentlyReported = async (washroomid) => {
    try {
      const response = await fetch(`${GOHERE_SERVER_URL}/checkRecentReports?washroomid=${washroomid}&_=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.reports >= 3) {
        setUnavailable(true);
      }
    }
    catch (error) {
      console.error("Error fetching number of recent reports:", error);
    }
  }

  const isWashroomSaved = async (washroomid) => {
    const storedSavedWashrooms = await AsyncStorage.getItem('savedWashroomsIds');
    const savedArr = JSON.parse(storedSavedWashrooms);
    setSaved(savedArr.includes(washroomid));
  };

  const saveWashroom = async (washroomid) => {
    const storedSavedWashrooms = await AsyncStorage.getItem('savedWashroomsIds');
    let savedArr = JSON.parse(storedSavedWashrooms);
    if (savedArr === null) {
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
    if (data) {
      isWashroomSaved(data.washroomid);
      isRecentlyReported(data.washroomid);
    }
  }, [data]);

  const reportWashroom = async (washroomid) => {
    try {
      const response = await fetch(`${GOHERE_SERVER_URL}/userReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ washroomid: washroomid })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("Submitted report")
      setReported(true);
    }
    catch (error) {
      console.error("Error submitting user report:", error);
    }
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const formatTime = (time) => {
    return time.toString().slice(0, 5);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const distance = calculateDistance(location.coords.latitude, location.coords.longitude, data.latitude, data.longitude);

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
          {location !== null && distance >= 1000 && (
            <View style={styles.distanceContainer}>
              <Image source={require('../../assets/gps.png')} style={styles.gpsIcon} />
              <Text style={styles.lightText}>{(distance / 1000).toFixed(1)} km</Text>
            </View>
          )}
          {location !== null && distance < 1000 && (
            <View style={styles.distanceContainer}>
              <Image source={require('../../assets/gps.png')} style={styles.gpsIcon} />
              <Text style={styles.lightText}>{distance} m</Text>
            </View>
          )}
        </View>

        <Text style={styles.lightText}>{data.address1}</Text>
        {data.address2 !== null && data.address2 !== "" && (
          <Text style={styles.lightText}>{data.address2}</Text>
        )}
        <Text style={styles.lightText}>{data.city},  {data.province}, {data.postalcode}, Canada</Text>
        <View style={styles.flexStartRow}>
          {saved ?
            <TouchableOpacity onPress={() => { unsaveWashroom(data.washroomid) }} style={styles.savedButtonContainer}>
              <Image source={require('../../assets/SavedButton.png')} style={styles.savedIcon} />
              <Text style={styles.savedText}>Saved</Text>
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => { saveWashroom(data.washroomid) }} style={styles.notSavedButtonContainer}>
              <Image source={require('../../assets/notsaved.png')} style={styles.notSavedIcon} />
              <Text style={styles.notSavedText}>Save</Text>
            </TouchableOpacity>}

          {distance <= 200 && (
            reported ?
              <View style={styles.reportButtonClicked}>
                <Image source={require('../../assets/grey-check.png')} style={styles.reportedIcon} />
                <Text style={styles.reportedText}>Reported</Text>
              </View> :
              <TouchableOpacity onPress={() => { reportWashroom(data.washroomid) }} style={styles.reportButtonInit}>
                <Image source={require('../../assets/warning.png')} style={styles.reportIcon} />
                <Text style={styles.notSavedText}>Report</Text>
              </TouchableOpacity>
          )}
        </View>

        <View style={styles.flexStartRow}>
          <Text style={styles.header}>Hours</Text>
          {unavailable &&
            <View style={styles.unavailable}>
              <Image source={require('../../assets/warning.png')} style={styles.unavailableIcon} />
              <Text style={styles.unavailableText}>Recently reported as unavailable</Text>
            </View>
          }
        </View>
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
    marginBottom: 5
  },
  flexStartRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    borderWidth: 1.5,
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
    borderWidth: 1.5,
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
  unavailable: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 17,
    marginLeft: 15
  },
  unavailableIcon: {
    width: 18,
    height: 16,
    marginRight: 4,
    padding: 2,
    tintColor: '#fc0000'
  },
  unavailableText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#fc0000',
    paddingRight: 2,
  },
  reportButtonInit: {
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    width: 90,
    height: 35,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#DA5C59',
    backgroundColor: '#FFFFFF',
  },
  reportIcon: {
    width: 18,
    height: 16,
    marginLeft: 1,
    marginRight: 4,
    padding: 2,
  },
  reportButtonClicked: {
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    width: 90,
    height: 35,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#ababab',
    backgroundColor: '#FFFFFF',
  },
  reportedIcon: {
    width: 12,
    height: 14,
    marginLeft: 1,
    marginRight: 4,
    padding: 2,
  },
  reportedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#ababab',
    paddingRight: 6,
  }
});

export default WashroomDetails;