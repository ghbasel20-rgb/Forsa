import React, { useState } from 'react';
import { View } from 'react-native';
import BrandLogo from './BrandLogo';
import LanguageMenu from './LanguageMenu';

const GLOBE_RESERVED_WIDTH = 36; // globe button width + row gap

export default function HeaderBrand({ style, pointerEvents }) {
  const [rowWidth, setRowWidth] = useState(null);

  const handleLayout = (event) => {
    setRowWidth(event.nativeEvent.layout.width);
  };

  const logoMaxWidth = rowWidth != null ? Math.max(rowWidth - GLOBE_RESERVED_WIDTH, 0) : undefined;

  return (
    <View style={style} pointerEvents={pointerEvents} onLayout={handleLayout}>
      <LanguageMenu />
      <BrandLogo maxWidth={logoMaxWidth} maxWidthPercent={0.75} preserveAspectRatio="xMaxYMid meet" />
    </View>
  );
}
