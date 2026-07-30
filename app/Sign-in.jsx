import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import GoogleIcon from '../assets/images/google.svg';
import HeaderBrand from './components/HeaderBrand';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import PasswordInput from './components/PasswordInput';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { signIn, signOut } from './services/auth-service';

export default function SignIn() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);
  const { promptGoogleSignIn, googleReady, googleLoading, googleError } = useGoogleAuth();

  useEffect(() => {
    if (googleError) {
      Alert.alert(t('common.errorTitle'), googleError);
    }
  }, [googleError]);

  const handleSignIn = async () => {
    if (isSubmitting.current) {
      return;
    }

    if (!email || !password) {
      Alert.alert(t('common.errorTitle'), t('signIn.fillAllFields'));
      return;
    }

    isSubmitting.current = true;
    setLoading(true);

    try {
      await signOut();
    } catch (error) {
      console.log('No active session');
    }

    const result = await signIn(email, password);
    isSubmitting.current = false;
    setLoading(false);

    if (result.success) {
      Alert.alert(t('common.successTitle'), t('signIn.loggedInSuccess'));
      router.push('/Homepage');
    } else {
      Alert.alert(t('common.errorTitle'), result.error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBrand style={styles.logoSlot} logoLinksHome={false} showNotifications={false} />
      <View style={styles.headerUnderline} />

      <TitleText style={styles.title}>{t('signIn.title')}</TitleText>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('signIn.emailLabel')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('signIn.passwordLabel')}</Text>
          <PasswordInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('signIn.submit')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Sign-up')}>
          <Text style={styles.linkText}>
            {t('signIn.noAccount')}
            <Text style={styles.linkBold}>{t('signIn.signUpLink')}</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={promptGoogleSignIn}
          disabled={!googleReady || googleLoading}
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
    padding: 20,
    paddingTop: 80,
  },
  logoSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  headerUnderline: {
    height: 2,
    backgroundColor: '#46a3a4',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 60,
    textAlign: 'center',
  },
  formContainer: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#46a3a4',
    paddingLeft: 8,
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
  },
  button: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#0a445c',
    fontSize: 14,
    marginTop: 8,
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#0a445c',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#b7c2c2',
  },
  dividerText: {
    color: '#6b8788',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    borderRadius: 25,
    paddingVertical: 16,
  },
  googleButtonText: {
    color: '#0a445c',
    fontSize: 16,
    fontWeight: '600',
  },
});