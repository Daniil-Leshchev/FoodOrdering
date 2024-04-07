import { StyleSheet, Text, View, Pressable } from 'react-native';
import Colors from '@/src/constants/Colors';
import { Order } from '../types';
import { Link, useSegments } from 'expo-router';

import dayjs from 'dayjs';
import React from 'react';
import { Tables } from '@/src/database.types';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

type OrderListItemProps = {
  order: Tables<'orders'>;
}

const OrderListItem = ({order}: OrderListItemProps) => {
  const formatDate = (date: Order["created_at"]) => dayjs(date).fromNow();
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
      <Pressable style={styles.container}>
        <View>
          <Text style={styles.title}>Order #{order.id}</Text>
          <Text style={styles.time}>{formatDate(order.created_at)}</Text>
        </View>
        <Text style={styles.status}>{order.status}</Text>
      </Pressable>
    </Link>
  )
}

export default OrderListItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },

  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10
  },

  time: {
    color: 'gray'
  },

  status: {
    fontWeight: '600'
  }
});