import React, { useState, useEffect } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOHERE_SERVER_URL } from '../../../env.js';
import { NativeEventEmitter } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const BOManageImages = ({ navigation, route }) => {
    const [images, setImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [sponsorship, setSponsorship] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(true);
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }
    async function fetchData() {
        await getSponsorship();
        await getImages();
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData();

        }, [])
    );
    const handleRemoveImage = (uri) => {
        setImages(images.filter(imageUri => imageUri !== uri));
        setModalVisible(true);
    };

    const openImagePickerAsync = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true || !pickerResult.assets || !pickerResult.assets[0].uri) {
            return;
        }
        //setImages(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        const selectedIndex = images.findIndex(uri => uri === selectedImage);
        if (selectedIndex !== -1) {
            // Replace the image URI at the selectedIndex with the new URI
            setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[selectedIndex] = pickerResult.assets[0].uri;
                return updatedImages;
            });
        }
        setModalVisible(false);
    };

    const openCameraAsync = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchCameraAsync();
        if (pickerResult.canceled === true) {
            return;
        }
        //setImages(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        const selectedIndex = images.findIndex(uri => uri === selectedImage);
        if (selectedIndex !== -1) {
            // Replace the image URI at the selectedIndex with the new URI
            setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[selectedIndex] = pickerResult.assets[0].uri;
                return updatedImages;
            });
        }
        setModalVisible(false);
    };

    const getSponsorship = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getSponsorship`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) { //If there is an issue with the token, delete it
                console.log(`Response not okay: ${response.status}`);
                return;
            }

            const data = await response.json();
            const sponsor = data.response;
            setSponsorship(sponsor);

        } catch (error) {
            console.error("Error:" + error);
            return;
        }
    }

    const getImages = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getData`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) { //If there is an issue with the token, delete it
                console.log(`Response not okay: ${response.status}`);
                return;
            }

            const data = await response.json();
            let imageArray = [data.response.rows[0].imageOne, data.response.rows[0].imageTwo, data.response.rows[0].imageThree]
            setImages(imageArray);

        } catch (error) {
            console.error("Error:" + error);
            return;
        }

    }

    const handleEditImage = (uri) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };
    const handleSave = () => {

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headingText}>Add Photos</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>

                        {sponsorship != "silver" && images.map((uri, index) => (
                            <View key={index} style={styles.lockContainer}>
                                <Image style={styles.image} source={{ uri }} />
                                <TouchableOpacity onPress={() => handleEditImage(uri)} style={styles.editButton}>
                                    <Image style={styles.editButtonIcon} source={require("../../../assets/edit-button.png")} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {sponsorship == "silver" && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <View style={styles.lockContainer}>
                                    <React.Fragment>
                                        <Image style={styles.image} source={{ uri: images[0] }} />
                                        <TouchableOpacity onPress={() => handleEditImage(images[0])} style={styles.editButton}>
                                            <Image style={styles.editButtonIcon} source={require("../../../assets/edit-button.png")} />
                                        </TouchableOpacity>
                                    </React.Fragment>

                                </View>
                                <View style={styles.lockContainer}>
                                    <Image style={styles.lockIcon} source={require("../../../assets/bo-privacy-policy.png")} />
                                </View>
                                <View style={styles.lockContainer}>
                                    <Image style={styles.lockIcon} source={require("../../../assets/bo-privacy-policy.png")} />
                                </View>
                            </View>
                        )}

                    </View>
                    {(sponsorship == "silver" &&
                        <Text>
                            Become a <Text style={styles.gold}>GOLD</Text> sponsor to unlock all 3 slots
                        </Text>
                    )}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>


                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={openImagePickerAsync} style={{ flexDirection: 'row', marginBottom: 15 }}>
                                <Image style={{ width: 25, height: 25, marginRight: 15 }} source={require("../../../assets/media.png")} />
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18 }}>Photo Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCameraAsync} style={{ flexDirection: 'row' }}>
                                <Image style={{ width: 27, height: 27, marginRight: 15 }} source={require("../../../assets/camera.png")} />
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18 }}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 10,
    },
    headingText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        marginBottom: 2
    },
    addImageContainer: {
        width: 115,
        height: 115,
        padding: 20,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    imageContainer: {
        width: 115,
        height: 115,
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden', // Ensures the content respects the borderRadius
    },
    addImage: {
        height: 50,
        width: 50,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    editButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 5,
    },
    editButtonIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for the semi-transparent overlay
    },
    modalContainer: {
        margin: 20,
        position: 'relative',
        width: '90%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        elevation: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 10,
        marginBottom: 13,
        fontSize: 16,
        borderRadius: 8,
        textAlignVertical: 'top'
    },
    confirmButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
    },
    confirmButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
    confirmationModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for the semi-transparent overlay
    },
    lockContainer: {
        width: 108,
        height: 108,
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: "#9D9D9D",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    lockIcon: {
        //position: 'absolute',
        //alignContent: 'center',
        //justifyContent: 'center',
    },
    gold: {
        color: "#FFB628",
        fontWeight: 'bold',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    saveButton: {
        padding: 10,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#DA5C59',
        borderColor: '#DA5C59',
        height: 48

    },
    saveButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'white'
    },
});

export default BOManageImages;


