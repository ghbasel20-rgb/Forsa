import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import BrandLogo from './components/BrandLogo';
import { useProfile } from './ProfileContext';
import Text from './components/AppText';
import BackButton from './components/BackButton';
import ChipSelector from './components/ChipSelector';
import { getCurrentUser } from './services/auth-service';
import { getUserProfile, updateUserProfile } from './services/profile-service';

export default function BuildProfileSkills() {
  const router = useRouter();
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
      Alert.alert('Error', 'Please select at least one skill');
      return;
    }

    if (edit) {
      const userResult = await getCurrentUser();
      if (!userResult.success) {
        Alert.alert('Error', 'Could not get user information');
        return;
      }

      const profileResult = await getUserProfile(userResult.data.$id);
      if (!profileResult.success) {
        Alert.alert('Error', 'Could not find your profile');
        return;
      }

      const result = await updateUserProfile(profileResult.data.$id, { skills: selectedSkills });
      if (result.success) {
        router.push('/Profile');
      } else {
        Alert.alert('Error', result.error);
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
            <View style={styles.logoSlot} pointerEvents="none">
              <BrandLogo maxWidthPercent={0.75} preserveAspectRatio="xMaxYMid meet" />
            </View>
          </View>

          <Text style={styles.title}>SELECT YOUR{'\n'}SKILLS</Text>

          <ChipSelector
            options={skills}
            selected={selectedSkills}
            onChange={setSelectedSkills}
            modalTitle="Enter Your Skill"
            placeholder="Type your skill"
            submitLabel="Add Skill"
          />

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{edit ? 'Finish Editing' : 'Next'}</Text>
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
    alignItems: 'flex-end',
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