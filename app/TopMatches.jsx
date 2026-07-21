import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Logo from '../assets/images/Logo.svg';
import Text from './components/AppText';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import TitleText from './components/TitleText';
import { getCurrentUser } from './services/auth-service';
import { getAllOpportunities, getMatchedOpportunities } from './services/opportunities-service';
import { getUserProfile } from './services/profile-service';

export default function TopMatches() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return;
    }

    const profileResult = await getUserProfile(userResult.data.$id);
    const profile = profileResult.success ? profileResult.data : null;

    const opportunitiesResult = await getAllOpportunities();
    if (opportunitiesResult.success) {
      const { topMatches } = getMatchedOpportunities(opportunitiesResult.data, profile);
      setOpportunities(topMatches);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
            <View style={styles.logoContainer}>
              <Logo width={38} height={38} style={styles.logoSmall} />
              <Text style={styles.brandName}>FORSA</Text>
            </View>
          </View>

          <TitleText style={styles.title}>YOUR TOP{'\n'}MATCHES</TitleText>

          <View style={styles.matchesContainer}>
            {opportunities.map((match, index) => (
              <TouchableOpacity
                key={match.$id}
                style={styles.matchCard}
                onPress={() => router.push(`/Opportunitydetail?id=${match.$id}`)}
              >
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>#{index + 1}</Text>
                </View>
                <Text style={styles.matchTitle}>{match.title}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{match.matchPercentage}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.allOpportunitiesButton}
            onPress={() => router.push('/Allopportunities')}
          >
            <Text style={styles.allOpportunitiesText}>Explore all opportunities</Text>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoSmall: {
    width: 38,
    height: 38,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  scoreText: {
    color: '#0E445C',
    fontSize: 14,
    fontWeight: '700',
  },
  allOpportunitiesButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  allOpportunitiesText: {
    color: '#46a3a4',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});