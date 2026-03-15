import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BuildProfileSkills() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [customSkill, setCustomSkill] = useState('');

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
    'Other',
  ];

  const toggleSkill = (skill) => {
    if (skill === 'Other') {
      setShowCustomSkillInput(true);
    } else if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleCustomSkillSubmit = () => {
    if (customSkill.trim()) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setShowCustomSkillInput(false);
      setCustomSkill('');
    }
  };

  const handleNext = async () => {
    if (selectedSkills.length === 0) {
      Alert.alert('Error', 'Please select at least one skill');
      return;
    }

    const storedData = await AsyncStorage.getItem('profileData');
    const profileData = storedData ? JSON.parse(storedData) : {};
    profileData.skills = selectedSkills;
    await AsyncStorage.setItem('profileData', JSON.stringify(profileData));

    router.push('/Buildprofileinterests');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logoSmall}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>FORSA</Text>
        </View>

        <Text style={styles.title}>SELECT YOUR{'\n'}SKILLS</Text>

        <View style={styles.chipsContainer}>
          {skills.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.chip,
                selectedSkills.includes(skill) && styles.chipSelected
              ]}
              onPress={() => toggleSkill(skill)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSkills.includes(skill) && styles.chipTextSelected
                ]}
              >
                {skill}
              </Text>
            </TouchableOpacity>
          ))}
          
          {selectedSkills.filter(skill => !skills.includes(skill)).map((customSkill) => (
            <TouchableOpacity
              key={customSkill}
              style={[styles.chip, styles.chipSelected]}
              onPress={() => setSelectedSkills(selectedSkills.filter(s => s !== customSkill))}
            >
              <Text style={[styles.chipText, styles.chipTextSelected]}>
                {customSkill}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <Modal
          visible={showCustomSkillInput}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCustomSkillInput(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCustomSkillInput(false)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Enter Your Skill</Text>
              <TextInput
                style={styles.input}
                placeholder="Type your skill"
                placeholderTextColor="#46a3a4"
                value={customSkill}
                onChangeText={setCustomSkill}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleCustomSkillSubmit}>
                <Text style={styles.buttonText}>Add Skill</Text>
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
    width: 30,
    height: 30,
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
    lineHeight: 42,
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