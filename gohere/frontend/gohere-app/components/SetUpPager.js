import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import SetUpPage from './SetUpPage';
import SetUpPage2 from './SetUpPage2';
import SetUpPage3 from './SetUpPage3';

const SetUpPager = ({ onComplete }) => {
    const pagerRef = useRef(null);
    const [pageIndex, setPageIndex] = useState(0);
    const pages = [
        <SetUpPage key="page1" />,
        <SetUpPage2 key="page2" />,
        <SetUpPage3 key="page3" />,
    ];

    const handleNext = () => {
        if (pagerRef.current) {
            const nextPage = pageIndex + 1;
            if (nextPage < pages.length) {
                pagerRef.current.setPage(nextPage);
                setPageIndex(nextPage);
            } else {
                // Handle finish action
            }
        }
    };

    const handleSkip = () => {
        if (pagerRef.current) {
            const nextPage = pageIndex + 1;
            if (nextPage < pages.length) {
                pagerRef.current.setPage(nextPage);
                setPageIndex(nextPage);
            } else {
                // Handle finish action
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <PagerView
                    ref={pagerRef}
                    style={styles.pagerView}
                    initialPage={0}
                    onPageSelected={(event) => {
                        setPageIndex(event.nativeEvent.position);
                    }}
                >
                {pages}
                </PagerView>
                {pageIndex === 2 ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.finishButton}>
                            <Text style={styles.finishText}>Finish</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                            <Text style={styles.nextText}>Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        padding: 20,
        flex: 1,
        flexDirection: 'column'
    },
    pagerView: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
    },
    nextText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    skipText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'black'
    },
    nextButton: {
        backgroundColor: 'black', 
        flex: 1.8,
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 13, 
        paddingHorizontal: 20, 
        borderRadius: 10, 
        marginRight: 5, 
    },
    skipButton: {
        backgroundColor: '#EFEFEF', 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius: 10,
        marginLeft: 5, 
    },
    finishButton: {
        backgroundColor: 'black', 
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 13, 
        paddingHorizontal: 20, 
        borderRadius: 10, 
        marginRight: 5, 
    },
    finishText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    headingContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    indicator:{
        width: width*0.15,
        resizeMode: 'contain',
    },
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#DA5C59',
    },
});

export default SetUpPager;
