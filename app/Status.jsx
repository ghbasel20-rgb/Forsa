import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../assets/images/home-icon.svg';
import HeaderBrand from './components/HeaderBrand';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { getEventById } from './services/events-service';
import { getSavedEventStatus, unsaveEvent } from './services/saved-events-service';

export default function Status() {
  const router = useRouter();
  const { t } = useLanguage();
  const { id } = useLocalSearchParams();
  const [application, setApplication] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, [id]);

  const loadStatus = async () => {
    if (!id) return;

    const statusResult = await getSavedEventStatus({ documentId: id });
    if (statusResult.success) {
      setApplication(statusResult.data);

      const eventResult = await getEventById(statusResult.data.eventId);
      if (eventResult.success) {
        setEvent(eventResult.data);
      }
    }

    setLoading(false);
  };

  const handleWithdraw = async () => {
    const result = await unsaveEvent(id);
    if (result.success) {
      router.push('/Profile');
    } else {
      Alert.alert(t('common.errorTitle'), result.error);
    }
  };

  const hasDetails = event && (event.location || event.ageRange || event.cost || event.details || event.content);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backText}>{t('common.back')}</Text>
              </TouchableOpacity>
            </View>
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
            <TouchableOpacity onPress={() => router.push('/Homepage')}>
              <HomeIcon width={40} height={40} style={styles.homeIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.bannerIcon}
              resizeMode="contain"
            />
          </View>

          <TitleText style={styles.title}>{t('status.title')}</TitleText>

          {!loading && application && (
            <>
              <View style={styles.statusBar}>
                <Text style={styles.statusText}>{t(`admin.tabs.${application.status}`)}</Text>
              </View>

              {event?.title && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('status.eventLabel')}</Text>
                  <Text style={styles.value}>{event.title}</Text>
                </View>
              )}

              {application.name && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('status.appliedAsLabel')}</Text>
                  <Text style={styles.value}>{application.name}</Text>
                </View>
              )}

              {hasDetails && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('status.detailsLabel')}</Text>
                  {event.location && <Text style={styles.value}>{t('status.locationPrefix')}{event.location}</Text>}
                  {event.ageRange && <Text style={styles.value}>{t('status.ageRangePrefix')}{event.ageRange}</Text>}
                  {event.cost && <Text style={styles.value}>{t('status.costPrefix')}{event.cost}</Text>}
                  {event.details && <Text style={styles.value}>{event.details}</Text>}
                  {event.content && <Text style={styles.value}>{event.content}</Text>}
                </View>
              )}

              <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                <Text style={styles.withdrawButtonText}>{t('status.withdrawButton')}</Text>
              </TouchableOpacity>
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
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#0a445c',
  },
  logoSlot: {
    flex: 1,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  homeIcon: {
    width: 40,
    height: 40,
  },
  iconContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#46a3a4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  bannerIcon: {
    width: 100,
    height: 100,
    tintColor: '#ffffff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 50,
    textAlign: 'center',
  },
  statusBar: {
    backgroundColor: '#0a445c',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: '#46a3a4',
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#0a445c',
    lineHeight: 24,
    marginBottom: 4,
  },
  withdrawButton: {
    borderWidth: 2,
    borderColor: '#c6a2ba',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  withdrawButtonText: {
    color: '#c6a2ba',
    fontSize: 16,
    fontWeight: '600',
  },
});
