import React from 'react';
import { WebView } from 'react-native-webview';

const PrivacyPolicy = () => {
  return <WebView source={{ uri: 'https://crohnsandcolitis.ca/Privacy-Policy/' }} style={{ flex: 1 }} />
};

export default PrivacyPolicy;