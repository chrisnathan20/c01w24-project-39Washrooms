import React from 'react';
import { WebView } from 'react-native-webview';

const BOPrivacyPolicy = () => {
    return <WebView source={{ uri: 'https://crohnsandcolitis.ca/Privacy-Policy/' }} style={{ flex: 1 }} />
};

export default BOPrivacyPolicy;