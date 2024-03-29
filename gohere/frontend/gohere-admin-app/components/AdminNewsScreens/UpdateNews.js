
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,ScrollView, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { GOHERE_SERVER_URL } from '../../env.js';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import CardImage from './adminNewsCardImage.js'
import BannerImage from './adminNewsBannerImage.js'


const UpdateNewsScreen = () => {
    
    // Loading fonts
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    });

    // Use states
    const [headline, setHeadline] = useState('');
    const [newsURL, setNewsURL] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [cardImage, setCardImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeImageType, setActiveImageType] = useState(null); // 'banner' or 'card'  
    const [showUpdatePopup, setShowUpdatePopup] = useState(false); // State to manage the visibility of the successful update popup
    const navigation = useNavigation();
    const route = useRoute();
    const { itemId,currHeadline, currUrl } = route.params;

    // set headline and url to be the current headline and url before update
    if(headline===""){
        setHeadline(currHeadline)
    }
    if(newsURL===""){
        setNewsURL(currUrl)
    }

    //handling the removal of images
    const handleBannerRemoveImage = (uri) => {
        setBannerImage(null);
    };
    const handleCardRemoveImage = (uri) => {
        setCardImage(null);
    };

    //Popup to show successful update
    useEffect(() => {
        if (showUpdatePopup) {
            const timer = setTimeout(() => {
                setShowUpdatePopup(false);
            }, 1800);

            return () => clearTimeout(timer);
        }
    }, [showUpdatePopup]);

    // Image Picker logic for banner
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
        if (activeImageType === 'banner') {
            setBannerImage(pickerResult.assets[0].uri);
        } else if (activeImageType === 'card') {
            setCardImage(pickerResult.assets[0].uri);
        }
        setModalVisible(false);
        setActiveImageType(null);
    };
    
    // camera logic for banner
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
        if (activeImageType === 'banner') {
            console.log('banner');
            setBannerImage(pickerResult.assets[0].uri);
        } else if (activeImageType === 'card') {
            console.log('card');
            setCardImage(pickerResult.assets[0].uri);
        }
        setModalVisible(false);
        setActiveImageType(null);
    };

    //getting the current date in yyyy-mm-dd format
    const getCurrentDate = () => {
        const currentDate = new Date();

        // Get year, month, and day components
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Get hours, minutes, and seconds components
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        // Format date as "yyyy-mm-dd HH:MM:SS"
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDateTime;
      };

    // when back button is pressed
    const handleBackButton = () => {
        navigation.navigate('NewsList');
    }; 

    //when the 'Save Changes' button is pressed
    const handleSaveChanges = async () => {
        const formData = new FormData();

        formData.append('headline', headline);
        formData.append('newsUrl', newsURL);
        formData.append('newsDate', getCurrentDate());

        if(!cardImage){
            formData.append('images',{uri: `${GOHERE_SERVER_URL}/uploads/null.png`, name:'nullImage.png', type: 'image/png'});
            const getCurrImage = await fetch(`${GOHERE_SERVER_URL}/uploads/null.png`);
        }
        // Append card image if one has been selected
        if (cardImage) {
            formData.append('images', {
                uri: cardImage,
                name: 'card.jpg',
                type: 'image/jpeg',
            });
        }
        if(!bannerImage){
            formData.append('images',{uri: `${GOHERE_SERVER_URL}/uploads/null.png`, name:'nullImage.png', type: 'image/png'});
            const getCurrImage = await fetch(`${GOHERE_SERVER_URL}/uploads/null.png`);
        }
        // Append banner image if one has been selected
        if (bannerImage) {
            formData.append('images', {
                uri: bannerImage,
                name: 'banner.jpg',
                type: 'image/jpeg',
            });
        }

        // Send the form data to the backend
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/updateNews/${itemId}`, {
              method: 'PATCH',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (!response.ok) {
              console.log('Failed to update news');
            }
      
            // Handle the response from the backend
            const responseData = await response.json();
            console.log('News updated successfully:', responseData);
            
            //Display popup upon successful update
            setShowUpdatePopup(true);
            setTimeout(handleBackButton, 2000);

          } catch (error) {
            console.error('Error updating news:', error);
          }
      
    };

    const handleDeleteNews = async () => {
        // Show confirmation dialog
        Alert.alert(
            'Delete News',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${GOHERE_SERVER_URL}/deleteNews/${itemId}`, {
                            method: 'DELETE',
                            });
                            if (!response.ok) {
                            console.log('Failed to delete news');
                            }
                    
                            // Handle the response from the backend
                            const responseData = await response.json();
                            console.log('News deleted successfully:', responseData);
   
                            navigation.reset({
                                index: 0, 
                                routes: [{ name: 'NewsList' }], 
                              });
                        } catch (error) {
                            console.error('Error storing news:', error);
                        }
        
                    },
                },
            ],
            { cancelable: false }
        );
    }
    
    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style = {[styles.container]}>
                <View style={{flex:1}}>
                    <Text style={styles.label}>Headline<Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles2.input]}
                        defaultValue={currHeadline}
                        onChangeText={setHeadline}
                    />
                    <Text style={styles.label}>News URL<Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles2.input]}
                        defaultValue={currUrl}
                        onChangeText={setNewsURL}
                    />
                    <Text style={styles.label}>Banner Image<Text style={styles.required}>*</Text></Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                        {bannerImage ? (
                            <View style={[styles.imageContainer, { width:270, height:170 }]}>
                                <Image style={styles.image} source={{ uri: bannerImage }} />
                                <TouchableOpacity onPress={handleBannerRemoveImage} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../assets/deleteImage.png")}/>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={[styles.addImageContainer, { width:270, height:170 }]}>
                                <BannerImage newsId={itemId} givenStyle={styles2.bannerImageStyle} />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                    setActiveImageType('banner');
                                    setModalVisible(true);
                                }}>
                                    <Image style={{ width: 30, height: 30, resizeMode: 'contain',}} source={require("../../assets/edit-pencil.png")} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <Text style={styles.label}>Card Image<Text style={styles.required}>*</Text></Text>     
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                        {!cardImage && (
                            <View style={[styles.addImageContainer]}>
                                <CardImage newsId={itemId} givenStyle={styles2.cardImageStyle} />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                    setActiveImageType('card');
                                    setModalVisible(true);
                                }}>
                                    <Image style={{ width: 30, height: 30, resizeMode: 'contain'}} source={require("../../assets/edit-pencil.png")} />                                
                                </TouchableOpacity>
                            </View>
                        )}
                        {cardImage && (
                            <View style={[styles.imageContainer]}>
                                <Image style={styles.image} source={{ uri: cardImage }} />
                                <TouchableOpacity onPress={handleCardRemoveImage} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../assets/deleteImage.png")}/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View> 
                <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity style={[styles2.deleteNewsButton, {flex: 0.5, marginRight: 15}]} onPress={handleDeleteNews}>
                                <Text style={styles.AddButtonText}>Delete News</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles2.saveChangesButton, {flex: 0.5}]} onPress={handleSaveChanges}>
                                <Text style={[styles.AddButtonText, {color:'#DA5C59'}]}>Save Changes</Text>
                        </TouchableOpacity>
                </View>                               
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        setModalVisible(false);
                        setActiveImageType(null); // Reset active image type
                    }}
                    >
                        <TouchableOpacity 
                        style={styles.modalOverlay} 
                        onPressOut={() => {
                        setModalVisible(false);
                        setActiveImageType(null); // Reset active image type
                        }}>
                            <View style={[styles.modalContainer]}>
                                <TouchableOpacity onPress={openImagePickerAsync} style={{flexDirection: 'row', marginBottom: 15}}>
                                    <Image style={{width: 25, height: 25, marginRight: 15}} source={require("../../assets/media.png")} />
                                    <Text style={{ fontSize: 18, fontFamily:'Poppins-Medium'}}>Photo Library</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={openCameraAsync} style={{flexDirection: 'row', }}>
                                    <Image style={{width: 27, height: 27, marginRight: 15}} source={require("../../assets/camera.png")} />
                                    <Text style={{ fontSize: 18, fontFamily:'Poppins-Medium'}}>Take Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                </Modal>
                {/* Successful Update Popup message */}
                {showUpdatePopup && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showUpdatePopup}
                    onRequestClose={() => {
                    // This will be called when the user tries to dismiss the modal by pressing the back button on Android.
                    setShowUpdatePopup(false);
                    }}
                >
                    <View style={styles.confirmationModalOverlay}>
                        <Image
                        style={{ width: 270, height: 150, borderRadius: 15 }}
                        source={require('../../assets/updatedPopup.png')}
                        />
                    </View>
                </Modal>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    backImage:{
        width:50,
        height:50

    },

    heading_text: {
        justifyContent: 'center',
        fontSize: 32,
        color: '#DA5C59',
        textAlign: 'left',
        paddingTop: 95,
        paddingHorizontal: 80,
        bottom:50,
        fontFamily:'Poppins-Bold'
    },

    input: {
        borderWidth: 1,
        borderColor: '#5E6366',
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        borderRadius: 8,
        fontFamily: 'Poppins-Regular'
    },

    backButton: {
        position: 'absolute',
        top: 45,
        left: 10,
        zIndex: 1, 
    },

    cardImageStyle: {
        width: 115, height: 115, bottom: 0, borderRadius: 10, marginLeft: 0,
    },

    bannerImageStyle: {
        width: 270, height: 170, bottom: 0, borderRadius: 10, marginLeft: 0,
    },

    saveChangesButton: {
        padding: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: 'white', 
        borderColor: '#DA5C59',

    },

    deleteNewsButton: {
        padding: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: '#DA5C59', 
        borderColor: '#DA5C59', 
    },

    popupContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 

    },
});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 15,
      paddingTop: 10,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        marginBottom: 2
    },
    required: {
        color: 'red'
    },
    headingText: {
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
      overflow: 'hidden', 
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
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
      
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
  
  AddButton: {
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: '#DA5C59', 
      borderColor: '#DA5C59', 
    },

  AddButtonText: {
      fontSize: 16,
      color: 'white',
      fontFamily:'Poppins-Medium',
      top:2
  },
  confirmationModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for the semi-transparent overlay
},

});
  

export default UpdateNewsScreen;
