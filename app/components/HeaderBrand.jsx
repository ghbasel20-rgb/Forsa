import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BrandLogo from './BrandLogo';
import LanguageMenu from './LanguageMenu';
import NotificationBell from './NotificationBell';

const GLOBE_RESERVED_WIDTH = 40; // globe button width + row gap
const BELL_RESERVED_WIDTH = 36; // notification bell width + row gap

export default function HeaderBrand({
  style,
  pointerEvents,
  showLanguageButton = true,
  showNotifications = true,
  logoLinksHome = true,
}) {
  const router = useRouter();
  const [rowWidth, setRowWidth] = useState(null);

  const handleLayout = (event) => {
    setRowWidth(event.nativeEvent.layout.width);
  };

  const reservedWidth =
    (showLanguageButton ? GLOBE_RESERVED_WIDTH : 0) + (showNotifications ? BELL_RESERVED_WIDTH : 0);
  const logoMaxWidth = rowWidth != null ? Math.max(rowWidth - reservedWidth, 0) : undefined;

  const logo = (
    <BrandLogo maxWidth={logoMaxWidth} maxWidthPercent={0.75} preserveAspectRatio="xMaxYMid meet" />
  );

  return (
    <View style={style} pointerEvents={pointerEvents} onLayout={handleLayout}>
      {logoLinksHome ? (
        <TouchableOpacity onPress={() => router.push('/Homepage')}>{logo}</TouchableOpacity>
      ) : (
        logo
      )}
      <View style={styles.icons}>
        {showLanguageButton && <LanguageMenu />}
        {showNotifications && <NotificationBell />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
