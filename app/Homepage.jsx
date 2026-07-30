import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import AboutIcon from '../assets/images/aboutus.svg';
import CalendarIcon from '../assets/images/calender.svg';
import QuestionIcon from '../assets/images/question.svg';
import AboutUsModal from './components/AboutUsModal';
import Text from './components/AppText';
import BottomNav from './components/BottomNav';
import HeaderBrand from './components/HeaderBrand';
import SpotlightOverlay from './components/SpotlightOverlay';
import TitleText from './components/TitleText';
import { ONBOARDING_STEPS } from './config/onboarding-config';
import { useLanguage } from './contexts/LanguageContext';
import { getCurrentUser } from './services/auth-service';
import { getEvents, scoreEventMatch } from './services/events-service';
import { getAllOpportunities, getMatchedOpportunities } from './services/opportunities-service';
import { getUserProfile, updateUserProfile } from './services/profile-service';
import { floatingCard } from './styles/shadows';


const STORY_DESCRIPTIONS = {
  1: 'Razi used the marketing skills he picked up from MEET, one of our opportunities, and was offered a job at AppsFlyer as a marketer.',
  3: 'They stayed consistent, applied, and got results.',
  4: 'Their journey shows how small steps can lead to big changes.',
};

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
  const targetRefs = useRef({});
  const scrollRef = useRef(null);
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const registerTarget = (key) => (node) => {
    if (node) targetRefs.current[key] = node;
  };

  const spotlightSteps = ONBOARDING_STEPS.map((step) => ({
    id: step.id,
    title: t(`tutorial.${step.id}.title`),
    description: t(`tutorial.${step.id}.body`),
    scrollable: Boolean(step.scrollable),
    getTarget: () => (step.target ? targetRefs.current[step.target] : null),
  }));

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
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <HeaderBrand
              style={styles.logoSlot}
              pointerEvents="box-none"
              logoLinksHome={false}
              registerTarget={registerTarget}
            />
          </View>
          <View style={styles.headerUnderline} />

          <Text style={styles.sectionTitleInline}>{t('homepage.recommendedForYou')}</Text>
          <View style={styles.recommendedRow} ref={registerTarget('opportunitiesCard')}>
            {recommendedOpportunities.length > 0 ? (
              recommendedOpportunities.map((opp) => (
                <TouchableOpacity
                  key={opp.$id}
                  style={styles.recommendedCard}
                  onPress={() => router.push(`/Opportunitydetail?id=${opp.$id}`)}
                >
                  <View style={styles.recommendedImage}>
                    <Image
                      source={
                        opp.imageUrl
                          ? { uri: opp.imageUrl }
                          : require('../assets/images/icon.png')
                      }
                      style={[
                        styles.recommendedIcon,
                        !opp.imageUrl && styles.defaultIconTint,
                      ]}
                      resizeMode={opp.imageUrl ? 'cover' : 'contain'}
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
          <View style={styles.upcomingRow} ref={registerTarget('eventsCard')}>
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
  {successStories.map((story) => (
    <TouchableOpacity
      key={story.id}
      style={styles.storyRow}
      activeOpacity={0.6}
      onPress={() => {
        setSelectedStory(story);
        setStoryModalVisible(true);
      }}
    >
      <View style={styles.storyInfo}>
        <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
          {story.name}
        </Text>
        <Text style={styles.storyDetail} numberOfLines={1} ellipsizeMode="tail">
          {`#${story.info}`}
        </Text>
      </View>
      <Text style={styles.storyChevron}>›</Text>
    </TouchableOpacity>
  ))}
</View>
        </View>
      </ScrollView>

      <TouchableOpacity
        ref={registerTarget('aboutButton')}
        style={styles.aboutButton}
        onPress={() => setAboutModalVisible(true)}
      >
        <AboutIcon width={26} height={26} viewBox="324 8 794 796" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tutorialButton}
        onPress={() => setTutorialVisible(true)}
      >
        <QuestionIcon width={26} height={26} style={{ marginLeft: 14 }} />
      </TouchableOpacity>

      <BottomNav registerTarget={registerTarget} />

{storyModalVisible && (
  <View style={styles.modalBackdrop}>
    <TouchableOpacity
      style={styles.modalTouchOutside}
      activeOpacity={1}
      onPress={() => setStoryModalVisible(false)}
    />
    <View style={styles.storyModalCard}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setStoryModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      {selectedStory && (
        <>
          <TitleText style={styles.modalTitle}>
            {selectedStory.name}
          </TitleText>
          <Text style={styles.modalText}>
            {`#${selectedStory.info}`}
          </Text>
          <Text style={styles.modalDescription}>
            {STORY_DESCRIPTIONS[selectedStory.id] ||
              'A success story from one of our users.'}
          </Text>
        </>
      )}
    </View>
  </View>
)}


      <AboutUsModal
        visible={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
      />

      <SpotlightOverlay
        visible={tutorialVisible}
        steps={spotlightSteps}
        onFinish={finishTutorial}
        scrollRef={scrollRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#e1e4e4',
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
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    padding: 20,
    paddingTop: 68,
    paddingBottom: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logoSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerUnderline: {
    height: 2,
    backgroundColor: '#46a3a4',
    marginBottom: 44,
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
    marginBottom: 18,
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
    marginBottom: 44,
  },
  recommendedCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    ...floatingCard,
  },
  recommendedImage: {
    width: '100%',
    height: 70,
    backgroundColor: '#46a3a4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  recommendedIcon: {
    width: '100%',
    height: '100%',
  },
  defaultIconTint: {
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
    gap: 20,
    marginBottom: 40,
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
    marginTop: 12,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
    marginBottom: 28,
  },
  storiesContainer: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    gap: 20,
    paddingBottom: 20,
  },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 22,
    ...floatingCard,
  },
  storyInfo: {
    flex: 1,
  },
  storyName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#254952',
  },
  storyDetail: {
    fontSize: 16,
    color: '#6b8788',
    marginTop: 6,
  },
  storyChevron: {
    fontSize: 30,
    fontWeight: '700',
    color: '#46a3a4',
  },
  modalBackdrop: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},
modalTouchOutside: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
storyModalCard: {
  width: '90%',
  maxWidth: 340,
  backgroundColor: '#ffffff',
  borderRadius: 18,
  padding: 20,
  position: 'relative',
  zIndex: 1000,
},
closeButton: {
  position: 'absolute',
  top: 12,
  right: 12,
  width: 32,
  height: 32,
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#e1e4e4',
  zIndex: 2,
},
closeButtonText: {
  fontSize: 18,
  color: '#0a445c',
  fontWeight: 'bold',
},
modalTitle: {
  fontSize: 22,
  color: '#0a445c',
  marginBottom: 10,
  marginTop: 34,
},
modalText: {
  fontSize: 16,
  color: '#6b8788',
},
modalDescription: {
  fontSize: 15,
  color: '#254952',
  marginTop: 12,
  lineHeight: 22,
},
});
