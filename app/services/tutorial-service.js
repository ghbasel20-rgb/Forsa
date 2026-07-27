import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_SEEN_KEY = 'forsa_has_seen_tutorial';

export async function hasSeenTutorial() {
  try {
    const stored = await AsyncStorage.getItem(TUTORIAL_SEEN_KEY);
    return stored === 'true';
  } catch (error) {
    return true;
  }
}

export async function markTutorialSeen() {
  try {
    await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
  } catch (error) {
    console.error('Failed to persist tutorial-seen flag:', error);
  }
}
