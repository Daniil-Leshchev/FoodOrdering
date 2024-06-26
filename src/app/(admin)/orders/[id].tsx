import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import OrderListItem from '@/src/components/OrderListItem';
import React from 'react';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import { OrderStatusList } from '@/src/types';
import Colors from '@/src/constants/Colors';
import { useOrderDetails, useUpdateOrder } from '@/src/api/orders';
import { notifyUserAboutOrderUpdate } from '@/src/lib/notifications';

const OrderDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const { data: order, error, isLoading} = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updatedStatus = async (status: string) => {
    updateOrder({id: id, updatedFields: {status}})

    if (order) {
      await notifyUserAboutOrderUpdate({...order, status });
    }
  }

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  if (error || !order) {
    return <Text>Failed to fetch an order</Text>
  }
    return (
      <View style={styles.container}>
        <Stack.Screen options={{title: `Order #${id}`}}/>
        <OrderListItem order={order}/>
        <FlatList
          data={order.order_items}
          renderItem={({ item }) => <OrderItemListItem item={item} />}
          contentContainerStyle={{ gap: 10 }}
          // ListHeaderComponent={() => <OrderListItem order={order}/>} если так, то сам заказ будет двигаться вместе с компонентами в списке
          ListFooterComponent={() => (
          <><Text style={{ fontWeight: 'bold' }}>Status</Text>
          <View style={{ flexDirection: 'row', gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updatedStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor: order.status === status
                      ? Colors.light.tint
                      : 'transparent',
                  }}>
                  <Text
                    style={{color: order.status === status ? 'white' : Colors.light.tint}}>
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View></>
          )}  
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