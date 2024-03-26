import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { GOHERE_SERVER_URL } from '../../../env.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BOManageBanner = ({ goBack }) => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    const [bannerImage, setBannerImage] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const navigation = useNavigation();

    // Fetching the specific banner image depending on Ruby Business Owner
    const fetchBanner = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/rubybusiness/getBanner`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) { 
                console.log(`Response not okay: ${response.status}`);
            }

            const bImage = await response.json();
            setBannerImage(bImage);

        } catch (error) {
            console.error('Error fetching image URL', error);
        }
    }

    useEffect(() => {
        fetchBanner();

        if (showUpdatePopup) {
            const timer = setTimeout(() => {
                setShowUpdatePopup(false);
            }, 1800);

            return () => clearTimeout(timer);
        }

    }, [showUpdatePopup]);

    const openImagePickerAsync = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true || !pickerResult.assets || !pickerResult.assets[0].uri) {
            return;
        }

        setSelectedImage(pickerResult.assets[0].uri);
        setEditModalVisible(false);
    };

    const openCameraAsync = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchCameraAsync();
        if (pickerResult.cancelled === true) {
            return;
        }

        setSelectedImage(pickerResult.assets[0].uri);
        setEditModalVisible(false);
    };

    const handleSaveChanges = async () => {
        if (!selectedImage) {
            console.log("No image selected.");
            return;
        }
    
        const formData = new FormData();
        const uriParts = selectedImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
    
        formData.append('images', {
            uri: selectedImage,
            name: `image.${fileType}`,
            type: `image/${fileType}`,
        });
    
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${GOHERE_SERVER_URL}/rubybusiness/updateBanner`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to update banner image');
            }
    
            const updatedBanner = await response.json();
            console.log('Updated banner image:', updatedBanner);
    
            // Update bannerImage state after successful upload
            setBannerImage([selectedImage]);

            // Display popup for successful update
            setShowUpdatePopup(true);


    
        } catch (error) {
            console.error('Error updating banner image:', error);
        }
    };
    
    if (!fontsLoaded || fontError) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: selectedImage || (bannerImage.length > 0 ? `${GOHERE_SERVER_URL}/${bannerImage[0]}` : null) }}
                style={styles.imageBanner}
            />
            <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.editIcon}>
                <Image source={require("../../../assets/edit_circle.png")} style={{ height: 40, width: 40 }} />
            </TouchableOpacity>

            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={openImagePickerAsync} style={styles.modalButton}>
                                <Image style={styles.modalIcon} source={require("../../../assets/media.png")} />
                                <Text style={styles.modalText}>Photo Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCameraAsync} style={styles.modalButton}>
                                <Image style={styles.modalIcon} source={require("../../../assets/camera.png")} />
                                <Text style={styles.modalText}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSaveChanges} style={styles.finishButton}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>

            {/* Successful Update Popup message */}
            {showUpdatePopup && (
                <View style={styles.popupContainer}>
                    <Image style={{ width: 270, height: 150, borderRadius:15}} source={require('../../../assets/updatedPopup.png')} />
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        marginTop: 30,
    },
    imageBanner: {
        justifyContent: 'center',
        width: 350,
        height: 200,
        borderRadius: 10,
    },
    editIcon: {
        position: 'absolute',
        top: 15,
        right: 20,
        zIndex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        elevation: 5,
        paddingBottom: 5,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalIcon: {
        width: 25,
        height: 25,
        marginRight: 15,
    },
    modalText: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
    },

    buttonContainer: {
        width: '100%',
        top: 410,
    },

    finishButton: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#DA5C59',
        borderRadius: 10,
    },

    buttonText: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        color: 'white',
        
    },

    popupContainer: {
        position: 'absolute',
        top: -10,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'rgba(0, 0, 0, 0.1)', 

    },

});

export default BOManageBanner;
