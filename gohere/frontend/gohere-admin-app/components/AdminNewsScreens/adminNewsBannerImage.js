import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect hook
import { GOHERE_SERVER_URL } from '../../env.js';

const BannerImage = ({ newsId, givenStyle }) => {
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch image from backend
  const fetchImageUrl = async () => {
    try {
      const response = await fetch(`${GOHERE_SERVER_URL}/newsBannerImage/${newsId}`);

      const imagePath = await response.text();
      const imageUrl = `${GOHERE_SERVER_URL}/${imagePath}`;
      setImageUri(imageUrl);
    } catch (error) {
      console.error('Error fetching image URLs:', error);
      setError(error.message); // Set error state
    }
  };

  // Execute side effect when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchImageUrl(); 

    }, [newsId]) 
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <Image source={{ uri: imageUri }} style={givenStyle} />
      )}
    </View>
  );
};

export default BannerImage;
