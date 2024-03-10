import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

import products from '@/assets/data/products';

import ProductListItem from '@/src/components/ProductListItem';

export default function MenuScreen() {
  return (
    <ScrollView>
      {
        products.map((item) => {
          return <ProductListItem product={item}/>
        })
      }
    </ScrollView>
  )
}