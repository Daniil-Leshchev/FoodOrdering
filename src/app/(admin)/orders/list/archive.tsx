import { FlatList } from 'react-native';

import OrderListItem from '@/src/components/OrderListItem';
import orders from '@/assets/data/orders';
import React from 'react';

export default function OrdersScreen() {
  return (
    <FlatList
      data={orders}
      renderItem={({item}) => <OrderListItem order={item}/>}
      contentContainerStyle={{gap: 15, padding: 15}}
    />
  )
}