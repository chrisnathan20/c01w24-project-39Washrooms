import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminReportScreen = () => {
    return (
        <View style = {styles.container}>
            <Text>Admin report screen</Text>
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

export default AdminReportScreen;