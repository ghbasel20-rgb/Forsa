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

export default function BuildProfile() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [educationStatus, setEducationStatus] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomLocationInput, setShowCustomLocationInput] = useState(false);

  const locations = [
    'Jerusalem',
    'Tel Aviv',
    'Haifa',
    'Rishon LeZion',
    'Petah Tikva',
    'Ashdod',
    'Netanya',
    'Beer Sheva',
    'Holon',
    'Bnei Brak',
    'Ramat Gan',
    'Ashkelon',
    'Rehovot',
    'Bat Yam',
    'Beit Shemesh',
    'Kfar Saba',
    'Herzliya',
    'Hadera',
    'Modi\'in',
    'Nazareth',
    'Lod',
    'Ramla',
    'Acre',
    'Eilat',
    'Tiberias',
    'Rosh HaAyin',
    'Nahariya',
    'Afula',
    'Raanana',
    'Hod HaSharon',
    'Kiryat Ata',
    'Kiryat Gat',
    'Carmiel',
    'Yavne',
    'Givatayim',
    'Dimona',
    'Ma\'ale Adumim',
    'Ariel',
    'Safed',
    'Other',
  ];
  
  const educationLevels = [
    'High School',
    'Undergraduate',
    'Graduate',
    'Postgraduate',
  ];

  const filteredLocations = locations.filter(loc =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleLocationSelect = (loc) => {
    if (loc === 'Other') {
      setShowCustomLocationInput(true);
      setShowLocationModal(false);
    } else {
      setLocation(loc);
      setShowLocationModal(false);
      setLocationSearch('');
    }
  };

  const handleCustomLocationSubmit = () => {
    if (customLocation.trim()) {
      setLocation(customLocation);
      setShowCustomLocationInput(false);
      setCustomLocation('');
    }
  };

  const handleSubmit = async () => {
    if (!location || !educationStatus) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const profileData = {
      location,
      educationStatus,
    };

    await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
    router.push('/Buildprofileskills');
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

        <Text style={styles.title}>BUILD YOUR{'\n'}PROFILE</Text>

        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>Tell us about you:</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowLocationModal(true)}
          >
            <Text style={[styles.dropdownText, !location && styles.placeholderText]}>
              {location || 'Location'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowEducationModal(true)}
          >
            <Text style={[styles.dropdownText, !educationStatus && styles.placeholderText]}>
              {educationStatus || 'Education status'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showLocationModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLocationModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLocationModal(false)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search location..."
                placeholderTextColor="#46a3a4"
                value={locationSearch}
                onChangeText={setLocationSearch}
              />
              <ScrollView>
                {filteredLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={styles.modalOption}
                    onPress={() => handleLocationSelect(loc)}
                  >
                    <Text style={styles.modalOptionText}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={showCustomLocationInput}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCustomLocationInput(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCustomLocationInput(false)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Enter Your Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Type your location"
                placeholderTextColor="#46a3a4"
                value={customLocation}
                onChangeText={setCustomLocation}
              />
              <TouchableOpacity style={styles.button} onPress={handleCustomLocationSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={showEducationModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEducationModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowEducationModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Education Status</Text>
              <ScrollView>
                {educationLevels.map((edu) => (
                  <TouchableOpacity
                    key={edu}
                    style={styles.modalOption}
                    onPress={() => {
                      setEducationStatus(edu);
                      setShowEducationModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{edu}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
  formContainer: {
    gap: 16,
  },
  sectionLabel: {
    fontSize: 18,
    color: '#46a3a4',
    marginTop: 8,
    marginBottom: 4,
  },
  dropdownButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  dropdownText: {
    fontSize: 16,
    color: '#0a445c',
  },
  placeholderText: {
    color: '#46a3a4',
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
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#46a3a4',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0a445c',
    marginBottom: 12,
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
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e4',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#0a445c',
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