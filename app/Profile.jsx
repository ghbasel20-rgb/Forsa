import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Logo from '../assets/images/Logo.svg';
import EditIcon from '../assets/images/edit.svg';
import SettingsIcon from '../assets/images/settings.svg';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import StatusPickerModal from './components/StatusPickerModal';
import { getCurrentUser, signOut } from './services/auth-service';
import { getEventById } from './services/events-service';
import { getUserProfile, updateUserProfile } from './services/profile-service';
import { getSavedEvents } from './services/saved-events-service';
import { getSavedOpportunities } from './services/saved-opportunities-service';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

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
    setSettingsMenuVisible(false);
    await signOut();
    router.replace('/Sign-in');
  };

  const saveStatus = async (newStatus) => {
    setShowStatusModal(false);
    const result = await updateUserProfile(profileData.$id, { educationStatus: newStatus });
    if (result.success) {
      setProfileData(result.data);
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
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <BackButton />
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setSettingsMenuVisible(true)}
              >
                <SettingsIcon width={34} height={34} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerBrand}>
              <Logo width={38} height={38} style={styles.logoSmall} />
              <Text style={styles.brandName}>FORSA</Text>
            </View>
          </View>

          <Modal
            transparent
            visible={settingsMenuVisible}
            animationType="fade"
            onRequestClose={() => setSettingsMenuVisible(false)}
          >
            <Pressable
              style={styles.menuOverlay}
              onPress={() => setSettingsMenuVisible(false)}
            >
              <View style={styles.settingsMenu}>
                <TouchableOpacity style={styles.settingsMenuItem} onPress={handleLogout}>
                  <Text style={styles.settingsMenuItemText}>Log out</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>

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
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => setShowStatusModal(true)}
            >
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <EditIcon width={32} height={32} />
              </View>
              <Text style={styles.infoValue}>{profileData?.educationStatus || 'Not set'}</Text>
            </TouchableOpacity>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{profileData?.dateOfBirth ? calculateAge(profileData.dateOfBirth) : 'Not set'}</Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleInline}>SKILLS</Text>
            <TouchableOpacity onPress={() => router.push('/Buildprofileskills?edit=true')}>
              <EditIcon width={38} height={38} />
            </TouchableOpacity>
          </View>
          <View style={styles.chipsContainer}>
            {profileData?.skills?.length > 0 ? (
              profileData.skills.map((skill) => (
                <View key={skill} style={styles.chip}>
                  <Text style={styles.chipText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No skills added yet</Text>
            )}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleInline}>INTERESTS</Text>
            <TouchableOpacity onPress={() => router.push('/Buildprofileinterests?edit=true')}>
              <EditIcon width={38} height={38} />
            </TouchableOpacity>
          </View>
          <View style={styles.chipsContainer}>
            {profileData?.interests?.length > 0 ? (
              profileData.interests.map((interest) => (
                <View key={interest} style={styles.chip}>
                  <Text style={styles.chipText}>{interest}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No interests added yet</Text>
            )}
          </View>

          <StatusPickerModal
            visible={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            onSubmit={saveStatus}
          />

          {savedOpportunities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>SAVED{'\n'}OPPORTUNITIES:</Text>
              <View style={styles.opportunitiesContainer}>
                {savedOpportunities.map((opp) => (
                  <TouchableOpacity
                    key={opp.$id}
                    style={styles.opportunityCard}
                    onPress={() => router.push(`/Opportunitydetail?id=${opp.opportunityId}`)}
                  >
                    <View style={styles.opportunityIcon}>
                      <Image
                        source={require('../assets/images/icon.png')}
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.opportunityTitle}>{opp.opportunityTitle}</Text>
                  </TouchableOpacity>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  menuOverlay: {
    flex: 1,
  },
  settingsMenu: {
    position: 'absolute',
    top: 96,
    left: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 6,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  settingsMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingsMenuItemText: {
    fontSize: 15,
    color: '#0a445c',
    fontWeight: '500',
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
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitleInline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a445c',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#46a3a4',
  },
  chipText: {
    color: '#ffffff',
    fontSize: 13,
  },
  emptyText: {
    fontSize: 14,
    color: '#46a3a4',
    fontStyle: 'italic',
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
});