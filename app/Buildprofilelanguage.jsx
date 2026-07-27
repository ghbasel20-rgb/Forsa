import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HeaderBrand from './components/HeaderBrand';
import Text from './components/AppText';
import BackButton from './components/BackButton';
import { useLanguage } from './contexts/LanguageContext';
import { LANGUAGES } from './services/language-service';

export default function Buildprofilelanguage() {
  const router = useRouter();
  const { flow } = useLocalSearchParams();
  const { language, changeLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleNext = () => {
    changeLanguage(selectedLanguage);
    router.push(
      flow === 'events'
        ? '/EventTopMatches'
        : flow === 'signup'
        ? '/Homepage'
        : '/TopMatches'
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
          </View>

          <Text style={styles.title}>{t('buildProfile.languageTitle')}</Text>

          <View style={styles.optionsContainer}>
            {LANGUAGES.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[styles.chip, selectedLanguage === option.code && styles.chipSelected]}
                onPress={() => setSelectedLanguage(option.code)}
              >
                <Text
                  style={[styles.chipText, selectedLanguage === option.code && styles.chipTextSelected]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{t('buildProfile.completeProfileButton')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logoSlot: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  title: {
    fontSize: 32,
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 52,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#46a3a4',
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#46a3a4',
    borderColor: '#46a3a4',
  },
  chipText: {
    color: '#46a3a4',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
