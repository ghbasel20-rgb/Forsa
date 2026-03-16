import { Stack } from 'expo-router';
import { ProfileProvider } from './ProfileContext';

export default function Layout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileProvider>
  );
}