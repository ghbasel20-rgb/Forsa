import React from 'react';
import { StyleSheet, Text } from 'react-native';

const WEIGHT_FONTS = {
  normal: 'Poppins_400Regular',
  '400': 'Poppins_400Regular',
  '500': 'Poppins_500Medium',
  '600': 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  '700': 'Poppins_700Bold',
};

export default function AppText({ style, ...props }) {
  const flat = StyleSheet.flatten(style) || {};
  const fontFamily = WEIGHT_FONTS[String(flat.fontWeight)] || 'Poppins_400Regular';

  return <Text style={[style, { fontFamily, fontWeight: 'normal' }]} {...props} />;
}
