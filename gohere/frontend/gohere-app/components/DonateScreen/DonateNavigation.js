import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import StripeApp from './StripeApp'
import { StripeProvider } from "@stripe/stripe-react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DonateNavigation() {
    return (
        <StripeProvider publishableKey="pk_test_51Osv0FILaeH045jx2v6duOwIm87GQaAvPdgSqFUtT1CRxrQkugMOeCubolzbfsS6rDW1Tvht1ZInSeOkYQwZL9Lb00vd1nr2dO">
            <StripeApp />
        </StripeProvider>
    );
}

