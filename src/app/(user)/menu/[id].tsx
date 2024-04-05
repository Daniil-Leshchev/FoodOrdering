import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import { useState } from 'react';
import Button from '@/src/components/Button';
import { useCart } from '@/src/providers/CartProvider';
import { PizzaSize } from '@/src/types';
import React from 'react';
import { useProduct } from '@/src/api/products';

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();//should be the same as the name of file in []\
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const {data: product, error, isLoading} = useProduct(id);
  const { addItem } = useCart();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push('/cart');
  }

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  if (error) {
    return <Text>Failed to fetch a product</Text>;
  }
    return (
      <View style={styles.container}>
        <Stack.Screen options={{title: product.name}}/>
        <Image source={{ uri: product.image || defaultPizzaImage}} style={styles.image}/>
        
        <Text>Select size</Text>
        <View style={styles.sizes}>
          {sizes.map(size => (
            <Pressable
            onPress={() => { setSelectedSize(size) }}
            style={[
              styles.size, 
              { backgroundColor: selectedSize === size ? 'gainsboro' : '#fff' }]}
              key={size}>
              <Text style={[styles.sizeText, { color: selectedSize === size ? '#000' : 'grey' }]}>{size}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.price}>${product.price}</Text>
        <Button onPress={addToCart} text="Add To Cart"></Button>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  }
})

export default ProductDetailsScreen;