import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const WEIGHT_FONTS = {
  normal: 'Poppins_400Regular',
  '400': 'Poppins_400Regular',
  '500': 'Poppins_500Medium',
  '600': 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  '700': 'Poppins_700Bold',
};

export default function AppText({ style, ...props }) {
  const { isRTL } = useLanguage();
  const flat = StyleSheet.flatten(style) || {};
  // Poppins has no Arabic glyphs, so let Arabic text fall back to the system font.
  const fontFamily = isRTL ? undefined : WEIGHT_FONTS[String(flat.fontWeight)] || 'Poppins_400Regular';
  const textAlign = flat.textAlign ?? (isRTL ? 'right' : undefined);

  return (
    <Text
      style={[style, { fontFamily, fontWeight: 'normal', textAlign, writingDirection: isRTL ? 'rtl' : 'ltr' }]}
      {...props}
    />
  );
}
