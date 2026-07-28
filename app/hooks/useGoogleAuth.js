import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { GOOGLE_WEB_CLIENT_ID } from '../config/google-auth-config';
import { signInWithGoogleCredential } from '../services/auth-service';
import { createUserProfile, getUserProfile } from '../services/profile-service';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { idToken, accessToken } = response.authentication ?? {};
      completeSignIn({ idToken, accessToken });
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Google sign-in failed. Please try again.');
    }
  }, [response]);

  const completeSignIn = async ({ idToken, accessToken }) => {
    setLoading(true);
    setError(null);

    const result = await signInWithGoogleCredential({ idToken, accessToken });
    if (!result.success) {
      setLoading(false);
      setError(result.error);
      return;
    }

    const profileResult = await getUserProfile(result.data.$id);
    if (profileResult.success) {
      setLoading(false);
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
    setLoading(false);

    if (createResult.success) {
      router.push({ pathname: '/Buildprofileskills', params: { flow: 'signup' } });
    } else {
      setError(createResult.error);
    }
  };

  return {
    promptGoogleSignIn: () => promptAsync(),
    googleReady: !!request,
    googleLoading: loading,
    googleError: error,
  };
}
