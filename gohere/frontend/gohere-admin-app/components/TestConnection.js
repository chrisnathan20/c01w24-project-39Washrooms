import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GOHERE_SERVER_URL } from '../env.js';

const TestConnection = () => {
  const [status, setStatus] = useState('no connection to backend');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${GOHERE_SERVER_URL}/testconnection/admin`);
        console.log(response)
        const json = await response.json();
        setStatus(json);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.responseText}>{JSON.stringify(status)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  responseText: {
    fontSize: 18,
    color: '#333',
  },
});

export default TestConnection;
