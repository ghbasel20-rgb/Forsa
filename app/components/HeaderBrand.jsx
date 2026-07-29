import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import SettingsIcon from '../../assets/images/settings.svg';
import BrandLogo from './BrandLogo';
import LanguageMenu from './LanguageMenu';
import NotificationBell from './NotificationBell';

// Matches Homepage's flat HEADER_ICONS_RESERVED_WIDTH so the logo renders at
// the same size everywhere the icon row shows both slots.
const GLOBE_RESERVED_WIDTH = 44; // globe/settings button width + row gap
const BELL_RESERVED_WIDTH = 44; // notification bell width + row gap
const SCREEN_WIDTH = Dimensions.get('window').width;
// Every screen using HeaderBrand wraps it in a `padding: 20` container.
const CONTAINER_HORIZONTAL_PADDING = 40;

export default function HeaderBrand({
  style,
  pointerEvents,
  showLanguageButton = true,
  showNotifications = true,
  logoLinksHome = true,
  onSettingsPress,
  registerTarget,
}) {
  const router = useRouter();

  const showGlobe = showLanguageButton && !onSettingsPress;
  const reservedWidth =
    (showGlobe || onSettingsPress ? GLOBE_RESERVED_WIDTH : 0) + (showNotifications ? BELL_RESERVED_WIDTH : 0);
  // Computed analytically (rather than measured via onLayout) so the logo is
  // the correct size on the very first frame — an onLayout-based measurement
  // renders one frame too large first, which reads as the logo "jumping" on
  // every page transition.
  const logoMaxWidth = Math.max(SCREEN_WIDTH - CONTAINER_HORIZONTAL_PADDING - reservedWidth, 0);

  const logo = (
    <BrandLogo maxWidth={logoMaxWidth} maxWidthPercent={1} preserveAspectRatio="xMaxYMid meet" />
  );

  return (
    <View style={style} pointerEvents={pointerEvents}>
      {logoLinksHome ? (
        <TouchableOpacity onPress={() => router.push('/Homepage')}>{logo}</TouchableOpacity>
      ) : (
        logo
      )}
      <View style={styles.icons}>
        {onSettingsPress ? (
          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <SettingsIcon width={38} height={38} />
          </TouchableOpacity>
        ) : (
          showGlobe && <LanguageMenu />
        )}
        {showNotifications && <NotificationBell registerTarget={registerTarget} />}
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
  settingsButton: {
    padding: 4,
  },
});
