import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import InstaIcon from '../assets/images/insta.svg';
import BrandLogo from './components/BrandLogo';
import WhatsIcon from '../assets/images/whats.svg';
import Text from './components/AppText';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import TitleText from './components/TitleText';
import { FAQS } from './data/faqs';

const WHATSAPP_URL = 'https://chat.whatsapp.com/EudPXkosHkY9yfcOh1fjRq';
const INSTAGRAM_URL = 'https://www.instagram.com/forsa.meet?igsh=YWVvMTZwOWl5NTN0';

export default function AboutUs() {
  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaqId((current) => (current === id ? null : id));
  };

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
            <View style={styles.logoSlot} pointerEvents="none">
              <BrandLogo maxWidthPercent={0.75} preserveAspectRatio="xMaxYMid meet" />
            </View>
          </View>

          <TitleText style={styles.title}>ABOUT US</TitleText>

          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.visionText}>
            Forsa envisions a world were Arab 48 Palestinians do not feel restricted when pursuing a future in the country
          </Text>

          <Text style={styles.sectionTitle}>FAQS</Text>
          <View style={styles.faqContainer}>
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity style={styles.faqRow} onPress={() => toggleFaq(faq.id)}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Text style={styles.faqPlus}>{isOpen ? '−' : '+'}</Text>
                  </TouchableOpacity>
                  {isOpen && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.contactContainer}>
            <TouchableOpacity style={styles.contactRow} onPress={() => openLink(WHATSAPP_URL)}>
              <View style={styles.iconCircle}>
                <WhatsIcon width={36} height={36} />
              </View>
              <Text style={styles.contactLabel}>Join our whatspp comunity</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={() => openLink(INSTAGRAM_URL)}>
              <View style={styles.iconCircle}>
                <InstaIcon width={36} height={36} />
              </View>
              <Text style={styles.contactLabel}>Follow us on instagram</Text>
            </TouchableOpacity>
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
    fontSize: 32,
    color: '#0a445c',
    textAlign: 'left',
    marginBottom: 24,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 12,
    marginTop: 20,
  },
  visionText: {
    fontSize: 15,
    color: '#0a445c',
    lineHeight: 22,
  },
  faqContainer: {
    marginBottom: 10,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#46a3a4',
  },
  faqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    color: '#0a445c',
    lineHeight: 20,
  },
  faqPlus: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0a445c',
  },
  faqAnswerContainer: {
    paddingBottom: 16,
    paddingRight: 28,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#0a445c',
    lineHeight: 20,
  },
  contactContainer: {
    marginTop: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    lineHeight: 23,
  },
});
