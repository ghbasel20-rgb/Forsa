import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HeaderBrand from './components/HeaderBrand';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { getCurrentUser } from './services/auth-service';
import {
  formatEventDate,
  formatFullDueDate,
  getEventById,
  isEventClosed,
} from './services/events-service';
import { getSavedEventStatus, unsaveEvent } from './services/saved-events-service';

export default function EventDetail() {
  const router = useRouter();
  const { t } = useLanguage();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;

    const result = await getEventById(id);
    if (result.success) {
      setEvent(result.data);
    }

    const userResult = await getCurrentUser();
    if (userResult.success) {
      const statusResult = await getSavedEventStatus({ eventId: id, userId: userResult.data.$id });
      if (statusResult.success && statusResult.isApplied) {
        setApplicationId(statusResult.documentId);
      }
    }

    setLoading(false);
  };

  const handleWithdraw = async () => {
    const result = await unsaveEvent(applicationId);
    if (result.success) {
      setApplicationId(null);
    } else {
      Alert.alert(t('common.errorTitle'), result.error);
    }
  };

  const closed = event ? isEventClosed(event) : false;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
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
          </View>

          <TitleText style={styles.title}>
            {loading ? t('eventDetail.loading') : event?.title || t('eventDetail.defaultTitle')}
          </TitleText>

          {!loading && event && (
            <>
              {event.eventDate && (
                <View style={styles.deadlineBar}>
                  <Text style={styles.deadlineText}>
                    {t('eventDetail.eventDatePrefix')}{formatEventDate(event.eventDate)}
                  </Text>
                </View>
              )}

              {event.dueDate && (
                <View style={[styles.deadlineBar, closed && styles.deadlineBarClosed]}>
                  <Text style={styles.deadlineText}>
                    {closed
                      ? t('eventDetail.applicationsClosed')
                      : `${t('eventDetail.applicationDeadlinePrefix')}${formatFullDueDate(event.dueDate)}`}
                  </Text>
                </View>
              )}

              {event.details && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('eventDetail.detailsLabel')}</Text>
                  <Text style={styles.value}>{event.details}</Text>
                </View>
              )}

              {event.location && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('eventDetail.locationLabel')}</Text>
                  <Text style={styles.value}>{event.location}</Text>
                </View>
              )}

              {event.ageRange && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('eventDetail.ageRangeLabel')}</Text>
                  <Text style={styles.value}>{event.ageRange}</Text>
                </View>
              )}

              {event.cost && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('eventDetail.costLabel')}</Text>
                  <Text style={styles.value}>{event.cost}</Text>
                </View>
              )}

              {event.content && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>{t('eventDetail.contentLabel')}</Text>
                  <Text style={styles.value}>{event.content}</Text>
                </View>
              )}

              {applicationId ? (
                <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                  <Text style={styles.withdrawButtonText}>{t('eventDetail.withdrawButton')}</Text>
                </TouchableOpacity>
              ) : !closed ? (
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => router.push(`/Application?eventId=${event.$id}`)}
                >
                  <Text style={styles.applyButtonText}>{t('eventDetail.applyButton')}</Text>
                </TouchableOpacity>
              ) : null}
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
  title: {
    fontSize: 28,
    color: '#0a445c',
    marginBottom: 24,
    lineHeight: 32,
    textAlign: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  deadlineBar: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    borderLeftColor: '#0a445c',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 30,
  },
  deadlineBarClosed: {
    borderLeftColor: '#8a8a8a',
  },
  deadlineText: {
    color: '#0a445c',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 30,
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
  },
  applyButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  withdrawButton: {
    borderWidth: 2,
    borderColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  withdrawButtonText: {
    color: '#c6a2ba',
    fontSize: 16,
    fontWeight: '600',
  },
});
