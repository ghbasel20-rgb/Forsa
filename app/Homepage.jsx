import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import Logo from '../assets/images/logowname.svg';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';

export default function Homepage() {
  const { t } = useLanguage();
  const successStories = t('homepage.stories');

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Logo width={760} height={168} />
          </View>
          <View style={styles.headerUnderline} />

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
