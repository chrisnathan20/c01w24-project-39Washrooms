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
    
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    });

    const [headline, setHeadline] = useState('');
    const [newsURL, setNewsURL] = useState('');
    const [bannerImage, setBannerImage] = useState([]);
    const [cardImage, setCardImage] = useState([]);
    const [bannerModalVisible, setBannerModalVisible] = useState(false);
    const [cardModalVisible, setCardModalVisible] = useState(false);    
    const [displayedImageUrl, setDisplayedImageUrl] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false); // State to manage the visibility of the successful update popup
    const navigation = useNavigation();
    const route = useRoute();
    const { itemId,currHeadline, currUrl } = route.params;
    //console.log(currHeadline);


    if(headline===""){
        setHeadline(currHeadline)
    }
    if(newsURL===""){
        setNewsURL(currUrl)
    }
    const handleBannerRemoveImage = (uri) => {
        setBannerImage(bannerImage.filter(imageUri => imageUri !== uri));
    };
    const handleCardRemoveImage = (uri) => {
        setCardImage(cardImage.filter(imageUri => imageUri !== uri));
    };

    useEffect(() => {
        if (showUpdatePopup) {
            // Set a timer to hide the popup after 3 seconds
            const timer = setTimeout(() => {
                setShowUpdatePopup(false);
            }, 1800);

            return () => clearTimeout(timer);
        }
    }, [showUpdatePopup]);

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

    const handleBackButton = () => {
        navigation.navigate('NewsList');
    }; 

    const handleGoBack = () => {
        navigation.navigate('NewsList');
    }; 

    const handleSaveChanges = async () => {
        const formData = new FormData();

        // Append form data from route.params
        /*Object.entries(route.params).forEach(([key, value]) => {
            if (key === 'hours') {
            formData.append(key, JSON.stringify(value)); // Stringify the hours object
            } else {
            formData.append(key, value);
            }
        });*/
        
        formData.append('headline', headline);
        formData.append('newsUrl', newsURL);
        formData.append('newsDate', getCurrentDate());
        console.log(getCurrentDate());

        // Append images from the images state
        console.log("Card Image length",cardImage.length)
        if(cardImage.length===0){
            formData.append('images',{uri: `${GOHERE_SERVER_URL}/uploads/null.png`, name:'nullImage.png', type: 'image/png'});
            console.log("formdata:", formData);
        }
        else{
        cardImage.forEach((uri, index) => {
            formData.append('images', {
              uri,
              name: `image${index + 1}.jpg`,
              type: 'image/jpeg',
            });
        });
        }
        //console.log(bannerImage.length);
        if(bannerImage.length===0){
            formData.append('images',{uri: `${GOHERE_SERVER_URL}/uploads/null.png`, name:'nullImage.png', type: 'image/png'});
            //console.log("formdata:", formData);
            /*const bannerResponse = await fetch(`${GOHERE_SERVER_URL}/newsBannerImage/${itemId}`);
            if (!bannerResponse.ok) {
                throw new Error('Server responded with an error.');
              }
      
              const imagePath = await bannerResponse.text();
              const imageUrl = `${GOHERE_SERVER_URL}/${imagePath}`;
              console.log(imagePath);
              setBannerImage(currentImages => [...currentImages, imageUrl]);
              console.log(bannerImage)

              //formData.append('images', bannerImage[0]);
              formData.append('images', {
                uri: imageUrl,
                //name: `image${index + 1}.jpg`,
                type: 'image/jpeg',
              });*/
        }
        else{
            console.log(bannerImage)
        bannerImage.forEach((uri, index) => {
            
            formData.append('images', {
              uri,
              name: `image${index + 1}.jpg`,
              type: 'image/jpeg',
            });
        });}
        console.log(bannerImage)
        console.log(formData);
        // Send the form data to the backend
        try {
            const response = await fetch(`${GOHERE_SERVER_URL}/updateNews/${itemId}`, {
              method: 'PATCH',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log(formData);
            if (!response.ok) {
              throw new Error('Failed to update news');
            }
      
            // Handle the response from the backend
            const responseData = await response.json();
            console.log('News updated successfully:', responseData);
            
            setShowUpdatePopup(true);
            setTimeout(handleBackButton, 2000);
            
            //setTimeout(navigation.goBack(),5000);
            
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
                            throw new Error('Failed to delete news');
                            }
                    
                            // Handle the response from the backend
                            const responseData = await response.json();
                            console.log('News deleted successfully:', responseData);
                            
                            //setTimeout(handleBackButton, 20000);
                            navigation.goBack();
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
        <ScrollView style = {[styles2.container]}>
            <TouchableOpacity onPress={handleBackButton} style={styles2.backButton}>
                <Image style={{width:50, height:50}} source={require('../../assets/backButton.png')} />
            </TouchableOpacity>
            
            <Text style={styles2.heading_text}>Edit News</Text>


            <Text style={{paddingLeft:26, paddingBottom:5, bottom:15, fontFamily:'Poppins-Medium'}}>Headline</Text>
            <TextInput
                style={[styles2.input, {bottom:15, fontFamily:'Poppins-Regular'}]}
                defaultValue={currHeadline}
                onChangeText={setHeadline}
            />
            <Text style={{paddingLeft:26, paddingBottom:5, marginTop:25, bottom:15, fontFamily:'Poppins-Medium'}}>News URL</Text>
            <TextInput
                style={[styles2.input, {bottom:15, fontFamily:'Poppins-Regular'}]}
                defaultValue={currUrl}
                onChangeText={setNewsURL}
            />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View>
                    <Text style={{paddingLeft:8, paddingBottom:5, marginTop:15, bottom: 15, fontFamily:'Poppins-Medium'}}>Banner Image</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingLeft:5}}>
                            {bannerImage.length < 1 && (
                                <View style={[styles.addImageContainer, { marginRight: 15, width:270, height:170, bottom:15, }]}>
                                <BannerImage newsId={itemId} givenStyle={styles2.bannerImageStyle} />
                                <TouchableOpacity style={{bottom:145, left:105}} onPress={() => setBannerModalVisible(true)}>
                                <Image style={{width: 30, height: 30,position:'absolute'}} source={require("../../assets/edit-pencil.png")} />

                                    
                                </TouchableOpacity>
                                </View>
                            )}
                            
                            {bannerImage.length != 0 && bannerImage.map((imageUri, index) => (
                            <View key={index} style={[styles.imageContainer, { width:270, height:170,marginRight: index < 2 ? 10 : 0 }]}>
                                <Image style={styles.image} source={{ uri: imageUri }} />
                                <TouchableOpacity onPress={() => handleBannerRemoveImage(imageUri)} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../assets/deleteImage.png")}/>
                                </TouchableOpacity>
                            </View>
                            ))}
                        </View>            
                    </View>

                    <View>
                    <Text style={{paddingLeft:8, paddingBottom:5, bottom:15, marginTop: 7, fontFamily:'Poppins-Medium'}}>Card Image</Text>
                    
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingLeft:5}}>
                            {cardImage.length < 1 && (
                                <View style={[styles.addImageContainer, { marginRight: 15, bottom:15, }]}>
                                <CardImage newsId={itemId} givenStyle={styles2.cardImageStyle} />
                                <TouchableOpacity style={{bottom:90, left:28}} onPress={() => setCardModalVisible(true)}>
                                    <Image style={{width: 30, height: 30,position:'absolute'}} source={require("../../assets/edit-pencil.png")} />
                                    
                                </TouchableOpacity>
                                </View>
                            )}
                            {cardImage.length!=0 && cardImage.map((imageUri, index) => (
                            <View key={index} style={[styles.imageContainer, { marginRight: index < 2 ? 10 : 0 }]}>
                                <Image style={styles.image} source={{ uri: imageUri }} />
                                <TouchableOpacity onPress={() => handleCardRemoveImage(imageUri)} style={styles.deleteButton}>
                                    <Image style={styles.deleteButtonIcon} source={require("../../assets/deleteImage.png")}/>
                                </TouchableOpacity>
                            </View>
                            ))}
                        </View>            
                    </View>
                    {displayedImageUrl && (
                        <Image
                        source={{ uri: displayedImageUrl }}
                        style={{ width: 115, height: 115, marginTop: 20, backgroundColor: 'red' }}
                        onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
                        />
                    )}
                </View>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={[styles2.deleteNewsButton, {left:10, width:155, top:15}]} onPress={handleDeleteNews}>
                        <Text style={styles.AddButtonText}>Delete News</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles2.saveChangesButton, {left:32, width:155, top:15}]} onPress={handleSaveChanges}>
                        <Text style={[styles.AddButtonText, {color:'#DA5C59',}]}>Save Changes</Text>
                </TouchableOpacity>

                
                </View>
                <Modal
                visible={bannerModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setBannerModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setBannerModalVisible(false)}>
                        <View style={[styles.modalContainer]}>
                            <TouchableOpacity onPress={openImagePickerAsyncB} style={{flexDirection: 'row', marginBottom: 15}}>
                                <Image style={{width: 25, height: 25, marginRight: 15}} source={require("../../assets/media.png")} />
                                <Text style={{ fontSize: 18, fontFamily:'Poppins-Medium'}}>Photo Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCameraAsyncB} style={{flexDirection: 'row', }}>
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
        {/* Successful Update Popup message */}
        {showUpdatePopup && (
                <View style={styles2.popupContainer}>
                    <Image style={{ width: 270, height: 150, borderRadius:15}} source={require('../../assets/updatedPopup.png')} />
                </View>
            )}
        </ScrollView>
    );
};

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //alignItems: 'center',
        //justifyContent: 'center'
    },
    backImage:{
        width:50,
        height:50

    },
    heading_text: {
        justifyContent: 'center',
        fontSize: 32,
        //fontWeight: 'bold',
        color: '#DA5C59',
        textAlign: 'left',
        paddingTop: 95,
        paddingHorizontal: 80,
       // paddingBottom: -30,
        bottom:50,
        fontFamily:'Poppins-Bold'
        //right:0

    },
    input: {
        width:340,
        height:40,
        paddingTop:4,
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
        zIndex: 1, // Ensure the TouchableOpacity is rendered above other components
    },
    cardImageStyle: {
        width: 115, height: 115, bottom: 0, borderRadius: 10, marginLeft: 0,
    },
    bannerImageStyle: {
        width: 270, height: 170, bottom: 0, borderRadius: 10, marginLeft: 0,
    },
    saveChangesButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: 'white', 
        borderColor: '#DA5C59',

    },
    deleteNewsButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: '#DA5C59', 
        borderColor: '#DA5C59', 
    },
    saveChangesText:{

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
        
        //borderRadius: 10
    },
});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      paddingTop: 10,
    },
    headingText: {
      //fontFamily: 'Poppins-Medium',
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
      //fontFamily: 'Poppins-Medium',
      fontSize: 16,
      color: 'white',
      fontFamily:'Poppins-Medium',
      top:2
  },
  });
  

export default UpdateNewsScreen;
