import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import ContactIcon from '../assets/images/contact.svg';
import EventsIcon from '../assets/images/events.svg';
import Logo from '../assets/images/Logo.svg';
import PurplePfpIcon from '../assets/images/purplePfp.svg';
import PurpleSearchIcon from '../assets/images/purplesearch.svg';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import { getCurrentUser } from './services/auth-service';
import { getUserProfile } from './services/profile-service';

const successStories = [
  { id: '1', name: 'Sarah Cohen', info: 'Placed in a 3-month internship' },
  { id: '2', name: 'Omar Khalil', info: 'Landed a volunteering role' },
  { id: '3', name: 'Maya Levi', info: 'Completed a mentorship program' },
];

export default function Homepage() {
  const router = useRouter();

  const handleExploreOpportunities = async () => {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return;
    }

    const profileResult = await getUserProfile(userResult.data.$id);
    if (profileResult.success && profileResult.data.hasCompletedSkillsInterests) {
      router.push('/TopMatches');
    } else {
      router.push('/Buildprofileskills');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Logo width={38} height={38} style={styles.logoSmall} />
            <Text style={styles.brandName}>FORSA</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/Profile')}>
                <View style={styles.iconCircle}>
                  <PurplePfpIcon width={44} height={44} />
                </View>
                <View style={styles.labelPill}>
                  <Text style={styles.labelText}>your profile</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={handleExploreOpportunities}>
                <View style={styles.iconCircle}>
                  <PurpleSearchIcon width={44} height={44} />
                </View>
                <View style={styles.labelPill}>
                  <Text style={styles.labelText}>Explore opportunities</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/Events')}>
                <View style={styles.iconCircle}>
                  <EventsIcon width={44} height={44} />
                </View>
                <View style={styles.labelPill}>
                  <Text style={styles.labelText}>JOIN our events!</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/Contact')}>
                <View style={styles.iconCircle}>
                  <ContactIcon width={44} height={44} />
                </View>
                <View style={styles.labelPill}>
                  <Text style={styles.labelText}>Contact us</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>SUCCESS STORIES</Text>

          <View style={styles.storiesContainer}>
            {successStories.map((story) => (
              <View key={story.id} style={styles.storyRow}>
                <View style={styles.storyPhoto} />
                <View style={styles.storyInfo}>
                  <Text style={styles.storyName}>{story.name}</Text>
                  <Text style={styles.storyDetail}>{`#${story.info}`}</Text>
                </View>
              </View>
            ))}
          </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#0a445c',
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 30,
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
  grid: {
    gap: 20,
    marginBottom: 30,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '47%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelPill: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  labelText: {
    fontSize: 12,
    color: '#0a445c',
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#46a3a4',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
    marginBottom: 16,
  },
  storiesContainer: {
    gap: 16,
  },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storyPhoto: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#46a3a4',
  },
  storyInfo: {
    flex: 1,
  },
  storyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a445c',
  },
  storyDetail: {
    fontSize: 13,
    color: '#46a3a4',
    marginTop: 2,
  },
});
