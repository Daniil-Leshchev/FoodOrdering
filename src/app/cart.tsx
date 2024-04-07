import { View, Text, Platform, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '@/src/providers/CartProvider';

import React from 'react';
import CartListItem from '../components/CartListItem';
import Button from '../components/Button';

const CartScreen = () => {
    const { items, total, checkout } = useCart();
    return (
        <View style={{ padding: 10 }}>
            <FlatList data={items}
            renderItem={({item}) => <CartListItem cartItem={item}/>}
            contentContainerStyle={{ gap: 10 }}/>
            {/* иначе рендерится черное на черном, не видно времени в статус баре */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
            <Text style={{ marginTop: 20, fontSize: 20, fontWeight: '500'}}>Total: ${total.toFixed(2)}</Text>
            <Button onPress={checkout} text='Checkout'/>
        </View>
    )
}

export default CartScreen;