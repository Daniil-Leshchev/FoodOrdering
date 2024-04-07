import { ActivityIndicator, FlatList, Text } from 'react-native';

import OrderListItem from '@/src/components/OrderListItem';
import React from 'react';
import { useMyOrderList } from '@/src/api/orders';

export default function OrdersScreen() {
  const { data: orders, isLoading, error} = useMyOrderList();

  if (isLoading) {
    return <ActivityIndicator/>
  }
  if (error) {
    return <Text>Failed to fetch</Text>
  }
  return (
    <FlatList
      data={orders}
      renderItem={({item}) => <OrderListItem order={item}/>}
      contentContainerStyle={{gap: 15, padding: 15}}
    />
  )
}