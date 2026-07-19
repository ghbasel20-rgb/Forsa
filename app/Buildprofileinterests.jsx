import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Logo from '../assets/images/Logo.svg';
import { useProfile } from './ProfileContext';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import { getCurrentUser } from './services/auth-service';
import { getUserProfile, updateUserProfile } from './services/profile-service';

export default function Buildprofileinterests() {
  const router = useRouter();
  const { profileData, clearProfile } = useProfile();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showCustomInterestInput, setShowCustomInterestInput] = useState(false);
  const [customInterest, setCustomInterest] = useState('');

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

  const toggleInterest = (interest) => {
    if (interest === 'Other') {
      setShowCustomInterestInput(true);
    } else if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleCustomInterestSubmit = () => {
    if (customInterest.trim()) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setShowCustomInterestInput(false);
      setCustomInterest('');
    }
  };

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

      const result = await updateUserProfile(profileResult.data.$id, {
        skills: profileData.skills || [],
        interests: selectedInterests,
        hasCompletedSkillsInterests: true,
      });

      if (result.success) {
        clearProfile();
        Alert.alert('Success', 'Profile updated successfully!');
        router.push('/TopMatches');
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
          <Logo width={38} height={38} style={styles.logoSmall} />
          <Text style={styles.brandName}>FORSA</Text>
        </View>

        <Text style={styles.title}>SELECT YOUR{'\n'}INTERESTS</Text>

        <View style={styles.chipsContainer}>
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.chip,
                selectedInterests.includes(interest) && styles.chipSelected
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedInterests.includes(interest) && styles.chipTextSelected
                ]}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
          
          {selectedInterests.filter(interest => !interests.includes(interest)).map((customInterest) => (
            <TouchableOpacity
              key={customInterest}
              style={[styles.chip, styles.chipSelected]}
              onPress={() => setSelectedInterests(selectedInterests.filter(i => i !== customInterest))}
            >
              <Text style={[styles.chipText, styles.chipTextSelected]}>
                {customInterest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Complete Profile</Text>
        </TouchableOpacity>

        <Modal
          visible={showCustomInterestInput}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCustomInterestInput(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCustomInterestInput(false)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Enter Your Interest</Text>
              <TextInput
                style={styles.input}
                placeholder="Type your interest"
                placeholderTextColor="#46a3a4"
                value={customInterest}
                onChangeText={setCustomInterest}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleCustomInterestSubmit}>
                <Text style={styles.buttonText}>Add Interest</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
    justifyContent: 'flex-end',
    marginBottom: 40,
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
  chipsContainer: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#0a445c',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
});