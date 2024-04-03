import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import Button from '../components/Button';
import { Link, Redirect, Stack, router } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { supabase } from '@/src/lib/supabase';

const index = () => {
  const {session, loading, isAdmin} = useAuth();
  if (loading) {
    return <ActivityIndicator/>
  }
  //даже если мы залогинились, нас дальше будет перебрасывать на sign in
  //т.к. изначально сессия null, а мы еще не успели получить сессию из provider'а
  if (!session) {
    return <Redirect href={'/sign-in'}/>
  }

  // if (!isAdmin) {
  //   return <Redirect href={'/(user)'}/>
  // }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Stack.Screen options={{headerShown: false}}/>
      <Link href={'/(user)'} asChild>
        <Button text="User" />
      </Link>
      <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>
      <Button onPress={() => supabase.auth.signOut()} text="Sign Out" />
    </View>
  );
};

export default index;