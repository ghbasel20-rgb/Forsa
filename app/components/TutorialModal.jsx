import React, { useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import EventsIcon from '../../assets/images/events.svg';
import PurplePfpIcon from '../../assets/images/purplePfp.svg';
import PurpleHomeIcon from '../../assets/images/purplehome.svg';
import PurpleSearchIcon from '../../assets/images/purplesearch.svg';
import Text from './AppText';
import TitleText from './TitleText';
import { useLanguage } from '../contexts/LanguageContext';

const ICON_COLOR = '#0a445c';

const STEPS = [
  { key: 'welcome', Icon: PurpleHomeIcon, viewBox: '317.91 15.7 804.26 776.27' },
  { key: 'events', Icon: EventsIcon },
  { key: 'opportunities', Icon: PurpleSearchIcon, viewBox: '37.65 6.64 62.55 66.85' },
  { key: 'profile', Icon: PurplePfpIcon, viewBox: '15 2 29 30' },
];

export default function TutorialModal({ visible, onFinish }) {
  const { t } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(260);
  const scrollRef = useRef(null);

  const handlePageLayout = (event) => {
    const measuredHeight = event.nativeEvent.layout.height;
    setPageHeight((prev) => Math.max(prev, measuredHeight));
  };

  const isLastStep = stepIndex === STEPS.length - 1;

  const scrollToIndex = (index, animated = true) => {
    scrollRef.current?.scrollTo({ x: index * pageWidth, animated });
  };

  const goNext = () => {
    if (isLastStep) {
      finish();
    } else {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      scrollToIndex(nextIndex);
    }
  };

  const finish = () => {
    setStepIndex(0);
    scrollToIndex(0, false);
    onFinish();
  };

  const handleMomentumScrollEnd = (event) => {
    if (!pageWidth) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setStepIndex(Math.max(0, Math.min(index, STEPS.length - 1)));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={finish}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.skipButton} onPress={finish}>
            <Text style={styles.skipText}>{t('tutorial.skip')}</Text>
          </TouchableOpacity>

          <View
            style={[styles.pagerContainer, { height: pageHeight }]}
            onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
          >
            {pageWidth > 0 && (
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
              >
                {STEPS.map((step) => (
                  <View
                    key={step.key}
                    style={[styles.page, { width: pageWidth }]}
                    onLayout={handlePageLayout}
                  >
                    <View style={styles.iconCircle}>
                      <step.Icon
                        width={48}
                        height={48}
                        color={ICON_COLOR}
                        {...(step.viewBox ? { viewBox: step.viewBox } : {})}
                      />
                    </View>

                    <TitleText style={styles.title}>{t(`tutorial.${step.key}.title`)}</TitleText>
                    <Text style={styles.body}>{t(`tutorial.${step.key}.body`)}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.dots}>
            {STEPS.map((dotStep, index) => (
              <View
                key={dotStep.key}
                style={[styles.dot, index === stepIndex && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextButtonText}>
              {isLastStep ? t('tutorial.getStarted') : t('tutorial.next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  skipText: {
    fontSize: 14,
    color: '#6b8788',
  },
  pagerContainer: {
    width: '100%',
    height: 260,
  },
  page: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#e1e4e4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#0a445c',
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: '#254952',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d3dcdc',
  },
  dotActive: {
    backgroundColor: '#46a3a4',
    width: 20,
  },
  nextButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#c6a2ba',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
