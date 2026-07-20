import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Logo from '../assets/images/Logo.svg';
import { useProfile } from './ProfileContext';
import Text from './components/AppText';
import BackButton from './components/BackButton';
import ChipSelector from './components/ChipSelector';
import { getCurrentUser } from './services/auth-service';
import { getUserProfile, updateUserProfile } from './services/profile-service';

export default function Buildprofileinterests() {
  const router = useRouter();
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
      Alert.alert('Error', 'Please select at least three interests');
      return;
    }

    try {
      const currentUserResult = await getCurrentUser();
      if (!currentUserResult.success) {
        Alert.alert('Error', 'Could not get user information');
        return;
      }

      const userId = currentUserResult.data.$id;

      const profileResult = await getUserProfile(userId);
      if (!profileResult.success) {
        Alert.alert('Error', 'Could not find your profile');
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
        Alert.alert('Success', 'Profile updated successfully!');
        router.push(edit ? '/Profile' : flow === 'events' ? '/EventTopMatches' : '/TopMatches');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.logoContainer}>
            <Logo width={38} height={38} style={styles.logoSmall} />
            <Text style={styles.brandName}>FORSA</Text>
          </View>
        </View>

        <Text style={styles.title}>SELECT YOUR{'\n'}INTERESTS</Text>

        <ChipSelector
          options={interests}
          selected={selectedInterests}
          onChange={setSelectedInterests}
          modalTitle="Enter Your Interest"
          placeholder="Type your interest"
          submitLabel="Add Interest"
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{edit ? 'Finish Editing' : 'Complete Profile'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoSmall: {
    width: 38,
    height: 38,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 52,
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