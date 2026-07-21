import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

export default function TitleText({ style, ...props }) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        Platform.OS === 'ios' ? styles.ios : styles.android,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 1,
    flexWrap: 'wrap',
    includeFontPadding: false,
  },
  ios: {
    fontFamily: 'Horizon-Regular',
  },
  android: {
    fontFamily: 'Poppins_700Bold',
  },
});