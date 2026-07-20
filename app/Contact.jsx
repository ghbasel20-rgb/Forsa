import React from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import InstaIcon from '../assets/images/insta.svg';
import Logo from '../assets/images/Logo.svg';
import WhatsIcon from '../assets/images/whats.svg';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import Text from './components/AppText';
import TitleText from './components/TitleText';

const WHATSAPP_URL = 'https://chat.whatsapp.com/EudPXkosHkY9yfcOh1fjRq';
const INSTAGRAM_URL = 'https://www.instagram.com/forsa.meet?igsh=YWVvMTZwOWl5NTN0';

export default function Contact() {
  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
            <Logo width={38} height={38} style={styles.logoSmall} />
            <Text style={styles.brandName}>FORSA</Text>
          </View>

          <TitleText style={styles.title}>CONTACT US</TitleText>

          <TouchableOpacity style={styles.contactRow} onPress={() => openLink(WHATSAPP_URL)}>
            <View style={styles.iconCircle}>
              <WhatsIcon width={36} height={36} />
            </View>
            <Text style={styles.contactLabel}>Join our whatspp comunity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => openLink(INSTAGRAM_URL)}>
            <View style={styles.iconCircle}>
              <InstaIcon width={36} height={36} />
            </View>
            <Text style={styles.contactLabel}>Follow us on instagram</Text>
          </TouchableOpacity>
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
    gap: 8,
    marginBottom: 30,
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    textAlign: 'left',
    marginBottom: 40,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    lineHeight: 23,
  },
});
