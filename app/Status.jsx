import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../assets/images/home-icon.svg';
import HeaderBrand from './components/HeaderBrand';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { getEventWithTranslation } from './services/events-service';
import { getSavedEventStatus, unsaveEvent } from './services/saved-events-service';

export default function Status() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { id } = useLocalSearchParams();
  const [application, setApplication] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, language]);

  const loadStatus = async () => {
    if (!id) return;

    const statusResult = await getSavedEventStatus({ documentId: id });
    if (statusResult.success) {
      setApplication(statusResult.data);

      const eventResult = await getEventWithTranslation(statusResult.data.eventId, language);
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
  const displayTitle = (language === 'ar' && event?.titleAr) || event?.title;
  const displayLocation = (language === 'ar' && event?.locationAr) || event?.location;
  const displayCost = (language === 'ar' && event?.costAr) || event?.cost;
  const displayDetails = (language === 'ar' && event?.detailsAr) || event?.details;
  const displayContent = (language === 'ar' && event?.contentAr) || event?.content;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
          </View>
          <View style={styles.headerUnderline} />

          <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/Homepage')}>
            <HomeIcon width={40} height={40} style={styles.homeIcon} />
          </TouchableOpacity>

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

              {displayTitle && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('status.eventLabel')}</Text>
                  <Text style={styles.value}>{displayTitle}</Text>
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
                  {displayLocation && <Text style={styles.value}>{t('status.locationPrefix')}{displayLocation}</Text>}
                  {event.ageRange && <Text style={styles.value}>{t('status.ageRangePrefix')}{event.ageRange}</Text>}
                  {displayCost && <Text style={styles.value}>{t('status.costPrefix')}{displayCost}</Text>}
                  {displayDetails && <Text style={styles.value}>{displayDetails}</Text>}
                  {displayContent && <Text style={styles.value}>{displayContent}</Text>}
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
    paddingTop: 68,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerUnderline: {
    height: 2,
    backgroundColor: '#46a3a4',
    marginBottom: 30,
  },
  logoSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  homeButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
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
