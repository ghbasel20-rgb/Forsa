import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import EventsIcon from '../../assets/images/events.svg';
import PurplePfpIcon from '../../assets/images/purplePfp.svg';
import PurpleHomeIcon from '../../assets/images/purplehome.svg';
import PurpleSearchIcon from '../../assets/images/purplesearch.svg';
import Text from './AppText';

const tabs = [
  { label: 'Home', route: '/Homepage', Icon: PurpleHomeIcon, viewBox: '317.91 15.7 804.26 776.27' },
  { label: 'Profile', route: '/Profile', Icon: PurplePfpIcon, viewBox: '15 2 29 30' },
  { label: 'Events', route: '/Events', Icon: EventsIcon },
  { label: 'Opportunities', route: '/TopMatches', Icon: PurpleSearchIcon, viewBox: '37.65 6.64 62.55 66.85' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs
        .filter(({ route }) => route !== pathname)
        .map(({ label, route, Icon, viewBox }) => (
          <TouchableOpacity key={label} style={styles.tab} onPress={() => router.push(route)}>
            <Icon width={26} height={26} {...(viewBox ? { viewBox } : {})} />
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e4e4',
    paddingVertical: 10,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: '#0a445c',
    fontWeight: '600',
  },
});
