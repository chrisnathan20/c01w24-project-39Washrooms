import React, { useState, useEffect } from 'react';
import { View,Text,Image} from 'react-native';
import { GOHERE_SERVER_URL } from '@env'; // Import the server URL from the .env file

const cardImage = ({ newsId }) => {

  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  // to fetch image from backend for testing
  useEffect(() => {
     fetchImageUrl = async () => {
         try {
          const response = await fetch(`${GOHERE_SERVER_URL}/newsCardImage/${newsId}`);

         if (!response.ok) {
            throw new Error('Server responded with an error.');
          }
          
          const imagePath = await response.text();

          const imageUrl = `${GOHERE_SERVER_URL}/${imagePath}`;

        setImageUri(imageUrl);
        
        } catch (error) {
           console.error('Error fetching image URLs:', error);
         }
       };

       
         fetchImageUrl();
       }, [newsId]);

       return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {error ? (
            <Text>{error}</Text>
          ) : (
            <Image source={{uri : imageUri} } style={{ width: 110, height: 110, bottom:73, borderRadius:15, marginLeft:128,}} />
          )}
        </View>
      );
};
export default cardImage
