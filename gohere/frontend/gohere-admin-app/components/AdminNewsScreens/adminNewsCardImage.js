import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { GOHERE_SERVER_URL } from '../../env.js';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const CardImage = ({ newsId, givenStyle }) => {
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  // Use useFocusEffect to fetch image when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchImageUrl = async () => {
        try {
          const response = await fetch(`${GOHERE_SERVER_URL}/newsCardImage/${newsId}`);

          if (!response.ok) {
            console.log('Server responded with an error.');
          }
          
          const imagePath = await response.text();

          const imageUrl = `${GOHERE_SERVER_URL}/${imagePath}`;
          setImageUri(imageUrl);
        } catch (error) {
          console.error('Error fetching image URLs:', error);
          setError(error.message);
        }
      };

      fetchImageUrl(); 
    }, [newsId]) 
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <Image source={{ uri: imageUri }} style={givenStyle}/>
      )}
    </View>
  );
};

export default CardImage;
