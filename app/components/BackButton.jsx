import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from './AppText';

export default function BackButton({ style }) {
  const router = useRouter();

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => router.back()}>
      <Text style={styles.text}>{'< Back'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#0a445c',
  },
});
