import React from 'react';
import { View, Text, StyleSheet , TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BusinessApplicationScreen from './BusinessApplicationScreen';
import PublicApplicationScreen from './PublicApplicationScreen';

const AdminApplicationScreen = () => {
    const navigation = useNavigation();

    const handleBusinessPress = () => {
        // navigation.navigate('BusinessApplicationScreen');
    };

    const handlePublicPress = () => {
    //     navigation.navigate('PublicApplicationScreen');
    };

    // const[bApplications, setBApplications] = useState([]);
    // const[bStatusCounts, bSetStatusCounts] = useState({
    //     0: 0,
    //     1: 0,
    //     2: 0,
    //     3: 0,
    //     4: 0,
    //     5: 0,
    // });

    // // Function for receiving the backend response of business applications and storing it in b_apps
    // fetchingBusinessApplications = async () => {
    //     try {
    //         const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/applications`);

    //         if (!response.ok) {
    //             throw new Error('Server responded with an error.');
    //         }
    //         const data = await response.json(); 

    //         setBApplications(data.bApplications);

    //         // Calculate status counts
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


    //     } catch (error) {
    //         console.error('Error fetching applications', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchBusinessApplications();
    
    //     // Schedule the next fetch after a delay
    //     const timer = setInterval(fetchBusinessApplications, 7000); // Fetch data every 7 seconds
    
    //     // Clean-up function to stop fetching when the component unmounts
    //     return () => clearInterval(timer);
    // }, []);



    return (
        <View style = {styles.container}>
            <View style = {styles.header}>
                <Text style={styles.headerText}>Applications</Text>
            </View>

            <TouchableOpacity style={styles.card} onPress={handleBusinessPress}>
                <Text style={styles.cardHeader}>Business Applications</Text>
                <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.cardImage} source={require('./business-apps.png')}/>
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
                        <Image style={styles.cardImage} source={require('./public-apps.png')}/>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start', 
        paddingTop: 100, 
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingLeft: 30, 
        paddingTop: 50, 
    },

    headerText:{
        color: '#DA5C59',
        fontSize: 30,
        fontWeight: 'bold',
    },

    card:{
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        padding: 15,
        width: '83%',
        height: '28%',
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

export default AdminApplicationScreen;