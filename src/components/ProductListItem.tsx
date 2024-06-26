import { StyleSheet, Text, Image, Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { Link, useSegments } from 'expo-router';
import { Tables } from '@/src/database.types';
import React from 'react';
import RemoteImage from './RemoteImage';
export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
  product: Tables<'products'>,
}

const ProductListItem = ({product}: ProductListItemProps) => {
  const segments = useSegments();//текущий путь, разделенный в список

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable style={styles.pizzaContainer}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode='contain'/>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  )
}

export default ProductListItem;

const styles = StyleSheet.create({
  pizzaContainer: {
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 20,
    flex: 1,//takes all space that is available
    maxWidth: '50%'//not more than half of the screen
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },

  title: { 
    fontSize: 18,
    fontWeight: '600',
	  marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  }
});