import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import OrderListItem from '@/src/components/OrderListItem';
import React from 'react';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import { useOrderDetails } from '@/src/api/orders';
import { useUpdateOrderSubscription } from '@/src/api/orders/subscriptions';

const OrderDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const { data: order, error, isLoading} = useOrderDetails(id);
  
  useUpdateOrderSubscription(id);
  
  if (isLoading) {
    return <ActivityIndicator/>;
  }

  if (error) {
    return <Text>Failed to fetch an order</Text>
  }
    return (
      <View style={styles.container}>
        <Stack.Screen options={{title: `Order #${id}`}}/>
        <OrderListItem order={order}/>

        <FlatList
          data={order?.order_items}
          renderItem={({ item }) => <OrderItemListItem item={item} />}
          contentContainerStyle={{ gap: 10 }}
        />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 10,
  }
})

export default OrderDetailsScreen;