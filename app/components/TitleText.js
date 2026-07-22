import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

function hasManualLineBreak(children) {
  const text = Array.isArray(children) ? children.join('') : String(children ?? '');
  return text.includes('\n');
}

export default function TitleText({ style, children, numberOfLines, adjustsFontSizeToFit, minimumFontScale, ...props }) {
  const isStaticMultiline = hasManualLineBreak(children);

  return (
    <Text
      {...props}
      numberOfLines={numberOfLines ?? (isStaticMultiline ? 2 : undefined)}
      adjustsFontSizeToFit={adjustsFontSizeToFit ?? isStaticMultiline}
      minimumFontScale={minimumFontScale ?? 0.7}
      style={[
        styles.base,
        Platform.OS === 'ios' ? styles.ios : styles.android,
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