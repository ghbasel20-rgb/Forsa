import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'forsa_language';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

export async function getLanguage() {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    return stored === 'ar' ? 'ar' : 'en';
  } catch (error) {
    return 'en';
  }
}

export async function setLanguage(code) {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, code);
  } catch (error) {
    console.error('Failed to persist language preference:', error);
  }
}
