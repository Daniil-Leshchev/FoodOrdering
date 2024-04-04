import { Text, FlatList, ActivityIndicator } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import React from 'react';
import { useProductList } from '@/src/api/products';

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

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