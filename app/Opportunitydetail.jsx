import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OpportunityDetail() {
  const router = useRouter();

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
            <Image
              source={require('../assets/images/Logo.png')}
              style={styles.logoSmall}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>FORSA</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/Profile')}>
            <Image
              source={require('../assets/images/home-icon.png')}
              style={styles.homeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.opportunityIcon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>OPPORTUNITY</Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Location:</Text>
          <View style={styles.underline} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Information:</Text>
          <View style={styles.underline} />
          <View style={styles.underline} />
          <View style={styles.underline} />
          <View style={styles.underline} />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    width: 30,
    height: 30,
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
    height: 200,
    backgroundColor: '#46a3a4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  opportunityIcon: {
    width: 120,
    height: 120,
    tintColor: '#ffffff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#46a3a4',
    marginBottom: 8,
  },
  underline: {
    height: 1,
    backgroundColor: '#46a3a4',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});