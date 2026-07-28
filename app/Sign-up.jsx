import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import HeaderBrand from './components/HeaderBrand';
import PasswordInput from './components/PasswordInput';
import StatusPickerModal from './components/StatusPickerModal';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { statusLabelsAr, translateOption } from './i18n/optionLabels';
import { signUp } from './services/auth-service';
import { createUserProfile } from './services/profile-service';

export default function SignUp() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dobSelected, setDobSelected] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setDobSelected(true);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
const handleSignUp = async () => {
  if (isSubmitting.current) {
    return;
  }

  try {
    if (!fullName || !email || !password || !confirmPassword || !status || !dobSelected) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords Don't Match", 'Please make sure both passwords are the same');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password Too Short', 'Your password needs to be at least 8 characters long');
      return;
    }

    isSubmitting.current = true;
    setLoading(true);
    const result = await signUp(email, password, fullName);

    if (!result.success) {
      const message =
        result.code === 409
          ? 'An account with this email already exists. Try signing in instead.'
          : "We couldn't create your account right now. Please check your details and try again.";
      Alert.alert('Sign Up Failed', message);
      return;
    }

    const profileResult = await createUserProfile(result.data.$id, {
      fullName,
      email: result.data.email,
      dateOfBirth: dateOfBirth.toISOString(),
      educationStatus: status,
      skills: [],
      interests: [],
      hasCompletedSkillsInterests: false,
    });

    if (profileResult.success) {
      Alert.alert('Success', 'Account created successfully!');
      router.push({ pathname: '/Buildprofileskills', params: { flow: 'signup' } });
    } else {
      Alert.alert(
        'Almost There',
        "Your account was created, but we couldn't save your profile. Please sign in to finish setting it up."
      );
    }
  } catch (error) {
    console.error('Unexpected sign up error:', error);
    Alert.alert('Something Went Wrong', 'Please try again in a moment.');
  } finally {
    isSubmitting.current = false;
    setLoading(false);
  }
};

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <HeaderBrand style={styles.logoSlot} logoLinksHome={false} />

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

            <View>
  <PasswordInput
    style={styles.input}
    placeholder="Password"
    placeholderTextColor="#46a3a4"
    value={password}
    onChangeText={setPassword}
  />
  <Text
    style={[
      styles.hintText,
      password.length > 0 && password.length < 8 && styles.hintTextWarning,
    ]}
  >
    At least 8 characters
  </Text>
</View>

            <PasswordInput
              style={styles.input}
              placeholder={t('signUp.confirmPasswordPlaceholder')}
              placeholderTextColor="#46a3a4"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, !dobSelected && styles.placeholderText]}>
                {dobSelected ? formatDate(dateOfBirth) : t('signUp.dobPlaceholder')}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

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
    justifyContent: 'flex-end',
    gap: 10,
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
  hintText: {
  fontSize: 12,
  color: '#46a3a4',
  marginTop: 6,
  marginLeft: 12,
},
hintTextWarning: {
  color: '#b3455a',
  fontWeight: '600',
},
});