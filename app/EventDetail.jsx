import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../assets/images/home-icon.svg';
import Logo from '../assets/images/Logo.svg';
import Text from './components/AppText';
import TitleText from './components/TitleText';
import { getEventById } from './services/events-service';

export default function EventDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;

    const result = await getEventById(id);
    if (result.success) {
      setEvent(result.data);
    }
    setLoading(false);
  };

  return (
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
          </>
        )}
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
});
