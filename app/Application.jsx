import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../assets/images/home-icon.svg';
import Logo from '../assets/images/Logo.svg';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import TitleText from './components/TitleText';
import { getCurrentUser } from './services/auth-service';
import { getEventById, isEventClosed } from './services/events-service';
import { getUserProfile } from './services/profile-service';
import { applyToEvent } from './services/saved-events-service';

export default function Application() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    if (!eventId) return;

    const eventResult = await getEventById(eventId);
    if (eventResult.success) {
      setEvent(eventResult.data);
    }

    const userResult = await getCurrentUser();
    if (userResult.success) {
      setUserId(userResult.data.$id);

      const profileResult = await getUserProfile(userResult.data.$id);
      if (profileResult.success && profileResult.data.fullName) {
        setName(profileResult.data.fullName);
      }
    }

    setLoading(false);
  };

  const closed = event ? isEventClosed(event.dueDate) : false;

  const handleApply = async () => {
    if (!userId || !eventId || !name.trim() || closed) {
      return;
    }

    setSubmitting(true);
    const result = await applyToEvent(userId, eventId, name.trim());
    setSubmitting(false);

    if (result.success) {
      router.push('/Profile');
    }
  };

  const hasRequirements = event && (event.ageRange || event.cost || event.details || event.content);

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

          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.bannerIcon}
              resizeMode="contain"
            />
          </View>

          <TitleText style={styles.title}>APPLICATION</TitleText>

          {!loading && closed ? (
            <View style={styles.closedBar}>
              <Text style={styles.closedBarText}>Applications closed</Text>
            </View>
          ) : (
            <>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#46a3a4"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              {hasRequirements && (
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Requirements</Text>
                  {event.ageRange && <Text style={styles.value}>Age range: {event.ageRange}</Text>}
                  {event.cost && <Text style={styles.value}>Cost: {event.cost}</Text>}
                  {event.details && <Text style={styles.value}>{event.details}</Text>}
                  {event.content && <Text style={styles.value}>{event.content}</Text>}
                </View>
              )}

              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                disabled={loading || submitting}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
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
  label: {
    fontSize: 18,
    color: '#46a3a4',
    marginBottom: 8,
    fontWeight: '600',
  },
  closedBar: {
    backgroundColor: '#8a8a8a',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closedBarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 30,
  },
  value: {
    fontSize: 16,
    color: '#0a445c',
    lineHeight: 24,
    marginBottom: 4,
  },
  applyButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
