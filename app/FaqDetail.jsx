import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BrandLogo from './components/BrandLogo';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { getFaqById } from './data/faqs';

export default function FaqDetail() {
  const { id } = useLocalSearchParams();
  const faq = getFaqById(id);

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

          <TitleText style={styles.title}>{faq ? faq.question : 'FAQ'}</TitleText>

          <Text style={styles.answer}>
            {faq ? faq.answer : "Sorry, we couldn't find this question."}
          </Text>
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  logoSlot: {
    flex: 1,
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 26,
    color: '#0a445c',
    textAlign: 'left',
    marginBottom: 24,
    lineHeight: 32,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  answer: {
    fontSize: 16,
    color: '#0a445c',
    lineHeight: 24,
  },
});
