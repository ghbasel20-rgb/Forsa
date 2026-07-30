import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import HeaderBrand from './components/HeaderBrand';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { getCurrentUser } from './services/auth-service';
import { getEvents, getMatchedEvents } from './services/events-service';
import { getUserProfile } from './services/profile-service';
import { floatingCard } from './styles/shadows';

export default function EventTopMatches() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return;
    }

    const profileResult = await getUserProfile(userResult.data.$id);
    const profile = profileResult.success ? profileResult.data : null;

    const eventsResult = await getEvents();
    if (eventsResult.success) {
      const { topMatches } = getMatchedEvents(eventsResult.data, profile);
      setEvents(topMatches);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
          </View>
          <View style={styles.headerUnderline} />

          <TitleText style={styles.title}>{t('eventTopMatches.title')}</TitleText>

          <View style={styles.matchesContainer}>
            {events.map((match, index) => (
              <TouchableOpacity
                key={match.$id}
                style={styles.matchCard}
                onPress={() => router.push(`/EventDetail?id=${match.$id}`)}
              >
                <View style={styles.numberBadge}>
                  <Image
                    source={
                      match.imageUrl
                        ? { uri: match.imageUrl }
                        : require('../assets/images/icon.png')
                    }
                    style={[
                      styles.numberBadgeImage,
                      !match.imageUrl && styles.defaultIconTint,
                    ]}
                    resizeMode={match.imageUrl ? 'cover' : 'contain'}
                  />
                  <View style={styles.numberOverlay}>
                    <Text style={styles.numberText}>#{index + 1}</Text>
                  </View>
                </View>
                <Text style={styles.matchTitle} numberOfLines={1} ellipsizeMode="tail">{(language === 'ar' && match.titleAr) || match.title}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{match.matchPercentage}{t('eventTopMatches.matchSuffix')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.allEventsButton}
            onPress={() => router.push('/Events')}
          >
            <Text style={styles.allEventsText}>{t('eventTopMatches.exploreEvents')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    padding: 20,
    paddingTop: 68,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerUnderline: {
    height: 2,
    backgroundColor: '#46a3a4',
    marginBottom: 30,
  },
  logoSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    fontSize: 32,
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 52,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  matchesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  matchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...floatingCard,
  },
  numberBadge: {
    width: 60,
    height: 60,
    backgroundColor: '#46a3a4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  numberBadgeImage: {
    width: '100%',
    height: '100%',
  },
  defaultIconTint: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },
  numberOverlay: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'rgba(10, 68, 92, 0.75)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  matchTitle: {
    flex: 1,
    fontSize: 16,
    color: '#46a3a4',
    fontWeight: '500',
  },
  scoreBadge: {
    backgroundColor: '#e1e4e4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 15,
  },
  scoreText: {
    color: '#0E445C',
    fontSize: 14,
    fontWeight: '700',
  },
  allEventsButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  allEventsText: {
    color: '#46a3a4',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
