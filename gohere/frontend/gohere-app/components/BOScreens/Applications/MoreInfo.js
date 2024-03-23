import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MoreInfo = ({ route }) => {
    const { applicationId } = route.params;
    return (
        <View style = {styles.container}>
            <Text>BO More Info Screen for application: {applicationId}</Text>
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