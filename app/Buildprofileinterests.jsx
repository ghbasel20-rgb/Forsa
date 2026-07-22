import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import HeaderBrand from './components/HeaderBrand';
import { useProfile } from './ProfileContext';
import Text from './components/AppText';
import BackButton from './components/BackButton';
import ChipSelector from './components/ChipSelector';
import { useLanguage } from './contexts/LanguageContext';
import { getCurrentUser } from './services/auth-service';
import { getUserProfile, updateUserProfile } from './services/profile-service';

export default function Buildprofileinterests() {
  const router = useRouter();
  const { t } = useLanguage();
  const { edit, flow } = useLocalSearchParams();
  const { profileData, clearProfile } = useProfile();
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    const loadExistingInterests = async () => {
      const userResult = await getCurrentUser();
      if (!userResult.success) return;

      const profileResult = await getUserProfile(userResult.data.$id);
      if (profileResult.success && profileResult.data.interests?.length > 0) {
        setSelectedInterests(profileResult.data.interests);
      }
    };

    loadExistingInterests();
  }, []);

  const interests = [
    'Technology',
    'Arts',
    'Sports',
    'Business',
    'Science',
    'Music',
    'Travel',
    'Gaming',
    'Reading',
    'Cooking',
    'Fashion',
    'Health & Fitness',
    'Photography',
    'Movies & TV',
    'Nature',
    'Politics',
    'History',
    'Philosophy',
    'Psychology',
    'Education',
    'Environment',
    'Volunteering',
    'Entrepreneurship',
    'Finance',
    'Real Estate',
    'Food & Dining',
    'Outdoor Activities',
    'Writing',
    'Dancing',
    'Theater',
    'Languages',
    'Other',
  ];

  const handleNext = async () => {
    if (selectedInterests.length < 3) {
      Alert.alert(t('common.errorTitle'), t('buildProfile.selectInterestError'));
      return;
    }

    try {
      const currentUserResult = await getCurrentUser();
      if (!currentUserResult.success) {
        Alert.alert(t('common.errorTitle'), t('buildProfile.couldNotGetUser'));
        return;
      }

      const userId = currentUserResult.data.$id;

      const profileResult = await getUserProfile(userId);
      if (!profileResult.success) {
        Alert.alert(t('common.errorTitle'), t('buildProfile.couldNotFindProfile'));
        return;
      }

      const updateData = edit
        ? { interests: selectedInterests }
        : {
            skills: profileData.skills || [],
            interests: selectedInterests,
            hasCompletedSkillsInterests: true,
          };

      const result = await updateUserProfile(profileResult.data.$id, updateData);

      if (result.success) {
        clearProfile();
        if (edit) {
          Alert.alert(t('common.successTitle'), t('buildProfile.profileUpdateSuccess'));
          router.push('/Profile');
        } else {
          // Preferred language page is temporarily skipped after skills/interests.
          router.push(
            flow === 'events'
              ? '/EventTopMatches'
              : flow === 'signup'
              ? '/Homepage'
              : '/TopMatches'
          );
        }
      } else {
        Alert.alert(t('common.errorTitle'), result.error);
      }
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert(t('common.errorTitle'), t('buildProfile.profileSaveError'));
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
          </View>

          <Text style={styles.title}>{t('buildProfile.interestsTitle')}</Text>

          <ChipSelector
            options={interests}
            selected={selectedInterests}
            onChange={setSelectedInterests}
            modalTitle={t('buildProfile.interestModalTitle')}
            placeholder={t('buildProfile.interestPlaceholder')}
            submitLabel={t('buildProfile.addInterestButton')}
          />

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{edit ? t('buildProfile.finishEditingButton') : t('buildProfile.nextButton')}</Text>
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