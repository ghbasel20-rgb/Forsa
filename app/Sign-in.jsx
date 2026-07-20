import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Logo from '../assets/images/Logo.svg';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import TitleText from './components/TitleText';
import { signIn, signOut } from './services/auth-service';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const handleSignIn = async () => {
    if (isSubmitting.current) {
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
      Alert.alert('Success', 'Logged in successfully!');
      router.push('/Homepage');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo width={38} height={38} />
        <Text style={styles.brandName}>FORSA</Text>
      </View>

      <TitleText style={styles.title}>LOG IN</TitleText>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
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
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Sign-up')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
          </Text>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 60,
    gap: 8,
  },
  logoSmall: {
    width: 38,
    height: 38,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
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
});