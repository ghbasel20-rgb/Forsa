import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import AboutIcon from '../assets/images/aboutus.svg';
import EventsIcon from '../assets/images/events.svg';
import Logo from '../assets/images/logowname.svg';
import PurplePfpIcon from '../assets/images/purplePfp.svg';
import PurpleSearchIcon from '../assets/images/purplesearch.svg';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { exploreEvents, exploreOpportunities } from './services/navigation-service';

export default function Homepage() {
  const router = useRouter();
  const { t } = useLanguage();
  const successStories = t('homepage.stories');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Logo width={760} height={168} />
        </View>
        <View style={styles.headerUnderline} />

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/Profile')}>
              <View style={styles.iconCircle}>
                <PurplePfpIcon width={44} height={44} viewBox="15 2 29 30" />
              </View>
              <View style={styles.labelPill}>
                <Text style={styles.labelText}>{t('homepage.yourProfile')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={() => exploreOpportunities(router)}>
              <View style={styles.iconCircle}>
                <PurpleSearchIcon width={44} height={44} viewBox="37.65 6.64 62.55 66.85" />
              </View>
              <View style={styles.labelPill}>
                <Text style={styles.labelText}>{t('homepage.exploreOpportunities')}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridItem} onPress={() => exploreEvents(router)}>
              <View style={styles.iconCircle}>
                <EventsIcon width={44} height={44} />
              </View>
              <View style={styles.labelPill}>
                <Text style={styles.labelText}>{t('homepage.joinEvents')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/AboutUs')}>
              <View style={styles.iconCircle}>
                <AboutIcon width={48} height={48} viewBox="324 8 794 796" />
              </View>
              <View style={styles.labelPill}>
                <Text style={styles.labelText}>{t('homepage.aboutUs')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <TitleText style={styles.sectionTitle}>{t('homepage.successStories')}</TitleText>

        <View style={styles.storiesContainer}>
          {successStories.map((story, index) => (
            <View
              key={story.id}
              style={[
                styles.storyRow,
                index === successStories.length - 1 && styles.storyRowLast,
              ]}
            >
              <View style={styles.storyInfo}>
                <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">{story.name}</Text>
                <Text style={styles.storyDetail} numberOfLines={1} ellipsizeMode="tail">{`#${story.info}`}</Text>
              </View>
            </View>
          ))}
        </View>
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
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: -8,
  },
  headerUnderline: {
    height: 2,
    backgroundColor: '#46a3a4',
    marginBottom: 30,
  },
  logoSmall: {
    width: 760,
    height: 168,
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
    gap: 4,
  },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d3dcdc',
  },
  storyRowLast: {
    borderBottomWidth: 0,
  },
  storyInfo: {
    flex: 1,
  },
  storyName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#254952',
  },
  storyDetail: {
    fontSize: 13,
    color: '#6b8788',
    marginTop: 2,
  },
});
