import Button from '@/src/components/Button';
import {defaultPizzaImage} from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/src/api/products';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';

const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
  const isUpdating = !!idString;//converting falsy/truly value to boolean

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  //usemutation from api returns function called mutate
  //when we execute mutate we call mutation function
  const { data: updatingProduct } = useProduct(id);

  useEffect(() => {//если обновляем текущий продукт, то заполняем данные в полях на те, что были изначально из бд
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setName(updatingProduct.name);
    }
  }, [updatingProduct]);//отслеживаем изменения updatingProduct(dependency)

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

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    insertProduct({name, price: parseFloat(price), image: imagePath}, {//inside the state price is a string, so we need to convert it to a number
      onSuccess: () => {
        resetFields();
        router.back();
      }
    }  
  )
  };

  const onUpdate = () => {
    if (!validateInput()) {
      return;
    }
    
    updateProduct({ id, name, price: parseFloat(price), image },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        }
      }
    );
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
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
    deleteProduct(id, {onSuccess: () => {
      router.replace('/(admin)');
    }});
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

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }
  
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });

    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });
  
    if (data) {
      return data.path;
    }
  };

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