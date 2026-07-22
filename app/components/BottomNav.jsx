import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import EventsIcon from '../../assets/images/events.svg';
import PurplePfpIcon from '../../assets/images/purplePfp.svg';
import PurpleHomeIcon from '../../assets/images/purplehome.svg';
import PurpleSearchIcon from '../../assets/images/purplesearch.svg';
import Text from './AppText';
import { useLanguage } from '../contexts/LanguageContext';
import { exploreEvents, exploreOpportunities } from '../services/navigation-service';

const tabs = [
  { key: 'home', route: '/Homepage', Icon: PurpleHomeIcon, viewBox: '317.91 15.7 804.26 776.27' },
  { key: 'profile', route: '/Profile', Icon: PurplePfpIcon, viewBox: '15 2 29 30' },
  { key: 'events', route: '/EventTopMatches', Icon: EventsIcon, onPress: exploreEvents },
  { key: 'opportunities', route: '/TopMatches', Icon: PurpleSearchIcon, viewBox: '37.65 6.64 62.55 66.85', onPress: exploreOpportunities },
];

export default function BottomNav() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {tabs.map(({ key, route, Icon, viewBox, onPress }) => (
        <TouchableOpacity
          key={key}
          style={styles.tab}
          onPress={() => (onPress ? onPress(router) : router.push(route))}
        >
          <Icon width={26} height={26} {...(viewBox ? { viewBox } : {})} />
          <Text style={styles.label}>{t(`nav.${key}`)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0E445C',
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
    color: '#ffffff',
    fontWeight: '600',
  },
});
