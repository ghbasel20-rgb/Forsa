import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderBrand from './components/HeaderBrand';
import EditIcon from '../assets/images/edit.svg';
import ProfilePlaceholder from '../assets/images/Profile.svg';
import SettingsIcon from '../assets/images/settings.svg';
import Text from './components/AppText';
import BottomNav from './components/BottomNav';
import LanguagePickerModal from './components/LanguagePickerModal';
import StatusPickerModal from './components/StatusPickerModal';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { getCurrentUser, signOut } from './services/auth-service';
import { getEventById } from './services/events-service';
import {
  deleteProfileImage,
  getProfileImageUrl,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from './services/profile-service';
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
  const [changingImage, setChangingImage] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { language, changeLanguage, t } = useLanguage();

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
              eventTitle: eventResult.success ? eventResult.data.title : t('eventDetail.defaultTitle'),
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

  const handleSelectLanguage = (code) => {
    changeLanguage(code);
    setShowLanguageModal(false);
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

  const applyPickedImage = async (result) => {
    if (result.canceled) return;

    setChangingImage(true);
    try {
      const previousImageId = profileData.profileImageId;
      const uploadResult = await uploadProfileImage(result.assets[0]);
      if (!uploadResult.success) {
        Alert.alert(t('profile.uploadFailedTitle'), uploadResult.error);
        return;
      }

      const updateResult = await updateUserProfile(profileData.$id, {
        profileImageId: uploadResult.data.$id,
      });
      if (!updateResult.success) {
        Alert.alert(t('common.errorTitle'), updateResult.error);
        return;
      }

      setProfileData(updateResult.data);

      if (previousImageId) {
        deleteProfileImage(previousImageId);
      }
    } finally {
      setChangingImage(false);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('profile.permissionNeededTitle'), t('profile.cameraPermissionMsg'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    await applyPickedImage(result);
  };

  const handlePickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('profile.permissionNeededTitle'), t('profile.libraryPermissionMsg'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    await applyPickedImage(result);
  };

  const handleChangeAvatar = () => {
    if (changingImage || !profileData) return;

    Alert.alert(t('profile.changePhotoTitle'), undefined, [
      { text: t('profile.takePhoto'), onPress: handleTakePhoto },
      { text: t('profile.chooseFromLibrary'), onPress: handlePickFromLibrary },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setSettingsMenuVisible(true)}
            >
              <SettingsIcon width={34} height={34} />
            </TouchableOpacity>
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" showLanguageButton={false} />
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
                {profileData?.isAdmin === true && (
                  <TouchableOpacity
                    style={styles.settingsMenuItem}
                    onPress={() => {
                      setSettingsMenuVisible(false);
                      router.push('/Admin');
                    }}
                  >
                    <Text style={styles.settingsMenuItemText}>{t('profile.adminMenuItem')}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.settingsMenuItem}
                  onPress={() => {
                    setSettingsMenuVisible(false);
                    setShowLanguageModal(true);
                  }}
                >
                  <Text style={styles.settingsMenuItemText}>{t('profile.languageMenuItem')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsMenuItem} onPress={handleLogout}>
                  <Text style={styles.settingsMenuItemText}>{t('profile.logoutMenuItem')}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>

          <LanguagePickerModal
            visible={showLanguageModal}
            language={language}
            onClose={() => setShowLanguageModal(false)}
            onSelect={handleSelectLanguage}
          />

          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={handleChangeAvatar}
                disabled={changingImage}
              >
                {profileData?.profileImageId ? (
                  <Image
                    source={{ uri: getProfileImageUrl(profileData.profileImageId) }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <ProfilePlaceholder width={80} height={80} />
                )}
              </TouchableOpacity>
              <View style={styles.avatarEditBadge}>
                {changingImage ? (
                  <ActivityIndicator size="small" color="#46a3a4" />
                ) : (
                  <EditIcon width={18} height={18} />
                )}
              </View>
            </View>
            <TitleText style={styles.profileTitle}>{t('profile.title')}</TitleText>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.fullNameLabel')}</Text>
              <Text style={styles.infoValue}>{profileData?.fullName || userData?.name || t('common.loading')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.emailLabel')}</Text>
              <Text style={styles.infoValue}>{userData?.email || t('common.loading')}</Text>
            </View>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => setShowStatusModal(true)}
            >
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>{t('profile.statusLabel')}</Text>
                <EditIcon width={32} height={32} />
              </View>
              <Text style={styles.infoValue}>{profileData?.educationStatus || t('profile.notSet')}</Text>
            </TouchableOpacity>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.ageLabel')}</Text>
              <Text style={styles.infoValue}>{profileData?.dateOfBirth ? calculateAge(profileData.dateOfBirth) : t('profile.notSet')}</Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleInline}>{t('profile.skillsHeading')}</Text>
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
              <Text style={styles.emptyText}>{t('profile.noSkills')}</Text>
            )}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleInline}>{t('profile.interestsHeading')}</Text>
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
              <Text style={styles.emptyText}>{t('profile.noInterests')}</Text>
            )}
          </View>

          <StatusPickerModal
            visible={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            onSubmit={saveStatus}
          />

          {savedOpportunities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t('profile.savedOpportunitiesHeading')}</Text>
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
                    <Text style={styles.opportunityTitle} numberOfLines={1} ellipsizeMode="tail">{opp.opportunityTitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {appliedEvents.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t('profile.appliedEventsHeading')}</Text>
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
                    <Text style={styles.opportunityTitle} numberOfLines={1} ellipsizeMode="tail">{application.eventTitle}</Text>
                    <TouchableOpacity
                      style={styles.readMoreButton}
                      onPress={() => router.push(`/Status?id=${application.$id}`)}
                    >
                      <Text style={styles.readMoreText}>{t('profile.viewStatusButton')}</Text>
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
  scroll: {
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
    marginBottom: 30,
  },
  settingsButton: {
    marginRight: 8,
  },
  logoSlot: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  menuOverlay: {
    flex: 1,
  },
  settingsMenu: {
    position: 'absolute',
    top: 166,
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
  },
  avatarEditBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    justifyContent: 'center',
    alignItems: 'center',
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