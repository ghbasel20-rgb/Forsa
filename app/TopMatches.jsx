import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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
import { getAllOpportunities, getMatchedOpportunities } from './services/opportunities-service';
import { getUserProfile } from './services/profile-service';

export default function TopMatches() {
  const router = useRouter();
  const { t } = useLanguage();
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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
          </View>

          <TitleText style={styles.title}>{t('topMatches.title')}</TitleText>

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
                <Text style={styles.matchTitle} numberOfLines={1} ellipsizeMode="tail">{match.title}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{match.matchPercentage}{t('topMatches.matchSuffix')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.allOpportunitiesButton}
            onPress={() => router.push('/Allopportunities')}
          >
            <Text style={styles.allOpportunitiesText}>{t('topMatches.exploreOpportunities')}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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