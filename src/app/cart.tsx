import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { useCart } from '@/src/providers/CartProvider';

import React from 'react';

const CartScreen = () => {
    const { items } = useCart();
    return (
        <View>
            <Text>Cart items length: { items.length }</Text>
            {/* иначе рендерится черное на черном, не видно времени в статус баре */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
        </View>
    )
}

export default CartScreen;