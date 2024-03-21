import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import React from 'react';

const CartScreen = () => {
    return (
        <View>
            <Text>
                Cart
            </Text>
            {/* иначе рендерится черное на черном, не видно времени в статус баре */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
        </View>
    )
}

export default CartScreen;