import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
// import { ImagePicker } from 'expo'; // If using Expo


const ImageAndComments = ({ navigation, route }) => {
    const [images, setImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    });
    if (!fontsLoaded && !fontError) {
        return null;
    }

    const handleAddImage = async () => {
    // Logic to add image
    };
    const handleRemoveImage = (uri) => {
        setImages(images.filter(imageUri => imageUri !== uri));
    };

    const openImagePickerAsync = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }
    
        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
          return;
        }
        console.log(pickerResult.assets[0].uri)
        // Assuming you're storing the image URI in an array of images
        setImages(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        setModalVisible(false);
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
    
        // Assuming you're storing the image URI in an array of images
        setImages(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        setModalVisible(false);
    };


    const handleConfirm = async () => {
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View>
                        <Text style={styles.headingText}>Add Photos</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                            {images.length < 3 && (
                                <View style={[styles.addImageContainer, { marginRight: 15 }]}>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Image style={{width: 40, height: 40}} source={require("../../assets/addImage.png")} />
                                </TouchableOpacity>
                                </View>
                            )}
                            {images.map((imageUri, index) => (
                            <View key={index} style={[styles.imageContainer, { marginRight: index < 2 ? 10 : 0 }]}>
                                <Image style={styles.image} source={{ uri: imageUri }} />
                                <TouchableOpacity onPress={() => handleRemoveImage(imageUri)} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../assets/deleteImage.png")}/>
                                </TouchableOpacity>
                            </View>
                            ))}
                        </View>            
                    </View>
                    <View>
                        <Text style={styles.headingText}>Additional Details</Text>
                        <TextInput
                        multiline={true}
                        numberOfLines={6} // Adjust the number as needed
                        style={styles.input}
                        onChangeText={setAdditionalDetails}
                        value={additionalDetails}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={openImagePickerAsync} style={{flexDirection: 'row', marginBottom: 15}}>
                                <Image style={{width: 25, height: 25, marginRight: 15}} source={require("../../assets/media.png")} />
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18}}>Photo Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCameraAsync} style={{flexDirection: 'row'}}>
                                <Image style={{width: 27, height: 27, marginRight: 15}} source={require("../../assets/camera.png")} />
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18}}>Take Photo</Text>
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
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5, 
  },
  deleteButtonIcon: {
    width: 20,
    height: 20,
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
});

export default ImageAndComments;
