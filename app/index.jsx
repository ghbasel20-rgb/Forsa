import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import GoogleIcon from '../assets/images/google.svg';
import Logo from '../assets/images/log-sign-in-logo.svg';
import Text from './components/AppText';
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from './config/google-auth-config';
import { signInWithGoogleCredential } from './services/auth-service';
import { createUserProfile, getUserProfile } from './services/profile-service';

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Falls back to the web client ID on platforms without their own yet
    // (see google-auth-config.js) so useAuthRequest doesn't throw on native
    // before those are filled in — native sign-in just won't complete
    // successfully until they are.
    clientId: GOOGLE_WEB_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { idToken, accessToken } = response.authentication ?? {};
      handleGoogleSignIn({ idToken, accessToken });
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  }, [response]);

  const handleGoogleSignIn = async ({ idToken, accessToken }) => {
    setGoogleLoading(true);

    const result = await signInWithGoogleCredential({ idToken, accessToken });
    if (!result.success) {
      setGoogleLoading(false);
      Alert.alert('Error', result.error);
      return;
    }

    const profileResult = await getUserProfile(result.data.$id);
    if (profileResult.success) {
      setGoogleLoading(false);
      router.push('/Homepage');
      return;
    }

    const createResult = await createUserProfile(result.data.$id, {
      fullName: result.data.name || '',
      email: result.data.email,
      dateOfBirth: null,
      educationStatus: null,
      skills: [],
      interests: [],
      hasCompletedSkillsInterests: false,
    });
    setGoogleLoading(false);

    if (createResult.success) {
      router.push({ pathname: '/Buildprofileskills', params: { flow: 'signup' } });
    } else {
      Alert.alert('Error', createResult.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={520} height={288} style={styles.logo} />
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

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => promptAsync()}
          disabled={!request || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#46a3a4" />
          ) : (
            <>
              <GoogleIcon width={20} height={20} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
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
  },
  logo: {
    width: 520,
    height: 288,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#b7c2c2',
  },
  dividerText: {
    color: '#6b8788',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#b7c2c2',
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '600',
  },
});
