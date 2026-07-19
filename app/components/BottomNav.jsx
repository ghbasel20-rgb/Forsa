import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import EventsIcon from '../../assets/images/events.svg';
import PurplePfpIcon from '../../assets/images/purplePfp.svg';
import PurpleHomeIcon from '../../assets/images/purplehome.svg';
import PurpleSearchIcon from '../../assets/images/purplesearch.svg';
import Text from './AppText';

const tabs = [
  { label: 'Home', route: '/Homepage', Icon: PurpleHomeIcon },
  { label: 'Profile', route: '/Profile', Icon: PurplePfpIcon },
  { label: 'Events', route: '/Events', Icon: EventsIcon },
  { label: 'Opportunities', route: '/TopMatches', Icon: PurpleSearchIcon },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {tabs.map(({ label, route, Icon }) => (
        <TouchableOpacity key={label} style={styles.tab} onPress={() => router.push(route)}>
          <Icon width={26} height={26} />
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
