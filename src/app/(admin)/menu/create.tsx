import Button from '@/src/components/Button';
import defaultPizzaImage from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useInsertProduct } from '@/src/api/products';

const CreateProductScreen = () => {
  const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { id } = useLocalSearchParams();
  const isUpdating = !!id;//converting falsy/truly value to boolean

  const { mutate: insertProduct } = useInsertProduct();
  //usemutation from api returns function called mutate
  //when we execute mutate we call mutation function 

  const router = useRouter();

  const [errors, setErrors] = useState('');

  const resetFields = () => {
    setName('');
    setPrice('');
  };

  const validateInput = () => {
    setErrors('');
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!price) {
      setErrors('Price is required');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors('Price is not a number');
      return false;
    }
    return true;
  };

  const onCreate = () => {
    if (!validateInput()) {
      return;
    }
    console.warn('Creating product: ', name);

    insertProduct({name, price: parseFloat(price), image}, {//inside the state price is a string, so we need to convert it to a number
      onSuccess: () => {
        resetFields();
        router.back();
      }
    }  
  )
  };

  const onUpdateCreate = () => {
    if (!validateInput()) {
      return;
    }
    console.warn('Updating product: ', name);
    resetFields();
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdateCreate();
    }
    else {
      onCreate();
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onDelete = () => {
    console.warn('Delete!');
  }

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      }
    ]);
  }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: isUpdating ? "Update Product" : "Create Product"}}/>
            <Image source={{ uri: image || defaultPizzaImage}} style={styles.image}/>
            <Text onPress={pickImage} style={styles.textButton}>Select Image</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder='Name'
              style={styles.input}/>

            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder='9.99'
              style={styles.input}
              keyboardType='numeric'/>

            <Text style={styles.errors}>{ errors }</Text>
            <Button text={isUpdating ? "Update" : "Create"} onPress={onSubmit}/>
            { isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
    },

    input: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 20,
    },

    label: {
      color: 'gray',
      fontSize: 16, 
    },

    errors: {
      color: 'red',
    },

    image: {
      width: '50%',
      aspectRatio: 1,
      alignSelf: 'center',
    },

    textButton: {
      alignSelf: 'center',
      fontWeight: 'bold',
      color: Colors.light.tint,
      marginVertical: 10,
    }
});

export default CreateProductScreen;