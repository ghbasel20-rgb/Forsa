import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import AboutIcon from '../assets/images/aboutus.svg';
import CalendarIcon from '../assets/images/calender.svg';
import Logo from '../assets/images/logowname.svg';
import AboutUsModal from './components/AboutUsModal';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import TutorialModal from './components/TutorialModal';
import { useLanguage } from './contexts/LanguageContext';
import { getCurrentUser } from './services/auth-service';
import { getEvents, scoreEventMatch } from './services/events-service';
import { getAllOpportunities, getMatchedOpportunities } from './services/opportunities-service';
import { getUserProfile, updateUserProfile } from './services/profile-service';

const formatEventDay = (eventDate) => {
  const date = new Date(eventDate);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

export default function Homepage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const successStories = t('homepage.stories');
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    const userResult = await getCurrentUser();
    let profile = null;
    if (userResult.success) {
      setDisplayName(userResult.data.name || '');

      const profileResult = await getUserProfile(userResult.data.$id);
      if (profileResult.success) {
        profile = profileResult.data;
        setDisplayName(profileResult.data.fullName || userResult.data.name || '');
        setProfileId(profile.$id);
        if (!profile.hasSeenTutorial) {
          setTutorialVisible(true);
        }
      }
    }

    const [opportunitiesResult, eventsResult] = await Promise.all([
      getAllOpportunities(),
      getEvents(),
    ]);

    if (opportunitiesResult.success) {
      const { topMatches } = getMatchedOpportunities(opportunitiesResult.data, profile);
      setRecommendedOpportunities(topMatches.slice(0, 2));
    }

    if (eventsResult.success) {
      const now = new Date();
      const upcoming = eventsResult.data
        .filter((event) => event.eventDate && new Date(event.eventDate) >= now)
        .map((event) => {
          const { matchPercentage, hasRequirements } = scoreEventMatch(event, profile);
          return { ...event, isMatch: hasRequirements && matchPercentage > 0 };
        })
        .sort((a, b) => {
          if (a.isMatch !== b.isMatch) return a.isMatch ? -1 : 1;
          return new Date(a.eventDate) - new Date(b.eventDate);
        })
        .slice(0, 3);
      setUpcomingEvents(upcoming);
    }
  };

  const finishTutorial = () => {
    setTutorialVisible(false);
    if (profileId) {
      updateUserProfile(profileId, { hasSeenTutorial: true });
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Logo width={760} height={168} />
          </View>
          <View style={styles.headerUnderline} />

          <Text style={styles.sectionTitleInline}>{t('homepage.recommendedForYou')}</Text>
          <View style={styles.recommendedRow}>
            {recommendedOpportunities.length > 0 ? (
              recommendedOpportunities.map((opp) => (
                <TouchableOpacity
                  key={opp.$id}
                  style={styles.recommendedCard}
                  onPress={() => router.push(`/Opportunitydetail?id=${opp.$id}`)}
                >
                  <View style={styles.recommendedImage}>
                    <Image
                      source={require('../assets/images/icon.png')}
                      style={styles.recommendedIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.recommendedTitle} numberOfLines={1} ellipsizeMode="tail">
                    {(language === 'ar' && opp.titleAr) || opp.title}
                  </Text>
                  <View style={styles.readMoreButton}>
                    <Text style={styles.readMoreText}>{t('homepage.readMore')}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>{t('homepage.noRecommendations')}</Text>
            )}
          </View>

          <Text style={styles.sectionTitleInline}>{t('homepage.upcomingEvents')}</Text>
          <View style={styles.upcomingRow}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <TouchableOpacity
                  key={event.$id}
                  style={styles.upcomingCard}
                  onPress={() => router.push(`/EventDetail?id=${event.$id}`)}
                >
                  <View style={styles.calendarIconWrapper}>
                    <CalendarIcon width={56} height={57} />
                    <Text style={styles.calendarDateText}>{formatEventDay(event.eventDate)}</Text>
                  </View>
                  <Text style={styles.upcomingEventTitle} numberOfLines={1} ellipsizeMode="tail">
                    {(language === 'ar' && event.titleAr) || event.title}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>{t('homepage.noUpcomingEvents')}</Text>
            )}
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

      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => setAboutModalVisible(true)}
      >
        <AboutIcon width={26} height={26} viewBox="324 8 794 796" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tutorialButton}
        onPress={() => setTutorialVisible(true)}
      >
        <Text style={styles.tutorialButtonText}>?</Text>
      </TouchableOpacity>

      <BottomNav />

      <AboutUsModal
        visible={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
      />

      <TutorialModal visible={tutorialVisible} onFinish={finishTutorial} />
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
  aboutButton: {
    position: 'absolute',
    right: 12,
    bottom: 90,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  tutorialButton: {
    position: 'absolute',
    left: 12,
    bottom: 90,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  tutorialButtonText: {
    color: '#c6389a',
    fontSize: 26,
    fontWeight: '700',
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
  greeting: {
    fontSize: 20,
    color: '#46a3a4',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitleInline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#46a3a4',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  recommendedRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  recommendedCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },
  recommendedImage: {
    width: '100%',
    height: 70,
    backgroundColor: '#46a3a4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendedIcon: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },
  recommendedTitle: {
    fontSize: 14,
    color: '#46a3a4',
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  readMoreButton: {
    backgroundColor: '#e1e4e4',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#0a445c',
    fontSize: 12,
  },
  upcomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  upcomingCard: {
    alignItems: 'center',
    width: 84,
  },
  calendarIconWrapper: {
    width: 56,
    height: 57,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarDateText: {
    position: 'absolute',
    top: 22,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#c6a2ba',
  },
  upcomingEventTitle: {
    fontSize: 13,
    color: '#46a3a4',
    fontWeight: '500',
    textAlign: 'center',
  },
  logoSmall: {
    width: 760,
    height: 168,
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
