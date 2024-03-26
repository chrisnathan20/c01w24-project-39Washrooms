import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,ScrollView, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { GOHERE_SERVER_URL } from '../../env.js';
import { useNavigation } from '@react-navigation/native';


const AddNews = () => {
    
    //use states
    const [headline, setHeadline] = useState('');
    const [newsURL, setNewsURL] = useState('');
    const [bannerImage, setBannerImage] = useState([]);
    const [cardImage, setCardImage] = useState([]);
    const [bannerModalVisible, setBannerModalVisible] = useState(false);
    const [cardModalVisible, setCardModalVisible] = useState(false);    
    const [headlineError, setHeadlineError] = useState("");
    const [urlError, setUrlError] = useState("");
    const [bannerError, setBannerError] = useState("");
    const [cardError, setCardError] = useState("");
    const [showAddPopup, setShowAddPopup] = useState(false); // State to manage the visibility of the successful add popup

    const navigation = useNavigation();

    //load fonts
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    });

    //handle removal of images
    const handleBannerRemoveImage = (uri) => {
        setBannerImage(bannerImage.filter(imageUri => imageUri !== uri));
    };
    const handleCardRemoveImage = (uri) => {
        setCardImage(cardImage.filter(imageUri => imageUri !== uri));
    };

    //show popup for a successful add
    useEffect(() => {
        if (showAddPopup) {
            const timer = setTimeout(() => {
                setShowAddPopup(false);
            }, 1800);

            return () => clearTimeout(timer);
        }
    }, [showAddPopup]);

    //Image picker logic for banner
    const openImagePickerAsyncB = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }
    
        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true || !pickerResult.assets || !pickerResult.assets[0].uri) {
          return;
        }
        setBannerImage(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        setBannerModalVisible(false);
    };
    
    //Camera logic for banner
    const openCameraAsyncB = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert('Permission to access camera is required!');
          return;
        }
    
        const pickerResult = await ImagePicker.launchCameraAsync();
        if (pickerResult.canceled === true) {
          return;
        }
    
        setBannerImage(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        setBannerModalVisible(false);
    };

    //Image picker logic for card image
    const openImagePickerAsyncC = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }
    
        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true || !pickerResult.assets || !pickerResult.assets[0].uri) {
          return;
        }
        setCardImage(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        setCardModalVisible(false);
    };
    
    //Camera logic for card image
    const openCameraAsyncC = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert('Permission to access camera is required!');
          return;
        }
    
        const pickerResult = await ImagePicker.launchCameraAsync();
        if (pickerResult.canceled === true) {
          return;
        }
    
        setCardImage(currentImages => [...currentImages, pickerResult.assets[0].uri]);
        setCardModalVisible(false);
    };

    //getting current date in yyyy-mm-dd format
    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

    //when the back button is pressed  
    const handleBackButton = () => {
        navigation.navigate('NewsList');
    }; 

    //checking if all text and image fields are inputted
    const handleCheckFields = async ()=> {
        var allFields = false;
        resetErrorMessage();
       
        if(headline != "" && newsURL != "" && bannerImage.length !=0 && cardImage.length != 0){
            allFields=true;
        }

        else{

            if (headline == "") {
                setHeadlineError("Field required");

            } 

            if (newsURL == "") {
                setUrlError("Field required");

            }
            
            if (bannerImage.length == 0) {
                setBannerError("Field required");

            }

            if (cardImage.length == 0) {
                setCardError("Field required");

            }
        }

        if (allFields) {
            resetErrorMessage();
            handleAdd();            //if all fields are inputted then handleAdd is called for adding to databse
        }
    };

    //resetting all the field check error messages
    const resetErrorMessage = () => {
        setHeadlineError("");
        setUrlError("");
        setBannerError("");
        setCardError("");
    }

    //logic for when the Add News button is pressed
    const handleAdd = async () => {
        
        const formData = new FormData();

        formData.append('headline', headline);
        formData.append('newsUrl', newsURL);
        formData.append('newsDate', getCurrentDate());

        //Add the card image to formData
        cardImage.forEach((uri, index) => {
            formData.append('images', {
              uri,
              name: `image${index + 1}.jpg`,
              type: 'image/jpeg',
            });
        });

        //Add the banner image to formData
        bannerImage.forEach((uri, index) => {
            formData.append('images', {
              uri,
              name: `image${index + 1}.jpg`,
              type: 'image/jpeg',
            });
        });

        // Send the form data to the backend
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/storeNews`, {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            
            if (!response.ok) {
              console.log('Failed to store news');
            }
      
            // Handle the response from the backend
            const responseData = await response.json();
            console.log('News stored successfully:', responseData);

            //Showing the Successful Add popup
            setShowAddPopup(true);
            setTimeout(handleBackButton, 2000);

          } catch (error) {
            console.error('Error storing news:', error);
          }
        
      
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ScrollView style = {[styles2.container]}>
            <TouchableOpacity onPress={handleBackButton} style={styles2.backButton}>
                <Image style={{width:50, height:50}} source={require('../../assets/backButton.png')} />
            </TouchableOpacity>
            
            <Text style={styles2.heading_text}>Add News</Text>


            <Text style={{paddingLeft:26, paddingBottom:5, bottom:15, fontFamily:'Poppins-Medium'}}>Headline</Text>
            <TextInput
                style={[styles2.input, {bottom:15, fontFamily:'Poppins-Regular'}]}
                placeholder="Enter headline"
                value={headline}
                onChangeText={setHeadline}
            />
            <Text style={[styles2.errorText, {left:28, bottom:10, fontFamily:'Poppins-Regular'}]}>{headlineError}</Text>
            <Text style={{paddingLeft:26, paddingBottom:5, marginTop:10, bottom:15, fontFamily:'Poppins-Medium'}}>News URL</Text>
            <TextInput
                style={[styles2.input, {bottom:15,fontFamily:'Poppins-Regular' }]}
                placeholder="Enter news URL"
                value={newsURL}
                onChangeText={setNewsURL}
            />
            <Text style={[styles2.errorText, {left:28, bottom:10,fontFamily:'Poppins-Regular'}]}>{urlError}</Text>


            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View>
                    <Text style={{paddingLeft:8, paddingBottom:5, marginTop:0, bottom: 15, fontFamily:'Poppins-Medium'}}>Banner Image</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingLeft:5}}>
                            {bannerImage.length < 1 && (
                                <View style={[styles.addImageContainer, { marginRight: 15, width:270, height:170, bottom:15 }]}>
                                <TouchableOpacity onPress={() => setBannerModalVisible(true)}>
                                    <Image style={{width: 40, height: 40}} source={require("../../assets/addImage.png")} />
                                </TouchableOpacity>
                                
                                </View>
                
                            )}
                            <Text style={[styles2.errorText, {right:248, top:160, position:'absolute', fontFamily:'Poppins-Regular'}]}>{bannerError}</Text>
                            {bannerImage.length!=0 && bannerImage.map((imageUri, index) => (
                            <View key={index} style={[styles.imageContainer,  { marginRight: 15, width:270, height:170, bottom:15 }]}>
                                <Image style={styles.image} source={{ uri: imageUri }} />
                                <TouchableOpacity onPress={() => handleBannerRemoveImage(imageUri)} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../assets/deleteImage.png")}/>
                                </TouchableOpacity>
                            </View>
                            ))}
                        </View>            
                    </View>

                    <View>
                    <Text style={{paddingLeft:8, paddingBottom:5,marginTop:25, bottom:15, fontFamily:'Poppins-Medium'}}>Card Image</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingLeft:5}}>
                            {cardImage.length < 1 && (
                                <View style={[styles.addImageContainer, { marginRight: 15, bottom:15 }]}>
                                <TouchableOpacity onPress={() => setCardModalVisible(true)}>
                                    <Image style={{width: 40, height: 40}} source={require("../../assets/addImage.png")} />
                                </TouchableOpacity>
                                
                                </View>
                            )}
                            <Text style={[styles2.errorText, {right:248, top:104, position:'absolute', fontFamily:'Poppins-Regular'}]}>{cardError}</Text>
                            {cardImage.length!=0 && cardImage.map((imageUri, index) => (
                            <View key={index} style={[styles.imageContainer, { marginRight: 15, bottom:15 }]}>
                                <Image style={styles.image} source={{ uri: imageUri }} />
                                <TouchableOpacity onPress={() => handleCardRemoveImage(imageUri)} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../assets/deleteImage.png")}/>
                                </TouchableOpacity>
                            </View>
                            ))}
                        </View>            
                    </View>
                </View>
                <TouchableOpacity style={styles.AddButton} onPress={handleCheckFields}>
                        <Text style={styles.AddButtonText}>Add News</Text>
                        
                </TouchableOpacity>
                <Modal
                visible={bannerModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setBannerModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setBannerModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={openImagePickerAsyncB} style={{flexDirection: 'row', marginBottom: 15}}>
                                <Image style={{width: 25, height: 25, marginRight: 15}} source={require("../../assets/media.png")} />
                                <Text style={{ fontSize: 18, fontFamily:'Poppins-Medium'}}>Photo Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCameraAsyncB} style={{flexDirection: 'row'}}>
                                <Image style={{width: 27, height: 27, marginRight: 15}} source={require("../../assets/camera.png")} />
                                <Text style={{ fontSize: 18, fontFamily:'Poppins-Medium'}}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <Modal
                visible={cardModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCardModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setCardModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={openImagePickerAsyncC} style={{flexDirection: 'row', marginBottom: 15}}>
                                <Image style={{width: 25, height: 25, marginRight: 15}} source={require("../../assets/media.png")} />
                                <Text style={{ fontSize: 18, fontFamily:'Poppins-Medium'}}>Photo Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCameraAsyncC} style={{flexDirection: 'row'}}>
                                <Image style={{width: 27, height: 27, marginRight: 15}} source={require("../../assets/camera.png")} />
                                <Text style={{ fontSize: 18, fontFamily:'Poppins-Medium'}}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </TouchableWithoutFeedback>

        {/* Successful Add Popup message */}
        {showAddPopup && (
                <View style={styles2.popupContainer}>
                    <Image style={{ width: 270, height: 150, borderRadius:15}} source={require('../../assets/addedPopup.png')} />
                </View>
        )}
        </ScrollView>
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
        fontFamily:'Poppins-Bold',
        bottom:50
    },

    input: {
        width:340,
        height:40,
        paddingTop:2,
        paddingLeft:10,
        borderColor:'black',
        borderWidth:1,
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:25
    },

    backButton: {
        position: 'absolute',
        top: 45,
        left: 10,
        zIndex: 1, 
    },

    errorText: {
        color: 'red',
        marginBottom: 15
    },

    popupContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    }
});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      paddingTop: 10,
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
      fontFamily:'Poppins-Medium'
  },
});
  

export default AddNews;
