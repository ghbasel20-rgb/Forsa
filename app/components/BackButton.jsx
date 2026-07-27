import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from './AppText';
import { useLanguage } from '../contexts/LanguageContext';

export default function BackButton({ style }) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => router.back()}>
      <Text style={styles.text}>{t('common.back')}</Text>
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
