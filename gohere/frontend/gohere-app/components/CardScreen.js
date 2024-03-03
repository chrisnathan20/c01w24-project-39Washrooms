import { View, Text, StyleSheet, Switch } from 'react-native';
import AccessCard from './AccessCard';

export default function CardScreenTest() {

    return (
        <View style={styles.cardPageContainer}>
            <Text style={[styles.heading_text]}>Access Card</Text>
            <AccessCard/>
        </View>

        
    );
}

const styles = StyleSheet.create({
    cardPageContainer: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    heading_text: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#DA5C59',
        textAlign: 'left',
        margin: 25,
    },

    label: {
    marginRight: 10,
    },
});