import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import GoogleIcon from '../assets/images/google.svg';
import HeaderBrand from './components/HeaderBrand';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import PasswordInput from './components/PasswordInput';
import StatusPickerModal from './components/StatusPickerModal';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { statusLabelsAr, translateOption } from './i18n/optionLabels';
import { signUp } from './services/auth-service';
import { createUserProfile } from './services/profile-service';

const CURRENT_YEAR = new Date().getFullYear();
const DOB_YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const DOB_DEFAULT_YEAR = CURRENT_YEAR - 20;

export default function SignUp() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dobDay, setDobDay] = useState(1);
  const [dobMonth, setDobMonth] = useState(0);
  const [dobYear, setDobYear] = useState(DOB_DEFAULT_YEAR);
  const [status, setStatus] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);
  const { promptGoogleSignIn, googleReady, googleLoading, googleError } = useGoogleAuth();

  useEffect(() => {
    if (googleError) {
      Alert.alert(t('common.errorTitle'), googleError);
    }
  }, [googleError]);

  const dobDaysInMonth = new Date(dobYear, dobMonth + 1, 0).getDate();
  const dobDays = Array.from({ length: dobDaysInMonth }, (_, i) => i + 1);
  const dobMonths = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleDateString(language === 'ar' ? 'ar' : 'en-US', { month: 'long' })
  );

  const handleDobMonthChange = (month) => {
    const maxDay = new Date(dobYear, month + 1, 0).getDate();
    setDobMonth(month);
    if (dobDay > maxDay) setDobDay(maxDay);
  };

  const handleDobYearChange = (year) => {
    const maxDay = new Date(year, dobMonth + 1, 0).getDate();
    setDobYear(year);
    if (dobDay > maxDay) setDobDay(maxDay);
  };

  const handleSignUp = async () => {
    if (isSubmitting.current) {
      return;
    }

    if (!fullName || !email || !password || !confirmPassword || !status) {
      Alert.alert(t('common.errorTitle'), t('signUp.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.errorTitle'), t('signUp.passwordsNoMatch'));
      return;
    }

    if (password.length < 8) {
      Alert.alert(t('common.errorTitle'), t('signUp.passwordTooShort'));
      return;
    }

    isSubmitting.current = true;
    setLoading(true);
    const result = await signUp(email, password, fullName);

    if (!result.success) {
      isSubmitting.current = false;
      setLoading(false);
      Alert.alert(t('common.errorTitle'), result.error);
      return;
    }

    const profileResult = await createUserProfile(result.data.$id, {
      fullName,
      email: result.data.email,
      dateOfBirth: new Date(dobYear, dobMonth, dobDay).toISOString(),
      educationStatus: status,
      skills: [],
      interests: [],
      hasCompletedSkillsInterests: false,
    });
    isSubmitting.current = false;
    setLoading(false);

    if (profileResult.success) {
      Alert.alert(t('common.successTitle'), t('signUp.accountCreated'));
      router.push({ pathname: '/Buildprofileskills', params: { flow: 'signup' } });
    } else {
      Alert.alert(t('common.errorTitle'), profileResult.error);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <HeaderBrand style={styles.logoSlot} logoLinksHome={false} showNotifications={false} />
          <View style={styles.headerUnderline} />

          <TitleText style={styles.title}>{t('signUp.title')}</TitleText>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('signUp.fullNamePlaceholder')}
              placeholderTextColor="#46a3a4"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder={t('signUp.emailPlaceholder')}
              placeholderTextColor="#46a3a4"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordFieldGroup}>
              <PasswordInput
                style={styles.input}
                placeholder={t('signUp.passwordPlaceholder')}
                placeholderTextColor="#46a3a4"
                value={password}
                onChangeText={setPassword}
              />
              {password.length > 0 && password.length < 8 && (
                <Text style={styles.errorText}>{t('signUp.passwordTooShort')}</Text>
              )}
            </View>

            <PasswordInput
              style={styles.input}
              placeholder={t('signUp.confirmPasswordPlaceholder')}
              placeholderTextColor="#46a3a4"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.dobField}>
              <Text style={styles.dobLabel}>{t('signUp.dobPlaceholder')}</Text>
              <View style={styles.dobRow}>
                <View style={styles.dobPickerWrap}>
                  <Picker selectedValue={dobDay} onValueChange={setDobDay} style={styles.dobPicker} itemStyle={styles.dobPickerItem}>
                    {dobDays.map((day) => (
                      <Picker.Item key={day} label={String(day)} value={day} />
                    ))}
                  </Picker>
                </View>
                <View style={[styles.dobPickerWrap, styles.dobPickerWrapWide]}>
                  <Picker selectedValue={dobMonth} onValueChange={handleDobMonthChange} style={styles.dobPicker} itemStyle={styles.dobPickerItem}>
                    {dobMonths.map((label, index) => (
                      <Picker.Item key={label} label={label} value={index} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.dobPickerWrap}>
                  <Picker selectedValue={dobYear} onValueChange={handleDobYearChange} style={styles.dobPicker} itemStyle={styles.dobPickerItem}>
                    {DOB_YEARS.map((year) => (
                      <Picker.Item key={year} label={String(year)} value={year} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={[styles.dateText, !status && styles.placeholderText]}>
                {status ? translateOption(status, language, statusLabelsAr) : t('signUp.statusPlaceholder')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('signUp.createAccount')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/Sign-in')}>
              <Text style={styles.linkText}>
                {t('signUp.haveAccount')}
                <Text style={styles.linkBold}>{t('signUp.logInLink')}</Text>
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

          <StatusPickerModal
            visible={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            onSubmit={(value) => {
              setStatus(value);
              setShowStatusModal(false);
            }}
          />
        </View>
      </ScrollView>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 40,
    lineHeight: 52,
  },
  formContainer: {
    gap: 16,
  },
  passwordFieldGroup: {
    gap: 6,
  },
  errorText: {
    color: '#d64545',
    fontSize: 13,
    marginLeft: 8,
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
  dateText: {
    fontSize: 16,
    color: '#0a445c',
  },
  placeholderText: {
    color: '#46a3a4',
  },
  dobField: {
    gap: 6,
  },
  dobLabel: {
    fontSize: 13,
    color: '#46a3a4',
    marginLeft: 12,
  },
  dobRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    borderRadius: 25,
    overflow: 'hidden',
  },
  dobPickerWrap: {
    flex: 1,
  },
  dobPickerWrapWide: {
    flex: 1.4,
  },
  dobPicker: {
    color: '#0a445c',
  },
  dobPickerItem: {
    fontSize: 16,
    color: '#0a445c',
  },
  button: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
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