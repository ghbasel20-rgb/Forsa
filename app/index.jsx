import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Logo from '../assets/images/logowname.svg';
import Text from './components/AppText';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={260} height={57} style={styles.logo} />
      </View>

      <Text style={styles.tagline}>
        All the opportunities for you{'\n'}in one place
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push('/Sign-in')}
        >
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push('/Sign-up')}
        >
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 260,
    height: 57,
  },
  tagline: {
    fontSize: 18,
    color: '#46a3a4',
    textAlign: 'center',
    marginBottom: 80,
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#c6a2ba',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#46a3a4',
  },
  signupButtonText: {
    color: '#46a3a4',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});