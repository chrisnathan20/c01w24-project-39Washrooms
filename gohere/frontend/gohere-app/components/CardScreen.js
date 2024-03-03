import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import AccessCard from './AccessCard';
import AccessCardFr from './AccessCardFr';

export default function CardScreenTest() {
    const [isFrench, setisFrench] = React.useState(false);
    const activeColor = '#DA5C59';
    const inactiveColor = '#EDEDED'; // Grey color

    const handleToggle = () => {
        LayoutAnimation.easeInEaseOut();
        setisFrench(!isFrench);
    };

    return (
        <View style={styles.cardPageContainer}>
            <View style={styles.cardHeader}>
            <Text style={styles.heading_text}>{isFrench ? "Carte d'accès" : 'Access Card'}</Text>

                <TouchableOpacity
                    style={styles.toggle}
                    onPress={handleToggle}>
                        
                    <View style={[
                        styles.toggleInView,
                        {backgroundColor: isFrench ? inactiveColor : activeColor,
                        justifyContent: 'center'}
                    ]}>
                        <Text 
                            style={[styles.toggleLabel, 
                            { color: isFrench ? '#DA5C59' : 'white' }]}>
                            en</Text>
                    
                    </View>

                    <View style={[
                        styles.toggleInView,
                        {backgroundColor: isFrench ? activeColor : inactiveColor,
                            justifyContent: 'center'}
                    ]}>
                        <Text style={[styles.toggleLabel, { color: isFrench ? 'white' : '#DA5C59' }]}>fr</Text>
                    
                    </View>
                </TouchableOpacity>
            </View>
            {isFrench ? <AccessCardFr /> : <AccessCard />}
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    heading_text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#DA5C59',
        textAlign: 'left',
        marginTop: 25,
        marginBottom: 25,
    },
    toggle: {
        height: 40,
        width: 120,
        borderRadius: 5,
        borderWidth: 5,
        borderColor: '#EDEDED',
        backgroundColor: '#EDEDED',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'stretch', // Adjusted to stretch items to fill the height
    },
    toggleInView: {
        flex: 1, // Equal flex for both views to take half of the TouchableOpacity
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
