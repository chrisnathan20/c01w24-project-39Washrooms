import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { GOHERE_SERVER_URL } from '../../env.js';

const Applications = ({ navigation }) => {
    const [businessApplicationCounts, setBusinessApplicationCounts] = useState({
        pending: 0,
        prescreening: 0,
        onsitereview: 0,
        finalreview: 0
    });
      
    const [publicApplicationCounts, setPublicApplicationCounts] = useState({
        pending: 0,
        prescreening: 0,
        onsitereview: 0,
        finalreview: 0
    });
      
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const filterToStatusCode = {
        'pending': 0,
        'prescreening': 1,
        'onsitereview': 2,
        'finalreview': 3
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${GOHERE_SERVER_URL}/admin/applicationscount`);
                const data = await response.json();
                const mapStatusCounts = (counts) => {
                    // Start with an object that has all statuses set to 0
                    const initialCounts = {
                        pending: 0,
                        prescreening: 0,
                        onsitereview: 0,
                        finalreview: 0
                    };

                    return counts.reduce((acc, { status, application_count }) => {
                        const statusName = Object.keys(filterToStatusCode).find(key => filterToStatusCode[key] === status);
                        acc[statusName] = application_count;
                        return acc;
                    }, initialCounts); // Use initialCounts as the starting value for the accumulator
                };

                setBusinessApplicationCounts(mapStatusCounts(data.business));
                setPublicApplicationCounts(mapStatusCounts(data.public));
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);
      
    if (!fontsLoaded && !fontError) {
        return null;
    }
  const handleBusinessPress = () => {
    navigation.navigate('Business Applications');
  };

  const handlePublicPress = () => {
    navigation.navigate('Public Applications');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleBusinessPress}>
        <Text style={styles.cardHeader}>Business Applications</Text>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.cardImage} source={require('../../assets/business-apps.png')} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{businessApplicationCounts.pending}</Text> pending</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{businessApplicationCounts.prescreening}</Text> pre-screening</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{businessApplicationCounts.onsitereview}</Text> on-site review</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{businessApplicationCounts.finalreview}</Text> final review</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handlePublicPress}>
        <Text style={styles.cardHeader}>Public Applications</Text>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.cardImage} source={require('../../assets/public-apps.png')} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{publicApplicationCounts.pending}</Text> pending</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{publicApplicationCounts.prescreening}</Text> pre-screening</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{publicApplicationCounts.onsitereview}</Text> on-site review</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{publicApplicationCounts.finalreview}</Text> final review</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },

  card:{
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    margin: 20,
    marginVertical: 10,
},

cardHeader: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
},

contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},

imageContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1
},

cardImage: {
    height: 150,
    width: 60, 
    resizeMode: 'contain',
},

textContainer: {
    flex: 0.9,
},

categoryLine: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
},

highlightedText: {
    color: '#DA5C59',
    fontSize: 20
},
});

export default Applications;