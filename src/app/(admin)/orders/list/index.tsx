import { ActivityIndicator, FlatList, Text } from 'react-native';

import OrderListItem from '@/src/components/OrderListItem';
import React, { useEffect } from 'react';
import { useAdminOrderList, useInsertOrder } from '@/src/api/orders';
import { supabase } from '@/src/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useInsertOrderSubscription } from '@/src/api/orders/subscriptions';

export default function OrdersScreen() {
  const { data: orders, isLoading, error} = useAdminOrderList({archived: false});

  useInsertOrderSubscription();

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