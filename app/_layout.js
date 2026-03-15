import { Stack } from 'expo-router';
import { ProfileProvider } from 'ProfileContext.js';

export default function Layout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileProvider>
  );
}SSSS