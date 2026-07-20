import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Logo from '../assets/images/Logo.svg';
import SettingsIcon from '../assets/images/settings.svg';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { getCurrentUser, signOut } from './services/auth-service';
import { getEventById } from './services/events-service';
import { exploreOpportunities } from './services/navigation-service';
import { getUserProfile } from './services/profile-service';
import { getSavedEvents } from './services/saved-events-service';
import { getSavedOpportunities } from './services/saved-opportunities-service';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);

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

      const appliedResult = await getSavedEvents(userResult.data.$id);
      if (appliedResult.success) {
        const withTitles = await Promise.all(
          appliedResult.data.map(async (application) => {
            const eventResult = await getEventById(application.eventId);
            return {
              ...application,
              eventTitle: eventResult.success ? eventResult.data.title : 'Event',
            };
          })
        );
        setAppliedEvents(withTitles);
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/Sign-in');
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
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleLogout}>
              <SettingsIcon width={26} height={26} />
            </TouchableOpacity>
            <View style={styles.headerBrand}>
              <Logo width={38} height={38} style={styles.logoSmall} />
              <Text style={styles.brandName}>FORSA</Text>
            </View>
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <TitleText style={styles.profileTitle}>MY PROFILE</TitleText>
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
              <TitleText style={styles.infoLabel}>Status:</TitleText>
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

          {appliedEvents.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>APPLIED{'\n'}EVENTS:</Text>
              <View style={styles.opportunitiesContainer}>
                {appliedEvents.map((application) => (
                  <View key={application.$id} style={styles.opportunityCard}>
                    <View style={styles.opportunityIcon}>
                      <Image
                        source={require('../assets/images/icon.png')}
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.opportunityTitle}>{application.eventTitle}</Text>
                    <TouchableOpacity
                      style={styles.readMoreButton}
                      onPress={() => router.push(`/Status?id=${application.$id}`)}
                    >
                      <Text style={styles.readMoreText}>View status</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => exploreOpportunities(router)}
          >
            <Text style={styles.continueButtonText}>Continue exploring</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
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
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerBrand: {
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
    lineHeight: 35,
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