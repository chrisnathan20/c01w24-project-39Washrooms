import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MoreInfo = ({ route }) => {
    const { applicationId, type } = route.params;
    return (
        <View style = {styles.container}>
            <Text>More Info Screen for washroom: {applicationId}, type: {type}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default MoreInfo;