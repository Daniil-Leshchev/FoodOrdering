import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text } from 'react-native';

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();//should be the same as the name of file in []
    return (
      <View>
        <Stack.Screen options={{title: 'Details'}}/>
        <Text>ProductDetailsScreen for id: {id}</Text>
      </View>
  )
}

export default ProductDetailsScreen;