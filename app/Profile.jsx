import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCurrentUser } from './services/auth-service';
import { getUserProfile } from './services/profile-service';
import { getSavedOpportunities } from './services/saved-opportunities-service';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [savedOpportunities, setSavedOpportunities] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    const userResult = await getCurrentUser();
    if (userResult.success) {
      setUserData(userResult.data);
      
      const profileResult = await getUserProfile(userResult.data.$id);
      if (profileResult.success) {
        setProfileData(profileResult.data);
      }

      const savedResult = await getSavedOpportunities(userResult.data.$id);
      if (savedResult.success) {
        setSavedOpportunities(savedResult.data);
      }
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.profileTitle}>MY PROFILE</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{profileData?.fullName || userData?.name || 'Loading...'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userData?.email || 'Loading...'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{profileData?.location || 'Not set'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Education status:</Text>
            <Text style={styles.infoValue}>{profileData?.educationStatus || 'Not set'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{profileData?.dateOfBirth ? calculateAge(profileData.dateOfBirth) : 'Not set'}</Text>
          </View>
        </View>

        {savedOpportunities.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>SAVED{'\n'}OPPORTUNITIES:</Text>
            <View style={styles.opportunitiesContainer}>
              {savedOpportunities.map((opp) => (
                <View key={opp.$id} style={styles.opportunityCard}>
                  <View style={styles.opportunityIcon}>
                    <Image
                      source={require('../assets/images/icon.png')}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.opportunityTitle}>{opp.opportunityTitle}</Text>
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => router.push(`/Opportunitydetail?id=${opp.opportunityId}`)}
                  >
                    <Text style={styles.readMoreText}>Read more</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/TopMatches')}
        >
          <Text style={styles.continueButtonText}>Continue exploring</Text>
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
    justifyContent: 'flex-end',
    marginBottom: 30,
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#46a3a4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 40,
    color: '#ffffff',
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a445c',
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#46a3a4',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#46a3a4',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#0a445c',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a445c',
    marginTop: 30,
    marginBottom: 20,
    lineHeight: 28,
  },
  opportunitiesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  opportunityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  opportunityIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#46a3a4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },
  opportunityTitle: {
    flex: 1,
    fontSize: 16,
    color: '#46a3a4',
    fontWeight: '500',
  },
  readMoreButton: {
    backgroundColor: '#e1e4e4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  readMoreText: {
    color: '#0a445c',
    fontSize: 12,
  },
  continueButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});