import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import orders from '@/assets/data/orders';
import OrderListItem from '@/src/components/OrderListItem';
import React from 'react';
import OrderItemListItem from '@/src/components/OrderItemListItem';

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const order = orders.find(o => o.id.toString() === id);
  if (!order) {
    return <Text>Order not found</Text>
  }
    return (
      <View style={styles.container}>
        <Stack.Screen options={{title: `Order #${id}`}}/>
        <OrderListItem order={order}/>

        <FlatList
          data={order.order_items}
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