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
import TitleText from './components/TitleText';
import { exploreOpportunities } from './services/navigation-service';

const successStories = [
  { id: '1', name: 'Sarah Cohen', info: 'Placed in a 3-month internship' },
  { id: '2', name: 'Omar Khalil', info: 'Landed a volunteering role' },
  { id: '3', name: 'Maya Levi', info: 'Completed a mentorship program' },
];

export default function Homepage() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Logo width={64} height={64} style={styles.logoSmall} />
            <Text style={styles.brandName}>FORSA</Text>
          </View>
          <View style={styles.headerUnderline} />

          <View style={styles.grid}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/Profile')}>
                <View style={styles.iconCircle}>
                  <PurplePfpIcon width={44} height={44} viewBox="15 2 29 30" />
                </View>
                <View style={styles.labelPill}>
                  <Text style={styles.labelText}>your profile</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => exploreOpportunities(router)}>
                <View style={styles.iconCircle}>
                  <PurpleSearchIcon width={44} height={44} viewBox="37.65 6.64 62.55 66.85" />
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
                  <ContactIcon width={52} height={52} viewBox="17.4 0 80.2 80.2" />
                </View>
                <View style={styles.labelPill}>
                  <TitleText style={styles.labelText}>Contact us</TitleText>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <TitleText style={styles.sectionTitle}>SUCCESS STORIES</TitleText>

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
    gap: 10,
    marginBottom: 12,
  },
  headerUnderline: {
    height: 2,
    backgroundColor: '#46a3a4',
    marginBottom: 30,
  },
  logoSmall: {
    width: 64,
    height: 64,
  },
  brandName: {
    fontSize: 28,
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
