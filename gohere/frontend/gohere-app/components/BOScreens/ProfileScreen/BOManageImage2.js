import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { GOHERE_SERVER_URL } from '../../../env.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BOManageImage2 = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });

    const [image, setImage] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const navigation = useNavigation();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

    // Fetching the image two depending on the Business Owner
    const fetchImage2 = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/getImageTwo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) { 
                console.log(`Response not okay: ${response.status}`);
            }

            const busImageTwo = await response.json();
            console.log("busImageTwo", busImageTwo);
            setImage(busImageTwo.image);
            

        } catch (error) {
            console.error('Error fetching image URL', error);
        }
        console.log("ya image", image);
    };

    useEffect(() => {
        fetchImage2();

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
        setSaveButtonDisabled(false);
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
        setSaveButtonDisabled(false);
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
        const getCurrImage = await fetch(`${GOHERE_SERVER_URL}/${image}`);
    
        formData.append('images', {
            uri: selectedImage,
            name: `image.${fileType}`,
            type: `image/${fileType}`,
        });
    
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/updateImageTwo`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to update image two');
            }
    
            const updatedImageTwo = await response.json();
            console.log('Updated two image:', updatedImageTwo);
    
            // Update image state after successful upload
            setImage([selectedImage]);

            // Display popup for successful update
            setShowUpdatePopup(true);

            setSaveButtonDisabled(true);


    
        } catch (error) {
            console.error('Error updating image two:', error);
        }
    };
    
    if (!fontsLoaded || fontError) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
            <Image
                source={{ uri: selectedImage || (image && image.length > 0 ? `${GOHERE_SERVER_URL}/${image}` : null) }}
                style={styles.imageTwo}
            />
            <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.editIcon}>
                <Image source={require("../../../assets/edit_circle.png")} style={{ height: 40, width: 40 }} />
            </TouchableOpacity>
            </View>
                
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
                <TouchableOpacity 
                onPress={handleSaveChanges} 
                disabled={saveButtonDisabled} 
                style={[styles.finishButton, saveButtonDisabled ? styles.disabledButton : null]}>
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
    imageTwo: {
        justifyContent: 'center',
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    editIcon: {
        position: 'absolute',
        top: 15,
        right: 10,
        zIndex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
        top: 390,
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        borderStyle: 'dashed',
    }, 
    finishButton: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#DA5C59',
        borderRadius: 10,
    },

    disabledButton: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#CCCCCC',
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

export default BOManageImage2;
