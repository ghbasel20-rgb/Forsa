import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TopMatches() {
  const router = useRouter();

  const topMatches = [
    { id: 1, number: '#1', title: 'Opportunity' },
    { id: 2, number: '#2', title: 'Opportunity' },
    { id: 3, number: '#3', title: 'Opportunity' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/Logo.png')}
              style={styles.logoSmall}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>FORSA</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/Profile')}>
            <Image
              source={require('../assets/images/home-icon.png')}
              style={styles.homeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>YOUR TOP{'\n'}MATCHES</Text>

        <View style={styles.matchesContainer}>
          {topMatches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{match.number}</Text>
              </View>
              <Text style={styles.matchTitle}>{match.title}</Text>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => router.push('/OpportunityDetail')}
              >
                <Text style={styles.readMoreText}>Read more</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/OtherMatches')}
        >
          <Text style={styles.exploreButtonText}>Explore Other matches</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.allOpportunitiesButton}
          onPress={() => router.push('/Allopportunities')}
        >
          <Text style={styles.allOpportunitiesText}>Explore all opportunities</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    width: 30,
    height: 30,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
  },
  homeIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 42,
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
  readMoreButton: {
    backgroundColor: '#e1e4e4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  readMoreText: {
    color: '#0a445c',
    fontSize: 12,
  },
  exploreButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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