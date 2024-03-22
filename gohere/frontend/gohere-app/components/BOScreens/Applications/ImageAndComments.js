import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { GOHERE_SERVER_URL } from '../../../env.js';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ImageAndComments = ({ navigation, route }) => {
    const [images, setImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf')
    });
    if (!fontsLoaded && !fontError) {
        return null;
    }
    // to fetch image from backend for testing
    // const fetchImageUrl = async () => {
    //     try {
    //       const response = await fetch(`${GOHERE_SERVER_URL}/uploads`);
    //       if (!response.ok) {
    //         throw new Error('Server responded with an error.');
    //       }
    //       const data = await response.json();
    //       if (data.files && data.files.length > 0) {
    //         setDisplayedImageUrl(data.files[0]); // Display the first image as an example
    //         console.log(data.files[0]);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching image URLs:', error);
    //     }
    //   };

    //   useEffect(() => {
    //     fetchImageUrl();
    //   }, []);
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
        if (pickerResult.cancelled === true || !pickerResult.assets || !pickerResult.assets[0].uri) {
          return;
        }
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
    
        setImages(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        setModalVisible(false);
    };


    const handleConfirm = async () => {
      const formData = new FormData();
  
      // Append form data from route.params
      Object.entries(route.params).forEach(([key, value]) => {
          if (key === 'hours') {
              formData.append(key, JSON.stringify(value)); // Stringify the hours object
          } else {
              formData.append(key, value);
          }
      });
  
      formData.append('additionalDetails', additionalDetails);
  
      // Append images from the images state
      images.forEach((uri, index) => {
          formData.append('images', {
              uri,
              name: `image${index + 1}.jpg`,
              type: 'image/jpeg',
          });
      });
  
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
          console.log('No token found');
          return;
      }
  
      // Send the form data to the backend
      try {
          const response = await fetch(`${GOHERE_SERVER_URL}/businessowner/submitwashroom`, {
              method: 'POST',
              body: formData,
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`,
              },
          });
  
          if (!response.ok) {
              throw new Error('Failed to submit form');
          }
  
          // Handle the response from the backend
          const responseData = await response.json();
          console.log('Form submitted successfully:', responseData);
          setConfirmationModalVisible(true);
      } catch (error) {
          console.error('Error submitting form:', error);
      }
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
                                    <Image style={{width: 40, height: 40}} source={require("../../../assets/addImage.png")} />
                                </TouchableOpacity>
                                </View>
                            )}
                            {images.map((imageUri, index) => (
                            <View key={index} style={[styles.imageContainer, { marginRight: index < 2 ? 10 : 0 }]}>
                                <Image style={styles.image} source={{ uri: imageUri }} />
                                <TouchableOpacity onPress={() => handleRemoveImage(imageUri)} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../../assets/deleteImage.png")}/>
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
                                <Image style={{width: 25, height: 25, marginRight: 15}} source={require("../../../assets/media.png")} />
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18}}>Photo Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCameraAsync} style={{flexDirection: 'row'}}>
                                <Image style={{width: 27, height: 27, marginRight: 15}} source={require("../../../assets/camera.png")} />
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18}}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <Modal
                animationType="slide"
                transparent={true}
                visible={confirmationModalVisible}
                onRequestClose={() => {
                setConfirmationModalVisible(!confirmationModalVisible);
                }}>
                    <View style={styles.confirmationModalOverlay}>
                        <View style={{ elevation: 5, backgroundColor: '#35C28D', alignItems: 'center', borderRadius: 15, padding: 20, width: '60%' }}>
                            <Image style={{width: 100, height: 100, resizeMode: 'contain', marginBottom: 10}} source={require("../../../assets/confirm-submit.png")} />
                            <Text style={{fontFamily: 'Poppins-Bold', fontSize: 20, textAlign: 'center', color: '#fff'}}>Thank you!</Text>
                            <Text style={{fontFamily: 'Poppins-Medium', fontSize: 15, textAlign: 'center', marginBottom: 15, color: '#fff'}}>Your application has been sent successfully</Text>
                            <TouchableOpacity
                            style={{ borderWidth: 1.2, borderColor: '#fff', paddingVertical: 2, paddingHorizontal: 25, borderRadius: 15}}
                            onPress={() => {
                            setConfirmationModalVisible(!confirmationModalVisible);
                            navigation.navigate('My Applications'); // Replace with your navigation target
                            }}>
                                <Text style={{fontFamily: 'Poppins-SemiBold', color: '#fff', fontSize: 14}}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
confirmationModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for the semi-transparent overlay
},
});

export default ImageAndComments;
