import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import BrandLogo from './components/BrandLogo';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { getCurrentUser } from './services/auth-service';
import { getEvents, getMatchedEvents } from './services/events-service';
import { getUserProfile } from './services/profile-service';

export default function EventTopMatches() {
  const router = useRouter();
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
            <View style={styles.logoSlot}>
              <BrandLogo maxWidthPercent={0.75} preserveAspectRatio="xMaxYMid meet" />
            </View>
          </View>

          <TitleText style={styles.title}>YOUR TOP{'\n'}EVENT MATCHES</TitleText>

          <View style={styles.matchesContainer}>
            {events.map((match, index) => (
              <TouchableOpacity
                key={match.$id}
                style={styles.matchCard}
                onPress={() => router.push(`/EventDetail?id=${match.$id}`)}
              >
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>#{index + 1}</Text>
                </View>
                <Text style={styles.matchTitle} numberOfLines={1} ellipsizeMode="tail">{match.title}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{match.matchPercentage}% Match</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.allEventsButton}
            onPress={() => router.push('/Events')}
          >
            <Text style={styles.allEventsText}>Explore all events</Text>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    padding: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoSlot: {
    flex: 1,
    marginLeft: 12,
    alignItems: 'flex-end',
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
  },
  numberBadge: {
    width: 60,
    height: 60,
    backgroundColor: '#46a3a4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 24,
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
