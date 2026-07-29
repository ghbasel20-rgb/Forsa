import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import BrandLogo from './BrandLogo';
import LanguageMenu from './LanguageMenu';
import NotificationBell from './NotificationBell';

const GLOBE_RESERVED_WIDTH = 36; // globe button width + row gap
const BELL_RESERVED_WIDTH = 36; // notification bell width + row gap

export default function HeaderBrand({ style, pointerEvents, showLanguageButton = true, logoLinksHome = true }) {
  const router = useRouter();
  const [rowWidth, setRowWidth] = useState(null);

  const handleLayout = (event) => {
    setRowWidth(event.nativeEvent.layout.width);
  };

  const reservedWidth = (showLanguageButton ? GLOBE_RESERVED_WIDTH : 0) + BELL_RESERVED_WIDTH;
  const logoMaxWidth = rowWidth != null ? Math.max(rowWidth - reservedWidth, 0) : undefined;

  const logo = (
    <BrandLogo maxWidth={logoMaxWidth} maxWidthPercent={0.75} preserveAspectRatio="xMaxYMid meet" />
  );

  return (
    <View style={style} pointerEvents={pointerEvents} onLayout={handleLayout}>
      {showLanguageButton && <LanguageMenu />}
      <NotificationBell />
      {logoLinksHome ? (
        <TouchableOpacity onPress={() => router.push('/Homepage')}>{logo}</TouchableOpacity>
      ) : (
        logo
      )}
    </View>
  );
}
