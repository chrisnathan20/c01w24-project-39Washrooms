import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView, Image, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useFonts } from 'expo-font';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditHours = ({ navigation, route }) => {
    const [hours, setHours] = useState({
        Sunday: { open: false, opening: null, closing: null },
        Monday: { open: false, opening: null, closing: null },
        Tuesday: { open: false, opening: null, closing: null },
        Wednesday: { open: false, opening: null, closing: null },
        Thursday: { open: false, opening: null, closing: null },
        Friday: { open: false, opening: null, closing: null },
        Saturday: { open: false, opening: null, closing: null },
    });
    const [selectedDays, setSelectedDays] = useState({
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
    }); 
    const [modalVisible, setModalVisible] = useState(false);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    });
    const [isOpen24Hours, setIsOpen24Hours] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const initialTime = new Date();
    initialTime.setHours(0, 0, 0, 0);
    const [selectedOpeningTime, setSelectedOpeningTime] = useState(initialTime);
    const [selectedClosingTime, setSelectedClosingTime] = useState(initialTime);
    const [disableTimePickers, setDisableTimePickers] = useState(false);
    const [showOpeningTimePicker, setShowOpeningTimePicker] = useState(false);
    const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const handleNext = async () => {
        navigation.navigate('Info and Images', {
            ...route.params,
            hours
        });
    };

    // 24 hours checkbox
    const handleOpen24HoursChange = (newValue) => {
        setIsOpen24Hours(newValue);
        setDisableTimePickers(newValue || isClosed);
        if (newValue) setIsClosed(false); // Uncheck the 'Closed' checkbox when 'Open 24 Hours' is checked
    };
      
    // Closed checkbox
    const handleClosedChange = (newValue) => {
        setIsClosed(newValue);
        setDisableTimePickers(newValue || isOpen24Hours); 
        if (newValue) setIsOpen24Hours(false); // Uncheck the 'Open 24 Hours' checkbox when 'Closed' is checked
    };
    
    // On modal save
    const handleSaveModal = () => {
        setHours(prevHours => {
            let newHours = { ...prevHours };
            Object.keys(selectedDays).forEach(day => {
                if (selectedDays[day]) {
                    if (isClosed) {
                        newHours[day] = { open: false, opening: null, closing: null };
                    } else {
                        newHours[day] = {
                            open: true,
                            opening: isOpen24Hours ? '00:00' : selectedOpeningTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
                            closing: isOpen24Hours ? '23:59' : selectedClosingTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
                        };
                    }
                }
            });
            return newHours;
        });
        setModalVisible(false); // Close the modal
    };
    
    // Open Modal set selected days
    const openModal = (day) => {
        if (day === 'all') {
          setSelectedDays(Object.fromEntries(days.map(d => [d, true])));
        } else if (day === 'weekdays') {
          const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          setSelectedDays(Object.fromEntries(weekdays.map(d => [d, true])));
        } else {
          setSelectedDays({ [day]: true });
        }
        setModalVisible(true);
    };

    // On click day toggle
    const toggleDaySelection = (day) => {
        setSelectedDays(prevSelectedDays => ({
          ...prevSelectedDays,
          [day]: !prevSelectedDays[day] // This toggles the boolean value for the selected day
        }));
      };

    // Changing opening time
    const handleOpeningTimeChange = (event, selectedTime) => {
        if (event.type === 'set') { // Confirms the user picked a time
            setSelectedOpeningTime(selectedTime);
        }
        setShowOpeningTimePicker(false); // This will hide the picker
    };

    // Changing closing time
    const handleClosingTimeChange = (event, selectedTime) => {
        if (event.type === 'set') { // Confirms the user picked a time
            setSelectedClosingTime(selectedTime);
        }
        setShowClosingTimePicker(false); // This will hide the picker
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.topButtonContainer}>
                    <TouchableOpacity style={[styles.topButton, {flex: 1.3, marginRight: 10}]} onPress={() => openModal('all')}><Text style={styles.topButtonText}>Change for all days</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.topButton, {flex: 1, marginLeft: 0}]} onPress={() => openModal('weekdays')}><Text style={styles.topButtonText}>Edit Mon-Fri</Text></TouchableOpacity>
                </View>
                <View>
                    {days.map((day) => (
                        <TouchableOpacity key={day} style={styles.dayContainer} onPress={() => openModal(day)}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.text}>{day}</Text>
                            </View>
                            <View style={styles.rightText}>
                                <Text style={styles.text}>{hours[day].open ? `${hours[day].opening} - ${hours[day].closing}` : "Closed"}</Text>
                                <Image style={styles.image} source={require("../../assets/edit.png")} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
            
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalWrapper}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={() => setModalVisible(false)}>
                        <Image style={{ width: 23, height: 23 }} source={require("../../assets/closeButton.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headingText}>Select Days</Text>
                    <View style={styles.allDays}>
                        {days.map(day => (
                            <TouchableOpacity
                            key={day}
                            onPress={() => toggleDaySelection(day)}
                            style={[styles.day, selectedDays[day] ? styles.selectedDay : null]}
                            >
                            <Text style={[styles.dayText, selectedDays[day] ? styles.selectedDayText : null]}>{day[0]}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 18 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'stretch', marginRight: 20 }}>
                            <Checkbox
                            value={isOpen24Hours}
                            onValueChange={handleOpen24HoursChange}
                            color={isOpen24Hours ? "#3870DD" : undefined}
                            />
                            <Text style={styles.checkboxText}>Open 24 Hours</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'stretch', marginLeft: 20 }}>
                            <Checkbox
                            value={isClosed}
                            onValueChange={handleClosedChange}
                            color={isClosed ? "#3870DD" : undefined}
                            />
                            <Text style={styles.checkboxText}>Closed</Text>
                        </View>
                    </View>
                    <View style={disableTimePickers ? { opacity: 0.3 } : null}>
                        <Text style={styles.headingText}>Pick Hours</Text>
                        <View style={styles.timePickerContainer}>
                            <TouchableOpacity 
                                onPress={() => !disableTimePickers && setShowOpeningTimePicker(true)}
                                style={styles.timeInput}
                                disabled={disableTimePickers}
                            >
                                <Text style={styles.timeText}>
                                {selectedOpeningTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </Text>
                            </TouchableOpacity>
                            <Text style={{fontFamily: 'Poppins-Medium', fontSize: 14, marginHorizontal: 20}}>to</Text>
                            <TouchableOpacity 
                                onPress={() => !disableTimePickers && setShowClosingTimePicker(true)}
                                style={styles.timeInput}
                                disabled={disableTimePickers}
                            >
                                <Text style={styles.timeText}>
                                {selectedClosingTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </Text>
                            </TouchableOpacity>

                            {showOpeningTimePicker && (
                                <DateTimePicker
                                value={selectedOpeningTime}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={handleOpeningTimeChange}
                                />
                            )}

                            {showClosingTimePicker && (
                                <DateTimePicker
                                value={selectedClosingTime}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={handleClosingTimeChange}
                                />
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveModal}
                    >
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'white' }}>Save</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
        </View>
    );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    content: {
        flex: 1
    },
    image: {
        width: 21,
        height: 21,
        marginLeft: 10
    },
    topButton: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: '#DA5C59', 
        borderColor: '#DA5C59',
    },
    topButtonContainer: {
        flexDirection: 'row',
        marginBottom: 20
    },
    topButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    headingText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        textAlign: 'center'
    },
    text:{
        fontFamily: 'Poppins-Medium',
        fontSize: 16
    },
    rightText: {
        flexDirection: 'row'
    },
    dayContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#F3F3F3",
        marginBottom: 15,
        borderRadius: 10
    },
    nextButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59', 
        borderColor: '#DA5C59', 
    },
    nextButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    modalView: {
        margin: 20,
        position: 'relative',
        width: '90%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5
    },
    allDays:{
        flexDirection: 'row',
    },
    day: {
        // Base style for unselected day
        borderWidth: 1,
        borderColor: "#D9D9D9",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    selectedDay: {
        // Additional styles for selected day
        backgroundColor: "#E9EFFD",
        borderColor: '#E9EFFD'
        // Other styles specific to selected day can go here
    },
    dayText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: "#64686B",
    },
    selectedDayText :{
        color: "#3870DD"
    },
    checkboxText: {
        fontFamily: 'Poppins-Medium',
        marginLeft: 8
    },
    saveButton: {
        backgroundColor: "#3870DD",
        borderRadius: 10,
        padding: 8,
        paddingHorizontal: 25,
        marginTop: 35,
    },
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14
    },
    timeInput: {
        borderColor: '#D9D9D9',
        borderWidth: 1,
        padding: 8,
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for the semi-transparent overlay
    },
});

export default EditHours;
