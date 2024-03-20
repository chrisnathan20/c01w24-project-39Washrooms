import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminSponsorScreen = () => {
    return (
        <View style = {styles.container}>
            <Text>Admin sponsor screen</Text>
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

export default AdminSponsorScreen;