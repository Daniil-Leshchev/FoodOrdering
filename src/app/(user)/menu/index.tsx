import { StyleSheet, Text, View, Image, FlatList } from 'react-native';

import products from '@/assets/data/products';

import ProductListItem from '@/src/components/ProductListItem';
import { useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import React from 'react';

export default function MenuScreen() {
  //fetching the products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      console.log(data);
    }

    fetchProducts();
  }, [])

  return (
    <FlatList
      data={products}
      renderItem={({item}) => <ProductListItem product={item}/>}
      numColumns={2}
      contentContainerStyle={{gap: 10, padding: 10}}//styles for container and rows
      columnWrapperStyle={{gap: 10}}//styles for columns
    />
  )
}