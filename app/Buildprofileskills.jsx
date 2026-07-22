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

export default function BuildProfileSkills() {
  const router = useRouter();
  const { t } = useLanguage();
  const { edit, flow } = useLocalSearchParams();
  const { updateProfile } = useProfile();
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const loadExistingSkills = async () => {
      const userResult = await getCurrentUser();
      if (!userResult.success) return;

      const profileResult = await getUserProfile(userResult.data.$id);
      if (profileResult.success && profileResult.data.skills?.length > 0) {
        setSelectedSkills(profileResult.data.skills);
      }
    };

    loadExistingSkills();
  }, []);

  const skills = [
    'Programming',
    'Design',
    'Writing',
    'Public Speaking',
    'Research',
    'Marketing',
    'Data Analysis',
    'Project Management',
    'Leadership',
    'Communication',
    'Problem Solving',
    'Creativity',
    'Teamwork',
    'Time Management',
    'Critical Thinking',
    'Digital Marketing',
    'Video Editing',
    'Photography',
    'Translation',
    'Teaching',
    'Sales',
    'Customer Service',
    'Accounting',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Content Creation',
    'Social Media',
    'SEO',
    'Cooking',
    'Other',
  ];

  const handleNext = async () => {
    if (selectedSkills.length === 0) {
      Alert.alert(t('common.errorTitle'), t('buildProfile.selectSkillError'));
      return;
    }

    if (edit) {
      const userResult = await getCurrentUser();
      if (!userResult.success) {
        Alert.alert(t('common.errorTitle'), t('buildProfile.couldNotGetUser'));
        return;
      }

      const profileResult = await getUserProfile(userResult.data.$id);
      if (!profileResult.success) {
        Alert.alert(t('common.errorTitle'), t('buildProfile.couldNotFindProfile'));
        return;
      }

      const result = await updateUserProfile(profileResult.data.$id, { skills: selectedSkills });
      if (result.success) {
        router.push('/Profile');
      } else {
        Alert.alert(t('common.errorTitle'), result.error);
      }
      return;
    }

    updateProfile({ skills: selectedSkills });
    router.push({ pathname: '/Buildprofileinterests', params: flow ? { flow } : {} });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
          </View>

          <Text style={styles.title}>{t('buildProfile.skillsTitle')}</Text>

          <ChipSelector
            options={skills}
            selected={selectedSkills}
            onChange={setSelectedSkills}
            modalTitle={t('buildProfile.skillModalTitle')}
            placeholder={t('buildProfile.skillPlaceholder')}
            submitLabel={t('buildProfile.addSkillButton')}
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