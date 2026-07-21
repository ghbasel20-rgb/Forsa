import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../assets/images/home-icon.svg';
import Logo from '../assets/images/Logo.svg';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { getCurrentUser } from './services/auth-service';
import { getEventById } from './services/events-service';
import { getSavedEventStatus, unsaveEvent } from './services/saved-events-service';

export default function EventDetail() {
  const router = useRouter();
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
      Alert.alert('Error', result.error);
    }
  };

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
                <Text style={styles.backText}>{'< Back'}</Text>
              </TouchableOpacity>
              <Logo width={38} height={38} style={styles.logoSmall} />
              <Text style={styles.brandName}>FORSA</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/Homepage')}>
              <HomeIcon width={40} height={40} style={styles.homeIcon} />
            </TouchableOpacity>
          </View>

          <TitleText style={styles.title}>
            {loading ? 'LOADING...' : event?.title || 'EVENT'}
          </TitleText>

          {!loading && event && (
            <>
              {event.details && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Details:</Text>
                  <Text style={styles.value}>{event.details}</Text>
                </View>
              )}

              {event.location && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>{event.location}</Text>
                </View>
              )}

              {event.ageRange && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Age range:</Text>
                  <Text style={styles.value}>{event.ageRange}</Text>
                </View>
              )}

              {event.cost && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Cost:</Text>
                  <Text style={styles.value}>{event.cost}</Text>
                </View>
              )}

              {event.content && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Content:</Text>
                  <Text style={styles.value}>{event.content}</Text>
                </View>
              )}

              {applicationId ? (
                <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                  <Text style={styles.withdrawButtonText}>Withdraw application</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => router.push(`/Application?eventId=${event.$id}`)}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              )}
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
  homeIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 50,
    textAlign: 'center',
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
