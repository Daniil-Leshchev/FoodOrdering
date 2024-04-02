import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { Link, Stack } from 'expo-router';
import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { supabase } from '@/src/lib/supabase';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithEmail() {
    setIsLoading(true);
    const { error } =
      await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert(error.message);
    setIsLoading(false);
    setEmail('');
    setPassword('');
  }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: 'Sign in'}}/>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder='jon@gmail.com'
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Button 
                onPress={signInWithEmail}
                disabled={isLoading}
                text={isLoading ? 'Signing in...' : 'Sign In'}
              />
              <Link href='/(auth)/sign-up' style={styles.textButton}>
                Create an account
              </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },

    label: {
      fontSize: 16,
      color: 'gray'
    },

    input: {
      padding: 10,
      backgroundColor: '#fff',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 20
    },

    textButton: {
      color: Colors.light.tint,
      alignSelf: 'center',
      fontWeight: 'bold',
      marginTop: 10,
    }
});

export default SignInScreen;