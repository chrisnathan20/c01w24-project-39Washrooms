import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GOHERE_SERVER_URL, GOOGLE_API_KEY } from '../env.js';

const AdminApplicationStack = ({ navigation }) => {
  const handleBusinessPress = () => {
    navigation.navigate('Business Applications');
  };

  const handlePublicPress = () => {
    navigation.navigate('Public Applications');
  };

  const[bApplications, setBApplications] = useState([]);
    const[bStatusCounts, bSetStatusCounts] = useState({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    });

    // Function for receiving the backend response of business applications and storing it in b_apps
    fetchBusinessApplications = async () => {
      console.log(`${GOHERE_SERVER_URL}`);
      try {
        const response = await fetch(`${GOHERE_SERVER_URL}/admin/getAllBusinessApps`);

        if (!response.ok) {
            throw new Error('Server responded with an error.');
        }

        const text = await response.text(); // Get response as text
        //console.log('Response:', text); // Log the response
        //const data = await response.json(); 

        setBApplications(data.applications);

        // Calculate status counts
    //         const bCounts = {
    //             0: 0,
    //             1: 0,
    //             2: 0,
    //             3: 0,
    //             4: 0,
    //             5: 0,
    //         };

    //         data.applications.forEach(application => {
    //             bCounts[application.status] += 1;
    //         });

    //         bSetStatusCounts(bCounts);
       
      } catch (error) {
        console.error('Error fetching business applications', error);
      }
    };

    useEffect(() => {
        fetchBusinessApplications();
    
        //const timer = setInterval(fetchBusinessApplications, 7000); // Fetch data every 7 seconds
    
        //return () => clearInterval(timer);
    }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleBusinessPress}>
        <Text style={styles.cardHeader}>Business Applications</Text>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.cardImage} source={require('./business-apps.png')} />
          </View>
          <View style={styles.textContainer}>
            {/* <Text style={styles.categoryLine}><Text style={styles.highlightedText}>{bStatusCounts[0]}</Text> pending</Text>  */}
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pending</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pre-screening</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> on-site review</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> final review</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handlePublicPress}>
        <Text style={styles.cardHeader}>Public Applications</Text>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.cardImage} source={require('./public-apps.png')} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pending</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> pre-screening</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> on-site review</Text>
            <Text style={styles.categoryLine}><Text style={styles.highlightedText}>x</Text> final review</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center', // Center items horizontally
      //justifyContent: 'center', // Center items vertically
    },

  card:{
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 15,
    width: '85%',
    height: '30%',
    elevation: 10,
    marginVertical: 10,
    paddingLeft: 30,
    overflow: 'hidden', 
},

cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
},

contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},

imageContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    marginTop: -10,
},

cardImage: {
    height: '90%', 
    resizeMode: 'contain',
    alignSelf: 'flex-start', 
},

textContainer: {
    flex: 2,
    marginRight: -100,
    marginTop: -15,
},

categoryLine: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
},

highlightedText: {
    color: '#DA5C59',
},
});

export default AdminApplicationStack;
