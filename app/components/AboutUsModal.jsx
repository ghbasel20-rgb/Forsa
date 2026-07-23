import React, { useEffect, useRef, useState } from 'react';
import { Animated, Linking, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import InstaIcon from '../../assets/images/insta.svg';
import WhatsIcon from '../../assets/images/whats.svg';
import Text from './AppText';
import TitleText from './TitleText';
import { useLanguage } from '../contexts/LanguageContext';
import { getFaqs } from '../data/faqs';

const WHATSAPP_URL = 'https://chat.whatsapp.com/EudPXkosHkY9yfcOh1fjRq';
const INSTAGRAM_URL = 'https://www.instagram.com/forsa.meet?igsh=YWVvMTZwOWl5NTN0';
const PANEL_OFFSCREEN_X = 400;
const PANEL_DURATION = 250;
const BACKDROP_DURATION = 150;

export default function AboutUsModal({ visible, onClose }) {
  const { t, language } = useLanguage();
  const FAQS = getFaqs(language);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [modalVisible, setModalVisible] = useState(visible);
  const translateX = useRef(new Animated.Value(PANEL_OFFSCREEN_X)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 0,
          duration: PANEL_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: BACKDROP_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalVisible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: PANEL_OFFSCREEN_X,
          duration: PANEL_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: BACKDROP_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => setModalVisible(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerRow}>
              <TitleText style={styles.title}>{t('aboutUs.title')}</TitleText>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>{t('aboutUs.visionHeading')}</Text>
            <Text style={styles.visionText}>{t('aboutUs.visionText')}</Text>

            <Text style={styles.sectionTitle}>{t('aboutUs.faqsHeading')}</Text>
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
                  <WhatsIcon width={30} height={30} />
                </View>
                <Text style={styles.contactLabel}>{t('aboutUs.whatsappLabel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactRow} onPress={() => openLink(INSTAGRAM_URL)}>
                <View style={styles.iconCircle}>
                  <InstaIcon width={30} height={30} />
                </View>
                <Text style={styles.contactLabel}>{t('aboutUs.instagramLabel')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 68, 92, 0.4)',
  },
  backdropTouchable: {
    flex: 1,
  },
  panel: {
    width: '82%',
    maxWidth: 360,
    backgroundColor: '#e1e4e4',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    color: '#0a445c',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  closeText: {
    fontSize: 18,
    lineHeight: 32,
    width: 32,
    textAlign: 'center',
    color: '#0a445c',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 12,
    marginTop: 16,
  },
  visionText: {
    fontSize: 14,
    color: '#0a445c',
    lineHeight: 20,
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
    paddingVertical: 14,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    color: '#0a445c',
    lineHeight: 19,
  },
  faqPlus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a445c',
  },
  faqAnswerContainer: {
    paddingBottom: 14,
    paddingRight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#0a445c',
    lineHeight: 19,
  },
  contactContainer: {
    marginTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0a445c',
    lineHeight: 21,
  },
});
