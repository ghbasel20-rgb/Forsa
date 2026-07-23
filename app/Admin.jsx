import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../assets/images/home-icon.svg';
import HeaderBrand from './components/HeaderBrand';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { getEventById } from './services/events-service';
import { getAllSavedEvents, updateApplicationStatus } from './services/saved-events-service';

const TABS = ['Pending', 'Approved', 'Denied'];

export default function Admin() {
  const router = useRouter();
  const { t } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const result = await getAllSavedEvents();
    if (result.success) {
      const withTitles = await Promise.all(
        result.data.map(async (application) => {
          const eventResult = await getEventById(application.eventId);
          return {
            ...application,
            eventTitle: eventResult.success ? eventResult.data.title : 'Event',
          };
        })
      );
      setApplications(withTitles);
    }
    setLoading(false);
  };

  const handleDecision = async (documentId, status) => {
    const result = await updateApplicationStatus(documentId, status);
    if (result.success) {
      setApplications((prev) =>
        prev.map((application) =>
          application.$id === documentId ? { ...application, status } : application
        )
      );
    } else {
      Alert.alert(t('common.errorTitle'), result.error);
    }
  };

  const visibleApplications = applications.filter((application) => application.status === activeTab);
  const translatedActiveTab = t(`admin.tabs.${activeTab}`).toLowerCase();

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <BackButton />
            </View>
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
            <TouchableOpacity onPress={() => router.push('/Homepage')}>
              <HomeIcon width={40} height={40} style={styles.homeIcon} />
            </TouchableOpacity>
          </View>

          <TitleText style={styles.title}>{t('admin.title')}</TitleText>

          <View style={styles.tabRow}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {t(`admin.tabs.${tab}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!loading && visibleApplications.length === 0 && (
            <Text style={styles.emptyText}>{t('admin.noApplications', { tab: translatedActiveTab })}</Text>
          )}

          {visibleApplications.map((application) => (
            <View key={application.$id} style={styles.card}>
              <Text style={styles.eventTitle}>{application.eventTitle}</Text>
              <Text style={styles.label}>
                {t('admin.applicantLabel')} <Text style={styles.value}>{application.name || application.userId}</Text>
              </Text>
              {application.appliedAt && (
                <Text style={styles.label}>
                  {t('admin.appliedLabel')}{' '}
                  <Text style={styles.value}>
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </Text>
                </Text>
              )}

              {activeTab === 'Pending' && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleDecision(application.$id, 'Approved')}
                  >
                    <Text style={styles.approveButtonText}>{t('admin.approveButton')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.denyButton}
                    onPress={() => handleDecision(application.$id, 'Denied')}
                  >
                    <Text style={styles.denyButtonText}>{t('admin.denyButton')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 20,
    lineHeight: 50,
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#0a445c',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a445c',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  emptyText: {
    fontSize: 14,
    color: '#46a3a4',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#46a3a4',
    marginBottom: 4,
  },
  value: {
    color: '#0a445c',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#46a3a4',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  denyButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#c6a2ba',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  denyButtonText: {
    color: '#c6a2ba',
    fontSize: 14,
    fontWeight: '600',
  },
});
