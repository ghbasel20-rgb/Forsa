import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

function hasManualLineBreak(children) {
  const text = Array.isArray(children) ? children.join('') : String(children ?? '');
  return text.includes('\n');
}

export default function TitleText({ style, children, numberOfLines, adjustsFontSizeToFit, minimumFontScale, ...props }) {
  const { isRTL } = useLanguage();
  const isStaticMultiline = hasManualLineBreak(children);
  const flat = StyleSheet.flatten(style) || {};
  const textAlign = flat.textAlign ?? (isRTL ? 'right' : undefined);

  return (
    <Text
      {...props}
      numberOfLines={numberOfLines ?? (isStaticMultiline ? 2 : undefined)}
      adjustsFontSizeToFit={adjustsFontSizeToFit ?? isStaticMultiline}
      minimumFontScale={minimumFontScale ?? 0.7}
      style={[
        styles.base,
        // Horizon/Poppins have no Arabic glyphs, so let Arabic fall back to the system font.
        isRTL ? null : Platform.OS === 'ios' ? styles.ios : styles.android,
        { textAlign, writingDirection: isRTL ? 'rtl' : 'ltr' },
        style,
      ]}
    >
      {children}
    </Text>
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