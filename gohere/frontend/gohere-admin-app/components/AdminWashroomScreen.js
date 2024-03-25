import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminWashroomScreen = () => {
    return (
        <View style = {styles.container}>
            <Text>Admin washroom screen</Text>
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

export default AdminWashroomScreen;